import express from "express";
import {
  addQuestions,
  updateQuestion,
  getQuestions,
  startSession,
  submitAnswer,
  toggleFlagQuestion,
  completeSession,
} from "../controllers/PlabController";

const router = express.Router();

// Admin routes (now public)
router.post("/admin/questions", addQuestions);
router.put("/admin/questions/:questionId", updateQuestion);

// User routes
router.get("/questions", getQuestions);

router.post("/sessions/start", startSession);
router.post("/sessions/:sessionId/answer", submitAnswer);
router.post("/sessions/:sessionId/flag", toggleFlagQuestion);
router.post("/sessions/:sessionId/complete", completeSession);

export default router;
