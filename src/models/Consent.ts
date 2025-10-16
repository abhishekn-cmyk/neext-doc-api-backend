// models/Consent.ts
import mongoose, { Schema, Document } from "mongoose";

export interface IConsent extends Document {
  userId?: mongoose.Types.ObjectId;
  ipAddress: string;
  userAgent?: string;
  choice: "accept_all" | "essential_only" | "decline";
  policy: {
    version: string; // e.g. "1.0.0"
    title: string;   // e.g. "We Value Your Privacy"
    description: string; // short banner description
    sections: {
      heading: string; // "What We Collect"
      content: string; // "AI queries, quiz progress..."
    }[];
  };
  location?: {
    city?: string;
    region?: string;
    country?: string;
    postal?: string;
    latitude?: number;
    longitude?: number;
  };
  createdAt: Date;
  updatedAt: Date;
}

const ConsentSchema = new Schema<IConsent>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: false },
    ipAddress: { type: String, required: false },
    userAgent: { type: String },
    choice: {
      type: String,
      enum: ["accept_all", "essential_only", "decline"],
      required: true,
    },
    policy: {
      version: { type: String, required: true },
      title: { type: String, required: true },
      description: { type: String, required: true },
      sections: [
        {
          heading: { type: String, required: true },
          content: { type: String, required: true },
        },
      ],
    },
    location: {
      city: { type: String },
      region: { type: String },
      country: { type: String },
      postal: { type: String },
      latitude: { type: Number },
      longitude: { type: Number },
    },
  },
  { timestamps: true }
);

export default mongoose.model<IConsent>("Consent", ConsentSchema);
