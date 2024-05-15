import express from "express";
import candidateController from "../controllers/candidate";
import candidateValidators from "../validators/validators/candidate";
import { tryCatch } from "../utils/try-catch-wrapper";
import isAuth from "../common/middlewares/auth";

const router = express.Router();

router.get("/list", isAuth, candidateValidators.getCandidateList, tryCatch(candidateController.getCandidateList));

router.post("/add", isAuth, candidateValidators.addCandidate, tryCatch(candidateController.addCandidate));

router.get("/:candidateId", isAuth, candidateValidators.getCandidateById, tryCatch(candidateController.getCandidateById));

router.post("/:candidateId/actions/pre-adverse", isAuth, candidateValidators.preAdverseAction, tryCatch(candidateController.preAdverseAction));

router.put("/:candidateId/actions/engage", isAuth, candidateValidators.engageCandidate, tryCatch(candidateController.engageCandidate));

router.get("/export", isAuth, candidateValidators.exportCandidates, tryCatch(candidateController.exportCandidates));

export default router;
