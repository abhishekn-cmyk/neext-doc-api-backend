import mongoose, { Document, Schema, Model } from "mongoose";

// =====================
// Interface (TypeScript)
// =====================
export interface IMentee extends Document {
  name: string;
  email: string;
  phone?: string;
  goals?: string[];
  interests?: string[];
  languagePreferences?: string[];
  availability?: string;
  mentorPreferences?: string[];
  mentors?: mongoose.Types.ObjectId[]; // linked mentors
}

// =====================
// Schema
// =====================
const MenteeSchema: Schema<IMentee> = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: String,
    goals: [String],
    interests: [String],
    languagePreferences: [String],
    availability: String,
    mentorPreferences: [String],
    mentors: [{ type: Schema.Types.ObjectId, ref: "Mentor" }], // many-to-many link
  },
  { timestamps: true }
);

// =====================
// Model
// =====================
const Mentee: Model<IMentee> =
  mongoose.models.Mentee || mongoose.model<IMentee>("Mentee", MenteeSchema);

export default Mentee;
