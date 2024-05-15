import { ICandidate } from "../common/interfaces/candidate";
import { EmailConfig } from "../common/interfaces/pre-adverse-email-config";
import { IUser } from "../common/interfaces/user";
import { Candidate } from "../models/candidate";
import { CandidateReport } from "../models/candidate-report";
import { CourtSearch } from "../models/court-search";

export interface CandidateAttributes {
    name: string;
    location: string;
    status: string;
    adjudication: string;
    updatedAt: Date;
}

export interface GetCandidatesResponseInterface {
    data: CandidateAttributes[];
    totalCount: number;
}

export interface PaginationInterface {
    pageNo: number;
    pageSize: number;
}

export interface GetCandidatesFilterInterface {
    search?: string;
    filter?: {
        name?: string;
        location?: string;
        status?: string;
        adjudication?: string;
    }
}

export interface CandidateService {
    preAdverseAction (user: IUser, candidateId: number, preAdverseData: EmailConfig): unknown;
    engageCandidate (user: any, candidateId: number): unknown;
    exportCandidates (user: any): unknown;
    addCandidate (user: IUser, candidate: Candidate, report?: CandidateReport, courtSearches?: CourtSearch[]): Promise<ICandidate>;
    getCandidateDataById (user: IUser, candidateId: number): Promise<Candidate | null>;
    getCandidates (user: IUser, paginationData: PaginationInterface, filterData: GetCandidatesFilterInterface): Promise<GetCandidatesResponseInterface>;
}