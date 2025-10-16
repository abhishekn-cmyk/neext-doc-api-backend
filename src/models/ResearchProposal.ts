import mongoose, { Schema, Document } from "mongoose";

export interface IResearchProposal extends Document {
  title: string;
  category: string;
  abstract: string;
  documentUrl?: string;
  submittedBy: mongoose.Schema.Types.ObjectId;
  status: "Pending" | "Approved" | "Rejected";
  feedback?: string;
  createdAt: Date;
  updatedAt: Date;
}

const ResearchProposalSchema: Schema = new Schema(
  {
    title: { type: String, required: true },
    category: { type: String, required: true },
    abstract: { type: String, required: true },
    documentUrl: { type: String },
    submittedBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    status: {
      type: String,
      enum: ["Pending", "Approved", "Rejected"],
      default: "Pending",
    },
    feedback: { type: String },
  },
  { timestamps: true }
);

export const ResearchProposal = mongoose.model<IResearchProposal>(
  "ResearchProposal",
  ResearchProposalSchema
);
