import express from "express";
import candidateController from "../controllers/candidate";
import candidateValidators from "../validators/candidate";
import { tryCatch } from "../utils/try-catch-wrapper";

const router = express.Router();

router.get("/list", candidateValidators.getCandidates, tryCatch(candidateController.getCandidates));

router.get("/:candidateId/details", candidateValidators.getCandidateDataById, tryCatch(candidateController.getCandidateDataById));

router.post("/:candidateId/actions/pre-adverse", candidateValidators.preAdverseAction, tryCatch(candidateController.preAdverseAction));

router.post("/:candidateId/actions/engage", candidateValidators.engageCandidate, tryCatch(candidateController.engageCandidate));

router.get("/export", candidateValidators.exportCandidates, tryCatch(candidateController.exportCandidates));

export default router;
