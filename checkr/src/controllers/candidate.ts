import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";
import { buildResponse } from "../utils/build-response";
import { SuccessMessages } from "../constants/messages";

const candidateController = {
    getCandidates: async (req: Request, res: Response, next: NextFunction) => {
        const data: any[] = []; // fetch using candidate service
        buildResponse(res, httpStatus.OK, SuccessMessages.fetched("Candidates"), data);
    },
    getCandidateDataById: async (req: Request, res: Response, next: NextFunction) => {
        buildResponse(res, httpStatus.OK, SuccessMessages.fetched("Candidate Data"), null);
    },
    preAdverseAction: async (req: Request, res: Response, next: NextFunction) => {
        buildResponse(res, httpStatus.OK, SuccessMessages.actionPerformed("Pre Adverse"), null);
    },
    engageCandidate: async (req: Request, res: Response, next: NextFunction) => {
        buildResponse(res, httpStatus.OK, SuccessMessages.actionPerformed("Engage"), null);
    },
    exportCandidates: async (req: Request, res: Response, next: NextFunction) => {
        buildResponse(res, httpStatus.OK, SuccessMessages.export("Candidates"), null);
    },
    addCandidate: async (req: Request, res: Response, next: NextFunction) => {
        // add candidate
        buildResponse(res, httpStatus.OK, SuccessMessages.added("Candidate"), null);
    },
    deleteCandidate: async (req: Request, res: Response, next: NextFunction) => {
        // delete candidate
        buildResponse(res, httpStatus.OK, SuccessMessages.deleted("Candidate"), null);
    }
}

export default candidateController;
