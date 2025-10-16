import mongoose, { Schema, Document, Model } from "mongoose";

export interface IExamSession extends Document {
  exam: mongoose.Types.ObjectId; // reference to Exam
  date: Date; // when the exam takes place
  duration: string; // e.g. "3 hours"
  mode: "online" | "offline";
  location?: string; // if offline
  link?: string; // if online
  capacity?: number; // max participants
  registeredUsers: mongoose.Types.ObjectId[]; // user IDs
  createdBy: mongoose.Types.ObjectId; // admin who created session
  createdAt: Date;
  updatedAt: Date;
}

const ExamSessionSchema = new Schema<IExamSession>(
  {
    exam: { type: Schema.Types.ObjectId, ref: "Exam", required: true },
    date: { type: Date, required: true },
    duration: { type: String },
    mode: { type: String, enum: ["online", "offline"], default: "online" },
    location: { type: String },
    link: { type: String },
    capacity: { type: Number },
    registeredUsers: [{ type: Schema.Types.ObjectId, ref: "User" }],
    createdBy: { type: Schema.Types.ObjectId, ref: "Admin", required: true },
  },
  { timestamps: true }
);

const ExamSession: Model<IExamSession> =
  mongoose.models.ExamSession ||
  mongoose.model<IExamSession>("ExamSession", ExamSessionSchema);

export default ExamSession;
