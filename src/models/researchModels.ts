import mongoose, { Schema, Document } from "mongoose";

// 1. Research Publication
export interface IResearchPublication extends Document {
  title: string;
  authors: string[];
  date: Date;
  summary: string;
  category: string;
}
const ResearchPublicationSchema = new Schema<IResearchPublication>({
  title: { type: String, required: true },
  authors: [{ type: String }],
  date: { type: Date, default: Date.now },
  summary: { type: String },
  category: { type: String },
});
export const ResearchPublication = mongoose.model<IResearchPublication>(
  "ResearchPublication",
  ResearchPublicationSchema
);

// 2. Research Focus Area
export interface IResearchFocusArea extends Document {
  title: string;
  description: string;
}
const ResearchFocusAreaSchema = new Schema<IResearchFocusArea>({
  title: { type: String, required: true },
  description: { type: String },
});
export const ResearchFocusArea = mongoose.model<IResearchFocusArea>(
  "ResearchFocusArea",
  ResearchFocusAreaSchema
);

// 3. Research Partnership
export interface IResearchPartnership extends Document {
  partnerName: string;
  description: string;
  startDate: Date;
}
const ResearchPartnershipSchema = new Schema<IResearchPartnership>({
  partnerName: { type: String, required: true },
  description: { type: String },
  startDate: { type: Date, default: Date.now },
});
export const ResearchPartnership = mongoose.model<IResearchPartnership>(
  "ResearchPartnership",
  ResearchPartnershipSchema
);

// 4. Research Participation
export interface IResearchParticipation extends Document {
  userId: string;
  researchTitle: string;
  status: "pending" | "approved" | "rejected";
}
const ResearchParticipationSchema = new Schema<IResearchParticipation>({
  userId: { type: String, required: true },
  researchTitle: { type: String, required: true },
  status: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending",
  },
});
export const ResearchParticipation = mongoose.model<IResearchParticipation>(
  "ResearchParticipation",
  ResearchParticipationSchema
);

// 5. Research Proposal
export interface IResearchProposal extends Document {
  userId: string;
  title: string;
  description: string;
  status: "pending" | "approved" | "rejected";
}
const ResearchProposalSchema = new Schema<IResearchProposal>({
  userId: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String },
  status: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending",
  },
});
export const ResearchProposal = mongoose.model<IResearchProposal>(
  "ResearchProposal",
  ResearchProposalSchema
);
