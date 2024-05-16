import { Op } from "sequelize";
import { ErrorMessages } from "../common/constants/messages";
import { ICandidate } from "../common/interfaces/candidate";
import { IUser } from "../common/interfaces/user";
import { Candidate } from "../models/candidate";
import { CandidateReport } from "../models/candidate-report";
import { CourtSearch } from "../models/court-search";
import { Adjudication, Status } from "../common/constants/global";
import { PreAdverseEmail } from "../models/pre-adverse-email";
import { EmailConfig } from "../common/interfaces/pre-adverse-email-config";
import schedule from "node-schedule";
import { CandidateAttributes, CandidateService, IGetCandidateListFilter, IGetCandidateListResponse, PaginationInterface } from "../interfaces/candidate-service";
import { processPendingEmails } from "../schedulers/email-scheduler";
import CustomError from "../common/interfaces/custom-error";
import httpStatus from "http-status";

const candidateService: CandidateService = {
    async getCandidateList (
        user: IUser,
        paginationData: PaginationInterface,
        filterData: IGetCandidateListFilter
    ): Promise<IGetCandidateListResponse> {
        try {
            const whereClause: any = {
                [Op.and]: [
                    filterData.filter || {}, // Include filterData.filter if present
                    {
                        [Op.or]: [
                            { name: { [Op.like]: `%${filterData.search}%` } },
                            { location: { [Op.like]: `%${filterData.search}%` } },
                            { "$candidateReport.status$": { [Op.like]: `%${filterData.search}%` } },
                            { "$candidateReport.adjudication$": { [Op.like]: `%${filterData.search}%` } },
                            { "$candidateReport.updatedAt$": { [Op.like]: `%${filterData.search}%` } }
                        ]
                    }
                ]
            };

            const { rows: candidates, count: totalCount } = await Candidate.findAndCountAll({
                include: [
                    {
                        model: CandidateReport,
                        attributes: ["status", "adjudication", "updatedAt"]
                    }
                ],
                attributes: ["name", "location"],
                limit: paginationData.pageSize,
                offset: (paginationData.pageNo - 1) * paginationData.pageSize,
                where: whereClause,
                raw: true // Return raw data for mapping
            });
            const mappedCandidates: CandidateAttributes[] = candidates.map((candidate: any) => ({
                name: candidate.name,
                location: candidate.location,
                status: candidate['candidateReport.status'],
                adjudication: candidate['candidateReport.adjudication'],
                updatedAt: candidate['candidateReport.updatedAt']
            }));

            return { data: mappedCandidates, totalCount };
        } catch (error) {
            console.log(error);
            if (error instanceof CustomError) {
                throw error;
            }
            throw new CustomError(ErrorMessages.errorFetching("Candidates"), httpStatus.INTERNAL_SERVER_ERROR);
        }
    },

    async getCandidateById (user: IUser, candidateId: number): Promise<Candidate> {
        try {
            const candidate: Candidate | null = await Candidate.findOne!({ where: { candidateId }, include: [CandidateReport, CourtSearch] });
            if (!candidate) {
                throw new CustomError(ErrorMessages.notFound("Candidate"), httpStatus.BAD_REQUEST);
            }
            return candidate;
        } catch (error) {
            if (error instanceof CustomError) {
                throw error;
            }
            throw new CustomError(ErrorMessages.errorFetching("Candidate Data"), httpStatus.INTERNAL_SERVER_ERROR);
        }
    },

    async addCandidate (user: IUser, candidate: ICandidate, report?: CandidateReport, courtSearches?: CourtSearch[]): Promise<ICandidate> {
        try {
            const newCandidate: ICandidate = await user.createCandidate!(candidate as Candidate);
            if (report) {
                await newCandidate.createCandidateReport!(report);
            }
            if (courtSearches) {
                await Promise.all(courtSearches.map(courtSearch => newCandidate.createCourtSearch!(courtSearch)));
            }
            return newCandidate;
        } catch (error) {
            console.error(error);
            throw new CustomError(ErrorMessages.errorAdding("Candidate"), httpStatus.INTERNAL_SERVER_ERROR);
        }
    },
    async exportCandidates (user: IUser) {
        try {
            const candidates = await this.getCandidateList(user, { pageNo: 1, pageSize: 1000 }, { search: '', filter: {} })
                .then(response => response.data);
            const csvData = candidates.map(candidate => [
                candidate.name,
                candidate.location,
                candidate.status,
                candidate.adjudication,
                candidate.updatedAt.toString() // Convert date to string format
            ]);

            // Add header row by adding a row on top
            csvData.unshift(['Name', 'Location', 'Status', 'Adjudication', 'Updated At']);

            // Convert to CSV string
            const csvString = csvData.map(row => row.join(',')).join('\n');

            return csvString;
        } catch (error) {
            console.error(error);
            throw new CustomError(ErrorMessages.errorExporting("Candidates"), httpStatus.INTERNAL_SERVER_ERROR);
        }
    },

    async engageCandidate (user: IUser, candidateId: number) {
        try {
            const candidate: ICandidate = await this.getCandidateById(user, candidateId);
            const candidateReport = await candidate.getCandidateReport!();
            
            if (!candidateReport) {
                throw new CustomError(ErrorMessages.notFound("Candidate Report"), httpStatus.BAD_REQUEST);
            }
            await PreAdverseEmail.destroy({ where: { candidateId } });
            candidateReport.adjudication = Adjudication.ENGAGE;
            candidateReport.status = Status.CLEAR;
            await candidateReport.save();
        } catch (error) {
            if (error instanceof CustomError) {
                throw error;
            }
            throw new CustomError(ErrorMessages.errorPerformingAction("Engage"), httpStatus.INTERNAL_SERVER_ERROR);
        }
    },
    async preAdverseAction (user: IUser, candidateId: number, preAdverseData: EmailConfig)  {
        try {
            // Perform pre-adverse action
            const candidate: ICandidate[] = await user.getCandidates!({ where: { candidateId } });
            if (!candidate) {
                throw new Error(ErrorMessages.notFound("Candidate"));
            }
            const candidateReport = await candidate[0].getCandidateReport!();
            if (!candidateReport) {
                throw new Error(ErrorMessages.notFound("Candidate Report"));
            }
            await candidate[0].createPreAdverseEmail!(preAdverseData);

            // Schedule job to process pending emails
            console.log('Scheduling job to process pending emails every 5 minutes', new Date());
            // A cron job is a scheduled task executed at specific intervals by a cron daemon or scheduler in Unix-like operating systems. 
            // It allows you to automate repetitive tasks, such as running scripts, executing commands, or sending emails, 
            // without manual intervention.
            const job = schedule.scheduleJob(`*/${preAdverseData.days} * * * *`, () => {
                console.log('Processing pending emails at ', new Date());
                processPendingEmails(candidateId);
            });

            candidateReport.adjudication = Adjudication.ADVERSE_ACTION;
            candidateReport.status = Status.CONSIDER;
            await candidateReport.save();

        }catch (error) {
            throw new CustomError(ErrorMessages.errorPerformingAction("Pre Adverse"), httpStatus.INTERNAL_SERVER_ERROR);
        }
    }
};

export default candidateService;
