import { CourtSearch } from "../models/court-search";

export interface ICandidate {
    candidateId: number;
    name: string;
    email: string;
    dob: Date;
    phone: string;
    zipcode: string;
    socialSecurity: string;
    driversLicense: string;
    createdDate: Date;
    userId: number;
    
    createCourtSearch ? (courtSearch: CourtSearch): unknown;
    createReport ? (report: Report): unknown;
}