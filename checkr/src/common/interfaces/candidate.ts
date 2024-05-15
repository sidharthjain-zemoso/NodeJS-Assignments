import { CandidateReport } from "../../models/candidate-report";
import { CourtSearch } from "../../models/court-search";

export interface ICandidate {
    candidateId: number;
    name: string;
    email: string;
    dob: Date;
    phone: string;
    zipcode: string;
    socialSecurity: string;
    driversLicense: string;
    userId: number;
    
    save (): PromiseLike<unknown>;
    createCourtSearch ? (courtSearch: CourtSearch): PromiseLike<unknown>;
    createCandidateReport?(report: CandidateReport): PromiseLike<unknown>;
    createPreAdverseEmail?(options:any): PromiseLike<unknown>;
    getCandidateReport?(): CandidateReport | PromiseLike<CandidateReport>;
}