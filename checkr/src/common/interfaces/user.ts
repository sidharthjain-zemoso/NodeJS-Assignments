import { Candidate } from "../../models/candidate";

export interface IUser {
    name: string;
    userId?: number;
    email: string;
    password: string;
    
    getCandidateByPk? (options: any): PromiseLike<Candidate>;
    countCandidates?(): number | PromiseLike<number>;
    createCandidate?(candidate: Candidate): Candidate | PromiseLike<Candidate>;
    getCandidates?(options?: any): Candidate[] | PromiseLike<Candidate[]>;
}