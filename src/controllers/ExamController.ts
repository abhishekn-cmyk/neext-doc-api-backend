import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import Exam from "../models/Exam"; // your Exam schema

// ============ ADMIN ============

// Create Exam
export const createExam = asyncHandler(async (req: Request, res: Response) => {
  const exam = await Exam.create(req.body);

  res.status(201).json({ success: true, data: exam });
});

// Recent Activities (last 5 created exams)
export const getRecentActivities = asyncHandler(
  async (req: Request, res: Response) => {
    const recentExams = await Exam.find({}).sort({ createdAt: -1 }).limit(5);

    const activities = recentExams.map((exam) => ({
      id: exam._id,
      type: "exam",
      message: `New exam created: ${exam.title}`,
      date: exam.createdAt,
    }));

    res.json({ success: true, data: activities });
  }
);

// Update Exam
export const updateExam = asyncHandler(async (req: Request, res: Response) => {
  const exam = await Exam.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!exam) {
    res.status(404).json({ success: false, message: "Exam not found" });
    return;
  }

  res.json({ success: true, data: exam });
});

// Delete Exam
export const deleteExam = asyncHandler(async (req: Request, res: Response) => {
  const exam = await Exam.findByIdAndDelete(req.params.id);

  if (!exam) {
    res.status(404).json({ success: false, message: "Exam not found" });
    return;
  }

  res.json({ success: true, message: "Exam deleted" });
});

// ============ USER ============

// Get All Exams
export const getExams = asyncHandler(async (req: Request, res: Response) => {
  const exams = await Exam.find();
  res.json({ success: true, data: exams });
});

// Get Single Exam
export const getExamById = asyncHandler(async (req: Request, res: Response) => {
  const exam = await Exam.findById(req.params.id);

  if (!exam) {
    res.status(404).json({ success: false, message: "Exam not found" });
    return;
  }

  res.json({ success: true, data: exam });
});
