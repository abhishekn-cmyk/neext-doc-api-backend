import mongoose, { Document, Schema, Model } from "mongoose";

const Nationalities = [
  "india",
  "pakistan",
  "bangladesh",
  "nigeria",
  "egypt",
  "sudan",
  "syria",
  "iraq",
  "other",
] as const;
const VisaStatuses = [
  "none",
  "visitor",
  "student",
  "tier2",
  "dependent",
  "refugee",
  "indefinite",
  "british",
] as const;
const PreviousUKSponsorship = ["none", "student", "work", "nhs"] as const;
const EnglishTests = ["ielts", "oet", "native", "none"] as const;
const UKClinicalExperiences = [
  "none",
  "clinical-attachment",
  "0-6months",
  "6-12months",
  "1-2years",
  "2plus",
] as const;
const Specialties = [
  "internal-medicine",
  "emergency-medicine",
  "surgery",
  "psychiatry",
  "paediatrics",
  "obstetrics-gynaecology",
  "anaesthetics",
  "radiology",
  "pathology",
  "general-practice",
  "any",
] as const;
const TargetRoleLevels = [
  "fy2",
  "sho",
  "specialty-doctor",
  "associate-specialist",
  "consultant",
  "locum",
] as const;
const Locations = [
  "London",
  "Manchester",
  "Birmingham",
  "Liverpool",
  "Leeds",
  "Newcastle",
  "Sheffield",
  "Bristol",
  "Nottingham",
  "Leicester",
  "Scotland",
  "Wales",
  "Northern Ireland",
] as const;
const WorkPatterns = ["full-time", "part-time", "flexible", "locum"] as const;

// ---------------- SCHEMAS ----------------
// ---------------- Data Interfaces ----------------
interface PersonalInfo {
  fullName: string;
  nationality: (typeof Nationalities)[number];
  currentLocation: string;
  gmcNumber?: string;
  medicalDegree: string;
  graduationYear?: number;
}

interface VisaInfo {
  currentVisaStatus?: (typeof VisaStatuses)[number];
  visaExpiryDate?: Date;
  hasDependents?: boolean;
  previousUKSponsorship?: (typeof PreviousUKSponsorship)[number];
}

interface MedicalQualifications {
  completedMedicalExams?: {
    plab1?: boolean;
    plab2?: boolean;
    ielts?: boolean;
    oet?: boolean;
    pte?: boolean;
    toefl?: boolean;
    ukcat?: boolean;
    mrcpPart1?: boolean;
    mrcpPart2?: boolean;
    mrcpPaces?: boolean;
    mrcsPartA?: boolean;
    mrcsPartB?: boolean;
    mrcogPart1?: boolean;
    mrcogPart2?: boolean;
    mrcpch?: boolean;
  };
  englishLanguageTest?: (typeof EnglishTests)[number];
  englishScore?: string;
  ukClinicalExperience?: (typeof UKClinicalExperiences)[number];
  currentRole?: string;
}

interface JobPreferences {
  targetSpecialty?: (typeof Specialties)[number];
  targetRoleLevel?: (typeof TargetRoleLevels)[number];
  preferredLocations?: (typeof Locations)[number][];
  preferredStartDate?: Date;
  workPatternPreference?: (typeof WorkPatterns)[number];
}

// ---------------- Main Document Interface ----------------
export interface IDoctorSponsorship extends Document {
  userId: string;
  personalInfo: PersonalInfo;
  visaInfo: VisaInfo;
  medicalQualifications: MedicalQualifications;
  jobPreferences: JobPreferences;
  updatedAt: Date;
}
const PersonalInfoSchema = new Schema({
  fullName: { type: String, required: true },
  nationality: { type: String, enum: Nationalities, required: true },
  currentLocation: { type: String, required: true },
  gmcNumber: { type: String },
  medicalDegree: { type: String, required: true },
  graduationYear: { type: Number },
});
export type MatchWithScore = {
  fitScore: number;
  personalInfo: PersonalInfo;
  visaInfo: VisaInfo;
  medicalQualifications: MedicalQualifications;
  jobPreferences: JobPreferences;
  userId: string;
};
export interface MatchResult {
  id: string;
  trustName: string;
  specialty: string;
  location: string;
  role: string;
  fitScore: number;
  cosStatus: string;
  cosExpiry?: Date;
  jobsAvailable?: number;
  sponsorshipHistory?: string;
  applicationDeadline?: string;
  requirements?: string[];
  benefits?: string[];
}
export interface MatchesResponse {
  totalMatches: number;
  shortlist: MatchResult[];
  backendData: MatchResult[];
  recommendations: string[];
  redFlags: string[];
}

const VisaInfoSchema = new Schema({
  currentVisaStatus: { type: String, enum: VisaStatuses },
  visaExpiryDate: { type: Date },
  hasDependents: { type: Boolean, default: false },
  previousUKSponsorship: { type: String, enum: PreviousUKSponsorship },
});

const MedicalQualificationsSchema = new Schema({
  completedMedicalExams: {
    plab1: { type: Boolean, default: false },
    plab2: { type: Boolean, default: false },
    ielts: { type: Boolean, default: false },
    oet: { type: Boolean, default: false },
    pte: { type: Boolean, default: false },
    toefl: { type: Boolean, default: false },
    ukcat: { type: Boolean, default: false },
    mrcpPart1: { type: Boolean, default: false },
    mrcpPart2: { type: Boolean, default: false },
    mrcpPaces: { type: Boolean, default: false },
    mrcsPartA: { type: Boolean, default: false },
    mrcsPartB: { type: Boolean, default: false },
    mrcogPart1: { type: Boolean, default: false },
    mrcogPart2: { type: Boolean, default: false },
    mrcpch: { type: Boolean, default: false },
  },
  englishLanguageTest: { type: String, enum: EnglishTests },
  englishScore: { type: String },
  ukClinicalExperience: { type: String, enum: UKClinicalExperiences },
  currentRole: { type: String },
});

const JobPreferencesSchema = new Schema({
  targetSpecialty: { type: String, enum: Specialties },
  targetRoleLevel: { type: String, enum: TargetRoleLevels },
  preferredLocations: [{ type: String, enum: Locations }],
  preferredStartDate: { type: Date },
  workPatternPreference: { type: String, enum: WorkPatterns },
});

// ---------------- MAIN SCHEMA ----------------

const DoctorSponsorshipSchema = new Schema<IDoctorSponsorship>(
  {
    userId: { type: String, ref: "User", required: true },
    personalInfo: PersonalInfoSchema,
    visaInfo: VisaInfoSchema,
    medicalQualifications: MedicalQualificationsSchema,
    jobPreferences: JobPreferencesSchema,
  },
  { timestamps: true }
);

export const DoctorSponsorship: Model<IDoctorSponsorship> =
  mongoose.model<IDoctorSponsorship>("Sponsormatch", DoctorSponsorshipSchema);
