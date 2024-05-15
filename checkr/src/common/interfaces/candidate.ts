import { CandidateReport } from "../../models/candidate-report";
import { CourtSearch } from "../../models/court-search";

export interface ICandidate {
    save (): unknown;
    candidateId: number;
    name: string;
    email: string;
    dob: Date;
    phone: string;
    zipcode: string;
    socialSecurity: string;
    driversLicense: string;
    userId: number;
    
    createCourtSearch ? (courtSearch: CourtSearch): unknown;
    createCandidateReport?(report: CandidateReport): unknown;
    getCandidateReport?(): CandidateReport | PromiseLike<CandidateReport>;
    createPreAdverseEmail?(options:any): unknown;
}