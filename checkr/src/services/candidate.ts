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
import { CandidateAttributes, CandidateService, GetCandidatesFilterInterface, GetCandidatesResponseInterface, PaginationInterface } from "../interfaces/candidate-service";
import { processPendingEmails } from "../schedulers/email-scheduler";

const candidateService: CandidateService = {
    async getCandidates (
        user: IUser,
        paginationData: PaginationInterface,
        filterData: GetCandidatesFilterInterface
    ): Promise<GetCandidatesResponseInterface> {
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

            // const candidates: any[] = await user.getCandidates!({
            //     include: [
            //         {
            //             model: CandidateReport,
            //             attributes: ["status", "adjudication", "updatedAt"]
            //         }
            //     ],
            //     attributes: ["name", "location"],
            //     limit: paginationData.pageSize,
            //     offset: (paginationData.pageNo - 1) * paginationData.pageSize,
            //     where: {
            //         [Op.and]: [
            //             filterData.filter,
            //             {
            //                 [Op.or]: [
            //                     { name: { [Op.like]: `%${filterData.search}%` } },
            //                     { location: { [Op.like]: `%${filterData.search}%` } },
            //                     { "$candidateReport.status$": { [Op.like]: `%${filterData.search}%` } },
            //                     { "$candidateReport.adjudication$": { [Op.like]: `%${filterData.search}%` } },
            //                     { "$candidateReport.updatedAt$": { [Op.like]: `%${filterData.search}%` } }
            //                 ]
            //             }
            //         ]
            //     },
            //     raw: true // Return raw data for mapping
            // });
            // const totalCount = await user.countCandidates!();
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
            throw new Error(ErrorMessages.errorFetching("Candidates"));
        }
    },

    async getCandidateDataById (user: IUser, candidateId: number): Promise<Candidate | null> {
        try {
            const candidates: Candidate[] = await Candidate.findAll!({ where: { candidateId }, include: [CandidateReport, CourtSearch] });
            return candidates[0];
        } catch (error) {
            throw new Error(ErrorMessages.errorFetching("Candidate Data"));
        }
    },

    async addCandidate (user: IUser, candidate: ICandidate, report?: CandidateReport, courtSearches?: CourtSearch[]): Promise<ICandidate> {
        try {
            const newCandidate: ICandidate = await user.createCandidate!(candidate as Candidate);
            if (report) {
                await newCandidate.createCandidateReport!(report);
            }
            const waitingToResolved = [];
            if (courtSearches) {
                for (const courtSearch of courtSearches) {
                    waitingToResolved.push(newCandidate.createCourtSearch!(courtSearch));
                }
            }
            await Promise.all(waitingToResolved);
            return newCandidate;
        } catch (error) {
            console.error(error);
            throw new Error(ErrorMessages.errorAdding("Candidate"));
        }
    },
    async exportCandidates (user: IUser) {
        // Export candidates
        const candidates = await this.getCandidates(user, { pageNo: 1, pageSize: 1000 }, { search: '', filter: {} })
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
    },

    async engageCandidate (user: IUser, candidateId: number) {
        try {
            const candidate: ICandidate | null = await this.getCandidateDataById(user, candidateId);
            if (!candidate) {
                throw new Error(ErrorMessages.notFound("Candidate"));
            }
            const candidateReport = await candidate.getCandidateReport!();

            if (!candidateReport) {
                throw new Error(ErrorMessages.notFound("Candidate Report"));
            }
            await PreAdverseEmail.destroy({ where: { candidateId } });
            candidateReport.adjudication = Adjudication.ENGAGE;
            candidateReport.status = Status.CLEAR;
            await candidateReport.save();
        } catch (error) {
            throw new Error(ErrorMessages.errorFetching("Candidate"));
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
            throw new Error(ErrorMessages.errorPerformingAction("Pre Adverse"));
        }
    }
};

export default candidateService;
