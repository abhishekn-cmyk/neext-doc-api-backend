import mongoose, { Document, Schema, Model } from "mongoose";

export interface IExamBase extends Document {
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
  components?: {
    name: string;
    type?: string;
    details: string[];
  }[];
  mentorship?: {
    included: boolean;
    type: "1:1" | "group" | "principal";
    sessions: number;
  };
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

const ExamBaseSchema = new Schema<IExamBase>(
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
    components: [
      {
        name: { type: String, required: true },
        type: { type: String },
        details: { type: [String], default: [] },
      },
    ],
    mentorship: {
      included: { type: Boolean, default: false },
      type: { type: String, enum: ["1:1", "group", "principal"] },
      sessions: { type: Number },
    },
    actions: [
      {
        label: { type: String, required: true },
        type: {
          type: String,
          enum: ["enroll", "download", "consultation", "purchase"],
          required: true,
        },
        link: { type: String, required: true },
      },
    ],
    startDate: { type: Date },
    endDate: { type: Date },
    duration: { type: String },
  },
  { timestamps: true }
);

export default ExamBaseSchema;
