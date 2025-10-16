import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import ExamSession from "../models/ExamSession";

// ============ ADMIN ============

// Create Exam Session
export const createSession = asyncHandler(
  async (req: Request, res: Response) => {
    const session = await ExamSession.create(req.body);

    res.status(201).json({ success: true, data: session });
  }
);

// Update Exam Session
export const updateSession = asyncHandler(
  async (req: Request, res: Response) => {
    const session = await ExamSession.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!session) {
      res.status(404).json({ success: false, message: "Session not found" });
      return;
    }

    res.json({ success: true, data: session });
  }
);

// Delete Exam Session
export const deleteSession = asyncHandler(
  async (req: Request, res: Response) => {
    const session = await ExamSession.findByIdAndDelete(req.params.id);

    if (!session) {
      res.status(404).json({ success: false, message: "Session not found" });
      return;
    }

    res.status(200).json({ success: true, message: "Session deleted" });
  }
);

// ============ USER ============

// Get All Sessions (for an Exam)
export const getSessionsByExam = asyncHandler(
  async (req: Request, res: Response) => {
    const sessions = await ExamSession.find({
      exam: req.params.examId,
    }).populate("exam");

    res.json({ success: true, data: sessions });
  }
);

// Register User for Session
export const registerForSession = asyncHandler(
  async (req: Request, res: Response) => {
    const { sessionId } = req.params;
    const userId = req.body.userId; // typically from auth middleware

    const session = await ExamSession.findByIdAndUpdate(
      sessionId,
      { $addToSet: { registeredUsers: userId } },
      { new: true }
    ).populate("exam");

    if (!session) {
      res.status(404).json({ success: false, message: "Session not found" });
      return;
    }

    res.json({ success: true, data: session });
  }
);
