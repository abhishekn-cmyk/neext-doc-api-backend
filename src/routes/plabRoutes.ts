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
import { protect } from "../middlewares/authMiddleware";
import { authorize } from "../middlewares/roleMiddleware";

const router = express.Router();

// Admin routes
router.post(
  "/admin/questions",
  protect,
  authorize(["SuperAdmin"]),
  addQuestions
);
router.put(
  "/admin/questions/:questionId",
  protect,
  authorize(["SuperAdmin"]),
  updateQuestion
);

// User routes
// Admin fetch questions
router.get("/questions", getQuestions);

router.post("/sessions/start", protect, startSession);
router.post("/sessions/:sessionId/answer", protect, submitAnswer);
router.post("/sessions/:sessionId/flag", protect, toggleFlagQuestion);
router.post("/sessions/:sessionId/complete", protect, completeSession);

export default router;
