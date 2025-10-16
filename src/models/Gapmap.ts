import mongoose, { Schema, Document, Model } from "mongoose";

export interface IGapMap {
  name: string;
  description?: string;
  tagline?: string;
  features?: string[];
  basePrice?: number;
  category?: string;

  personal: {
    fullName: string;
    nationality: string;
    gmcNumber?: string;
    medicalDegree: string;
    graduationYear: string;
    currentLocation: string;
  };

  status: {
    visaStatus: string;
    currentRole: string;
    nhsExperience: string;
    englishTest: string;
    englishScore?: string;
  };

  examsData: {
    completedExams: string[];
    examDates?: Record<string, Date>;
    currentStudy?: string;
  };

  goals: {
    targetRole: string;
    timeframe: string;
    preferredLocation: string;
    specialtyInterest: string;
  };

  user_id: mongoose.Types.ObjectId | string;
  token: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const PersonalSchema = new Schema({
  fullName: { type: String },
  nationality: { type: String },
  gmcNumber: { type: String },
  medicalDegree: { type: String },
  graduationYear: { type: String },
  currentLocation: { type: String },
});

const StatusSchema = new Schema({
  visaStatus: { type: String },
  currentRole: { type: String },
  nhsExperience: { type: String },
  englishTest: { type: String },
  englishScore: { type: String },
});

const ExamsDataSchema = new Schema({
  completedExams: [{ type: String }],
  examDates: { type: Map, of: Date },
  currentStudy: { type: String },
});

const GoalsSchema = new Schema({
  targetRole: { type: String },
  timeframe: { type: String },
  preferredLocation: { type: String },
  specialtyInterest: { type: String },
});

const GapMapSchema: Schema<IGapMap> = new Schema(
  {
    user_id: { type: Schema.Types.ObjectId, ref: "User", required: true },
    token: { type: String, required: true },
    personal: PersonalSchema,
    status: StatusSchema,
    examsData: ExamsDataSchema,
    goals: GoalsSchema,
  },
  { timestamps: true }
);

// Model name is now GapMap
const GapMap: Model<IGapMap> = mongoose.model<IGapMap>("GapMap", GapMapSchema);

export default GapMap;
