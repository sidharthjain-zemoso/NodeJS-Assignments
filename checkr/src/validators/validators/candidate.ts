import { addCandidateSchema, candidateIdPathParamSchema, exportCandidatesSchema, getDataWithSearchAndFilterSchema, preAdverseActionSchema } from "../schemas/candidate";
import { validatePath, validateQuery, validateRequestBody } from "../../common/middlewares/request-validator-middleware";


const candidateValidators = {
    getCandidateList: validateQuery(getDataWithSearchAndFilterSchema),
    getCandidateById: validatePath(candidateIdPathParamSchema),
    preAdverseAction: validateRequestBody(preAdverseActionSchema),
    engageCandidate: validatePath(candidateIdPathParamSchema),
    exportCandidates: validateRequestBody(exportCandidatesSchema),
    addCandidate: validateRequestBody(addCandidateSchema),
};

export default candidateValidators;
