import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";
import { buildResponse } from "../utils/build-response";
import { SuccessMessages } from "../constants/messages";
import CandidateService from "../services/candidate";

const candidateController = {
    getCandidates: async (req: Request, res: Response, next: NextFunction) => {
        const data = await CandidateService.getCandidates(req.body.user);
        buildResponse(res, httpStatus.OK, SuccessMessages.fetched("Candidates"), data);
    },
    getCandidateDataById: async (req: Request, res: Response, next: NextFunction) => {
        const data = await CandidateService.getCandidateDataById(req.body.user, +req.params.candidateId);
        buildResponse(res, httpStatus.OK, SuccessMessages.fetched("Candidate Data"), data);
    },
    preAdverseAction: async (req: Request, res: Response, next: NextFunction) => {
        const actionObj = {
            
        };
        // const data = await CandidateService.preAdverseAction(req.body.user, +req.params.candidateId, req.body);
        buildResponse(res, httpStatus.OK, SuccessMessages.actionPerformed("Pre Adverse"), null);
    },
    engageCandidate: async (req: Request, res: Response, next: NextFunction) => {
        buildResponse(res, httpStatus.OK, SuccessMessages.actionPerformed("Engage"), null);
    },
    exportCandidates: async (req: Request, res: Response, next: NextFunction) => {
        buildResponse(res, httpStatus.OK, SuccessMessages.export("Candidates"), null);
    },
    addCandidate: async (req: Request, res: Response, next: NextFunction) => {
        const data = await CandidateService.addCandidate(req.body.user, req.body.candidate, req.body.candidate.report, req.body.candidate.courtSearches);
        buildResponse(res, httpStatus.OK, SuccessMessages.added("Candidate"), data);
    },
    deleteCandidate: async (req: Request, res: Response, next: NextFunction) => {
        // delete candidate
        buildResponse(res, httpStatus.OK, SuccessMessages.deleted("Candidate"), null);
    }
}

export default candidateController;
