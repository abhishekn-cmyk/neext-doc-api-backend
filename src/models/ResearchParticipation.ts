import mongoose, { Schema, Document } from "mongoose";

export interface IResearchParticipation extends Document {
  researchId: mongoose.Schema.Types.ObjectId;
  participant: mongoose.Schema.Types.ObjectId;
  status: "Pending" | "Approved" | "Rejected";
  joinedAt: Date;
}

const ResearchParticipationSchema: Schema = new Schema(
  {
    researchId: { type: Schema.Types.ObjectId, ref: "ResearchProposal", required: true },
    participant: { type: Schema.Types.ObjectId, ref: "User", required: true },
    status: {
      type: String,
      enum: ["Pending", "Approved", "Rejected"],
      default: "Pending",
    },
    joinedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export const ResearchParticipation = mongoose.model<IResearchParticipation>(
  "ResearchParticipation",
  ResearchParticipationSchema
);
