import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";
import { buildResponse } from "../utils/build-response";
import { SuccessMessages } from "../common/constants/messages";
import CandidateService from "../services/candidate";
import { EmailConfig } from "../common/interfaces/pre-adverse-email-config";

const candidateController = {

    getCandidates: async (req: Request, res: Response, next: NextFunction) => {
        const { user } = req.body;
        const { pageNo = '1', pageSize = '20', search = '', filter = '{}' } = req.query;

        // Parse the filter object from JSON string
        const parsedFilter = JSON.parse(filter as string);

        // Prepare pagination data
        const paginationData = { pageNo: +pageNo, pageSize: +pageSize };

        // Prepare filter data
        const filterData = { search: search.toString(), filter: parsedFilter };

        const data = await CandidateService.getCandidates(user, paginationData, filterData);
        buildResponse(res, httpStatus.OK, SuccessMessages.fetched("Candidates"), data);
    },

    getCandidateDataById: async (req: Request, res: Response, next: NextFunction) => {
        const data = await CandidateService.getCandidateDataById(req.body.user, +req.params.candidateId);
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

        // This line sets the Content-Type header of the response to indicate that the content being sent is of type CSV (Comma-Separated Values). This header informs the browser or client that the data being sent should be interpreted as CSV format.
        res.setHeader('Content-Type', 'text/csv');
        // This line sets the Content-Disposition header of the response. The attachment disposition type indicates that the content should be treated as a downloadable file rather than displayed directly in the browser. The filename="candidates.csv" parameter suggests the default filename that the browser should use when saving the file. In this case, it suggests "candidates.csv" as the filename.
        res.setHeader('Content-Disposition', 'attachment; filename="candidates.csv"');
        res.send(csvString);
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
