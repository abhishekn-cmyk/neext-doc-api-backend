import mongoose, { Document, Schema, Model } from "mongoose";

export interface IPLABSession extends Document {
  userId: string;
  examId: string;
  currentQuestion: number;
  answers: {
    questionId: string;
    selectedAnswer: string;
    isCorrect: boolean;
    correctAnswer: string;
  }[];
  flaggedQuestions: number[]; // question indices
  completed: boolean;
  score: number;
  filters: {
    category?: string;
    difficulty?: string;
    cpdTag?: boolean;
  };
  createdAt: Date;
  updatedAt: Date;
}

const PLABSessionSchema = new Schema<IPLABSession>(
  {
    userId: { type: String, ref: "User", required: true },
    examId: { type: String, ref: "Exam", required: true },
    currentQuestion: { type: Number, default: 0 },
    answers: { type: [Object], default: [] },
    flaggedQuestions: { type: [Number], default: [] },
    completed: { type: Boolean, default: false },
    score: { type: Number, default: 0 },
    filters: {
      category: { type: String },
      difficulty: { type: String },
      cpdTag: { type: Boolean },
    },
  },
  { timestamps: true }
);

const PLABSession: Model<IPLABSession> =
  mongoose.models.PLABSession || mongoose.model<IPLABSession>("PLABSessionQuiz", PLABSessionSchema);

export default PLABSession;
