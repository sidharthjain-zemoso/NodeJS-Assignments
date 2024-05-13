import { Candidate } from "../models/candidate";

export interface IUser {
    id?: number;
    email: string;
    password: string;

    createCandidate?(candidate: Candidate): Candidate | PromiseLike<Candidate>;
    getCandidates?(options?: any): Candidate[] | PromiseLike<Candidate[]>;
}