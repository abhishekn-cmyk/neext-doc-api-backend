import mongoose, { Document, Schema, Model } from "mongoose";

export interface IQuestion extends Document {
  plabExamId?: string; // Reference to PLABExam
  examId?: string; // Optional reference to a generic Exam
  text: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
  correctAnswer: "A" | "B" | "C" | "D";
  explanation: string;
  rationale?: string;
  category?: string;
  difficulty?: "Basic" | "Core" | "Advanced";
  cpdTag?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const QuestionSchema = new Schema<IQuestion>(
  {
    examId: { type: String, ref: "Exam" },
    plabExamId: { type: String, ref: "PLABExam" },
    text: { type: String, required: true },
    optionA: { type: String, required: true },
    optionB: { type: String, required: true },
    optionC: { type: String, required: true },
    optionD: { type: String, required: true },
    correctAnswer: { type: String, enum: ["A", "B", "C", "D"], required: true },
    explanation: { type: String, required: true },
    rationale: { type: String },
    category: { type: String },
    difficulty: { type: String, enum: ["Basic", "Core", "Advanced"] },
    cpdTag: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// Use "PlabQuestion" as model name to avoid collision
const PlabQuestion: Model<IQuestion> =
  mongoose.models.PlabQuestion ||
  mongoose.model<IQuestion>("PlabQuestion", QuestionSchema);

export default PlabQuestion;
