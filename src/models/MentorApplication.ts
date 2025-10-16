import mongoose, { Document, Schema, model } from "mongoose";

export interface IMentorApplication extends Document {
  fullName: string;
  email: string;
  phone: string;

  gmcNumber: string;
  specialty: string;
  currentNhsTrust: string;
  currentRole: string;
  clinicalExperienceYears: number;
  nhsExperienceYears: number;

  mentorTier: string;
  bio: string;
  mentorshipAreas: string[];
  hourlyRate: number;

  meetLink: string;
  resume: string;
  gmcCertificate: string;
  medicalcertificate: string;
  photoID: string;
  additionalCertificate: string;
  recordingConsent?: boolean;
  terms: string;
  remarks: string;
  status: "pending" | "rejected" | "approved";
}

const mentorApplicationSchema = new Schema<IMentorApplication>(
  {
    fullName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true },
    gmcNumber: { type: String, required: true },
    specialty: { type: String, required: true },
    currentNhsTrust: { type: String, required: true },
    currentRole: { type: String, required: true },
    nhsExperienceYears: { type: Number, default: 0 },
    clinicalExperienceYears: { type: Number, default: 0 },
    mentorTier: { type: String, required: true },
    bio: { type: String, required: true },
    mentorshipAreas: [String],
    hourlyRate: { type: Number, required: true },
    meetLink: String,
    resume: String,
    gmcCertificate: String,
    medicalcertificate: String,
    photoID: String,
    additionalCertificate: String,
    recordingConsent: { type: Boolean, default: false },
    terms: String,
    remarks: String,
    status: {
      type: String,
      enum: ["pending", "rejected", "approved"],
      default:"pending"
    },
  },
  { timestamps: true }
);

export const MentorApplication = model<IMentorApplication>(
  "MentorApplication",
  mentorApplicationSchema
);
