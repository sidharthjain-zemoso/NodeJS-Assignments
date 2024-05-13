import { z } from "zod";
import { validateRequest } from "../middlewares/request-validator-middleware";

const getCandidatesSchema = z.object({
    page: z.number().int().positive().optional(),
    limit: z.number().int().positive().optional(),
    search: z.string().optional(),
});

const getCandidateDataByIdSchema = z.object({
    candidateId: z.string().uuid(),
});

const preAdverseActionSchema = z.object({
    candidateId: z.string().uuid(),
    action: z.string().optional(),
    reason: z.string().optional(),
});

const engageCandidateSchema = z.object({
    candidateId: z.string().uuid(),
});

const exportCandidatesSchema = z.object({
    search: z.string().optional(),
});

const candidateValidators = {
    getCandidates: validateRequest(getCandidatesSchema),
    getCandidateDataById: validateRequest(getCandidateDataByIdSchema),
    preAdverseAction: validateRequest(preAdverseActionSchema),
    engageCandidate: validateRequest(engageCandidateSchema),
    exportCandidates: validateRequest(exportCandidatesSchema),
};

export default candidateValidators;
