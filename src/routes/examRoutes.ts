import express from "express";
import {
  createExam,
  updateExam,
  deleteExam,
  getExams,
  getExamById,
  getRecentActivities,
} from "../controllers/ExamController";

import {
  createSession,
  updateSession,
  deleteSession,
  getSessionsByExam,
  registerForSession,
} from "../controllers/ExamSession";

import { protect } from "../middlewares/authMiddleware";
import { authorize } from "../middlewares/roleMiddleware";

const router = express.Router();

// ============ Exams ============
// Admin-only
router.post("/exams", protect, authorize(["SuperAdmin"]), createExam);
router.put("/exams/:id", protect, authorize(["SuperAdmin"]), updateExam);
router.delete("/exams/:id", protect, authorize(["SuperAdmin"]), deleteExam);

// Public/User
router.get("/exams", getExams);
router.get(
  "/exams/:id",
  protect,
  authorize(["User", "SuperAdmin"]),
  getExamById
);
router.get("/activities/recent", getRecentActivities);
// ============ Sessions ============
// Admin-only
router.post("/sessions", protect, authorize(["SuperAdmin"]), createSession);
router.put("/sessions/:id", protect, authorize(["SuperAdmin"]), updateSession);
router.delete(
  "/sessions/:id",
  protect,
  authorize(["SuperAdmin"]),
  deleteSession
);

// User (view + register)
router.get("/sessions/:examId", protect, getSessionsByExam);
router.post("/sessions/:sessionId/register", protect, registerForSession);

export default router;
