import { ErrorMessages } from "../constants/messages";
import { ICandidate } from "../interfaces/candidate";
import { IUser } from "../interfaces/user";
import { Candidate } from "../models/candidate";
import { CourtSearch } from "../models/court-search";

interface CandidateService {
    addCandidate (user: IUser, candidate: Candidate, report?:Report, courtSearches?: CourtSearch[]): Promise<ICandidate>;
    getCandidateDataById (user: IUser, candidateId: number): Promise<Candidate | null>;
    getCandidates (user: IUser): Promise<Candidate[]>;
}

const candidateService: CandidateService = {
    async getCandidates (user: IUser): Promise<Candidate[]> {
        try {
            const candidates: Candidate[] = await user.getCandidates!();
            return candidates;
        } catch (error) {
            console.log(error);
            throw new Error(ErrorMessages.errorFetching("Candidates"));
        }
    },

    async getCandidateDataById (user: IUser, candidateId: number): Promise<Candidate | null> {
        try {
            const candidates: Candidate[] = await user.getCandidates!({ where: { candidateId } });
            return candidates[0];
        } catch (error) {
            throw new Error(ErrorMessages.errorFetching("Candidate Data"));
        }
    },

    async addCandidate (user: IUser, candidate: ICandidate, report?: Report, courtSearches?: CourtSearch[]): Promise<ICandidate> {
        try {
            const newCandidate: ICandidate = await user.createCandidate!(candidate as Candidate);
            if (report) {
                await newCandidate.createReport!(report);
            }
            if (courtSearches) {
                for(const courtSearch of courtSearches) {
                    await newCandidate.createCourtSearch!(courtSearch);
                }
            }
            return newCandidate;
        } catch (error) {
            throw new Error(ErrorMessages.errorAdding("Candidate"));
        }
    }
};

export default candidateService;
