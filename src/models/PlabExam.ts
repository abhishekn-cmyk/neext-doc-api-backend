import { Schema, model, Document } from "mongoose";

// ---------------- File resource interface ----------------
export interface IFileResource {
  filename: string;   // original file name
  url: string;        // storage URL or path
  type: "pdf" | "docx" | "xlsx" | "jpg" | "png"; // file type
  uploadedAt: Date;
}

// ---------------- PLAB Exam interface ----------------
export interface IPLABExam extends Document {
  title: string;
  subtitle?: string;
  description: string;
  features: string[];
  includes?: string[];
  mentors?: string[];
  timeline?: {
    phase: string;
    weeks?: string;
    details?: string;
  }[];
  syllabus?: (string | IFileResource)[];  // can be text topics or file resources
  qBank?: string[];                        // question bank IDs
  mentorshipSessions?: {
    type: "1:1" | "group" | "principal";
    totalSessions: number;
    description?: string;
  }[];
  actions?: {
    label: string;
    type: "enroll" | "download" | "consultation" | "purchase";
    link: string;
  }[];
  startDate?: Date;
  endDate?: Date;
  duration?: string;
  createdAt: Date;
  updatedAt: Date;
}

// ---------------- PLAB Exam schema ----------------
const PLABExamSchema = new Schema<IPLABExam>(
  {
    title: { type: String, required: true },
    subtitle: { type: String },
    description: { type: String, required: true },
    features: { type: [String], default: [] },
    includes: { type: [String], default: [] },
    mentors: { type: [String], default: [] },
    timeline: [
      {
        phase: { type: String, required: true },
        weeks: { type: String },
        details: { type: String },
      },
    ],
    syllabus: {
      type: [Schema.Types.Mixed], // allows both string and object
      default: [],
    },
    qBank: [{ type: Schema.Types.ObjectId, ref: "PlabQuestion" }],
    mentorshipSessions: [
      {
        type: { type: String, enum: ["1:1", "group", "principal"], required: true },
        totalSessions: { type: Number, required: true },
        description: { type: String },
      },
    ],
    actions: [
      {
        label: { type: String, required: true },
        type: { type: String, enum: ["enroll", "download", "consultation", "purchase"], required: true },
        link: { type: String, required: true },
      },
    ],
    startDate: { type: Date },
    endDate: { type: Date },
    duration: { type: String },
  },
  { timestamps: true }
);

// ---------------- Model ----------------
const PLABExam = model<IPLABExam>("PLABExam", PLABExamSchema);
export default PLABExam;

