import mongoose, { Schema, Document } from "mongoose";

export interface IInterviewSession extends Document {
  userId: string;
  config: {
    pathway: string;
    role: string;
    specialty: string;
    interviewType: string;
  };
  questions: {
    id: number;
    text: string;
    category: string;
    timeLimit: number;
  }[];
  answers: string[];
  startedAt: Date;
  completedAt?: Date;
}

const InterviewSessionSchema: Schema = new Schema({
  userId: { type: String, required: true },
  config: {
    pathway: { type: String, required: true },
    role: { type: String, required: true },
    specialty: { type: String, required: true },
    interviewType: { type: String, required: true },
  },
  questions: [
    {
      id: { type: Number, required: true },
      text: { type: String, required: true },
      category: { type: String, required: true },
      timeLimit: { type: Number, required: true },
    }
  ],
  answers: [{ type: String }],
  startedAt: { type: Date, default: Date.now },
  completedAt: { type: Date },
});

export const InterviewSession = mongoose.model<IInterviewSession>("InterviewSession", InterviewSessionSchema);
