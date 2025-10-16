import { Request, Response } from "express";
import PlabQuestion, { IQuestion } from "../models/PlabQuestion";
import PLABSession from "../models/PlabQuizSession";
import asyncHandler from "express-async-handler";

// ---------------- Admin: Add Questions ----------------
export const addQuestions = asyncHandler(
  async (req: Request, res: Response) => {
    const questions: Partial<IQuestion>[] = req.body.questions || [];

    if (questions.length === 0) {
      res.status(400).json({ message: "No questions provided" });
      return;
    }

    const createdQuestions = await PlabQuestion.insertMany(questions);

    res
      .status(201)
      .json({ message: "Questions added", questions: createdQuestions });
  }
);

// ---------------- Admin: Update Question ----------------
export const updateQuestion = asyncHandler(
  async (req: Request, res: Response) => {
    const { questionId } = req.params;
    const updateData = req.body;

    const updatedQuestion = await PlabQuestion.findByIdAndUpdate(
      questionId,
      updateData,
      { new: true }
    );
    if (!updatedQuestion) {
      res.status(404).json({ message: "Question not found" });
      return;
    }

    res.json({ message: "Question updated", question: updatedQuestion });
  }
);

// ---------------- User: Get Questions ----------------
export const getQuestions = asyncHandler(
  async (req: Request, res: Response) => {
    const { examId, category, difficulty, cpdTag } = req.query;

    let query: any = {};
    if (examId) query.examId = examId;
    if (category) query.category = category;
    if (difficulty) query.difficulty = difficulty;
    if (cpdTag) query.cpdTag = cpdTag === "true";

    const questions = await PlabQuestion.find(query).sort({ createdAt: 1 });
    res.json({ questions });
  }
);

// ---------------- User: Start Session ----------------
export const startSession = asyncHandler(
  async (req: Request, res: Response) => {
    const { userId, examId, filters } = req.body;

    if (!userId || !examId) {
      res.status(400).json({ message: "userId and examId are required" });
      return;
    }

    let session = await PLABSession.findOne({
      userId,
      examId,
      completed: false,
    });

    if (!session) {
      session = new PLABSession({
        userId,
        examId,
        currentQuestion: 0,
        answers: [],
        flaggedQuestions: [],
        completed: false,
        score: 0,
        filters: filters || {},
      });
      await session.save();
    }

    res.json({
      sessionId: session._id,
      currentQuestion: session.currentQuestion,
      score: session.score,
    });
  }
);

// ---------------- User: Submit Answer ----------------
export const submitAnswer = asyncHandler(
  async (req: Request, res: Response) => {
    const { sessionId } = req.params;
    const { questionId, selectedAnswer } = req.body;

    const session = await PLABSession.findById(sessionId);
    const question = await PlabQuestion.findById(questionId);

    if (!session) {
      res.status(404).json({ message: "Session not found" });
      return;
    }
    if (!question) {
      res.status(404).json({ message: "Question not found" });
      return;
    }
    if (!selectedAnswer) {
      res.status(400).json({ message: "selectedAnswer is required" });
      return;
    }

    const isCorrect = question.correctAnswer === selectedAnswer;
    session.answers.push({
      questionId: question._id.toString(),
      selectedAnswer,
      correctAnswer: question.correctAnswer,
      isCorrect,
    });
    session.currentQuestion = session.answers.length;
    session.score = session.answers.filter((a) => a.isCorrect).length;

    await session.save();

    res.json({
      currentQuestion: session.currentQuestion,
      score: session.score,
    });
  }
);

// ---------------- User: Toggle Flag ----------------
export const toggleFlagQuestion = asyncHandler(
  async (req: Request, res: Response) => {
    const { sessionId } = req.params;
    const { questionIndex } = req.body;

    const session = await PLABSession.findById(sessionId);
    if (!session || questionIndex === undefined) {
      res.status(400).json({ message: "Invalid session or question index" });
      return;
    }

    const flaggedSet = new Set(session.flaggedQuestions);
    flaggedSet.has(questionIndex)
      ? flaggedSet.delete(questionIndex)
      : flaggedSet.add(questionIndex);
    session.flaggedQuestions = Array.from(flaggedSet);
    await session.save();

    res.json({ flaggedQuestions: session.flaggedQuestions });
  }
);

// ---------------- User: Complete Session ----------------
export const completeSession = asyncHandler(
  async (req: Request, res: Response) => {
    const { sessionId } = req.params;

    const session = await PLABSession.findById(sessionId);
    if (!session) {
      res.status(404).json({ message: "Session not found" });
      return;
    }

    session.completed = true;
    await session.save();

    res.json({ message: "Session completed", score: session.score });
  }
);
