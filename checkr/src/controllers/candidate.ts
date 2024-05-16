import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";
import { buildCsvResponse, buildResponse } from "../utils/build-response";
import { SuccessMessages } from "../common/constants/messages";
import CandidateService from "../services/candidate";
import { EmailConfig } from "../common/interfaces/pre-adverse-email-config";

const candidateController = {

    getCandidateList: async (req: Request, res: Response, next: NextFunction) => {
        const { user } = req.body;
        const { pageNo = '1', pageSize = '20', search = '', filter = '{}' } = req.query;

        // Parse the filter object from JSON string
        const parsedFilter = JSON.parse(filter as string);

        // Prepare pagination data
        const paginationData = { pageNo: +pageNo, pageSize: +pageSize };

        // Prepare filter data
        const filterData = { search: search.toString(), filter: parsedFilter };

        const data = await CandidateService.getCandidateList(user, paginationData, filterData);
        buildResponse(res, httpStatus.OK, SuccessMessages.fetched("Candidates"), data);
    },

    getCandidateById: async (req: Request, res: Response, next: NextFunction) => {
        const data = await CandidateService.getCandidateById(req.body.user, +req.params.candidateId);
        buildResponse(res, httpStatus.OK, SuccessMessages.fetched("Candidate Data"), data);
    },

    preAdverseAction: async (req: Request, res: Response, next: NextFunction) => {
        const { from, to, subject, text, count=3, days } = req.body;
        const preAdverseData: EmailConfig = {
            fromEmail: from,
            toEmail: to,
            subject,
            body: text,
            count,
            days
        };
        await CandidateService.preAdverseAction(req.body.user, +req.params.candidateId, preAdverseData);
        buildResponse(res, httpStatus.OK, SuccessMessages.actionPerformed("Pre Adverse"), null);
    },

    engageCandidate: async (req: Request, res: Response, next: NextFunction) => {
        await CandidateService.engageCandidate(req.body.user, +req.params.candidateId);
        buildResponse(res, httpStatus.OK, SuccessMessages.actionPerformed("Engage"), null);
    },

    exportCandidates: async (req: Request, res: Response, next: NextFunction) => {

        const csvString = await CandidateService.exportCandidates(req.body.user);
        buildCsvResponse(res, httpStatus.OK, csvString);
    },

    addCandidate: async (req: Request, res: Response, next: NextFunction) => {
        const data = await CandidateService.addCandidate(req.body.user, req.body.candidate, req.body.candidate.report, req.body.candidate.courtSearches);
        buildResponse(res, httpStatus.OK, SuccessMessages.added("Candidate"), data);
    },
}

export default candidateController;
