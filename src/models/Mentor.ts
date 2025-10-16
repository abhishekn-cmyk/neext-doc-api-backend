import mongoose, { Document, Schema, Model } from "mongoose";
import bcrypt from "bcryptjs";

export interface IBackground {
  degree?: string;
  institution?: string;
  year?: number;
  description?: string;
  achievements?: string[];
}

export interface INhsDetails {
  trustOrOrganization?: string;
  role?: string;
  medicalSpecialty?: string;
  subspecialty?: string;
  experienceYears?: number;
}

export interface IMentor extends Document {
  // Basic Info
  name: string;
  specialities: string[];
  rating?: number;
  address?: string;
  location?: string;
  designation?: string;
  department?: string;
  position?: string;

  // Personal
  fullName: string;
  email: string;
  password?: string;
  phone: string;
  description?: string;
  image?: string;
  profilePicture?: string;

  // Professional
  gmcNumber: string;
  currentNhsTrust: string;
  currentRole: string;
  specialty: string;
  subspecialty?: string;
  clinicalExperienceYears: number;
  nhsExperienceYears: number;
  postgraduateQualifications?: string[];
  teachingRoles?: string[];
  mentorshipExperience?: string;

  // Relationships
  mentees?: mongoose.Types.ObjectId[];

  // Background
  background?: IBackground[];

  // NHS
  isNhsMentor?: boolean;
  nhsDetails?: INhsDetails;

  // Mentorship Areas
  mentorshipAreas: string[];

  // Languages
  languagesSpoken: string[];

  // Availability & Mentorship
  availability?: string;
  mentorshipFormat?: "online" | "onsite" | "hybrid";
  mentoringApproach?: string;
  successStories?: string;
  handlingDifficultMentees?: string;
  calendlyLink?: string;
  mentorTier?: string;
  bio?: string;
  hourlyRate?: number;

  // Compliance
  gmcValid: boolean;
  noFitnessToPracticeIssues: boolean;
  codeOfConductAgreement: boolean;
  qualityReviewConsent: boolean;
  gdprCompliance: boolean;
  gdprConsent?: boolean;
  recordingConsent?: boolean;
  termsConsent?: boolean;

  // Payment & CPD
  preferredPaymentMethod: string;
  taxInfo?: string;
  cpdParticipation?: boolean;

  // Additional Info
  areasOfInterest?: string[];
  allowPublicProfile?: boolean;
  exclusiveMatching?: boolean;
  otherNotes?: string;

  // Documents
  gmcCertificate?: string;
  specialtyCertificates?: string[];
  cvDocument?: string;
  indemnityInsurance?: string;
  uploadedDocuments?: {
    cv?: string;
    gmc_certificate?: string;
    medical_degree?: string;
    photo_id?: string;
    additional?: string[];
  };
  documentsMetadata?: Record<string, string>;

  // Application Status
  status?: "pending" | "approved" | "rejected" | "active" | "inactive";
  referralCode?: string;
  role: "Mentor";
  approved: boolean;
  otp: String;
  otpExpiry: Date;
  matchPassword(enteredPassword: string): Promise<boolean>;
}

const BackgroundSchema = new Schema<IBackground>(
  {
    degree: String,
    institution: String,
    year: Number,
    description: String,
    achievements: [String],
  },
  { _id: false }
);

const NhsDetailsSchema = new Schema<INhsDetails>(
  {
    trustOrOrganization: String,
    role: String,
    medicalSpecialty: String,
    subspecialty: String,
    experienceYears: Number,
  },
  { _id: false }
);

const MentorSchema = new Schema<IMentor>(
  {
    // Basic Info
    name: { type: String, required: true },
    specialities: { type: [String], required: true },
    rating: { type: Number, default: 0 },
    address: String,
    location: String,
    designation: String,
    department: String,
    position: String,

    // Personal
    fullName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: {
      type: String,
    },
    phone: { type: String, required: true },
    description: String,
    image: String,
    profilePicture: String,

    // Professional
    gmcNumber: { type: String, required: true },
    currentNhsTrust: { type: String, required: true },
    currentRole: { type: String, required: true },
    specialty: { type: String, required: true },
    subspecialty: String,
    nhsExperienceYears: { type: Number, default: 0 },
    clinicalExperienceYears: { type: Number, default: 0 },

    postgraduateQualifications: [String],
    teachingRoles: [String],
    mentorshipExperience: String,

    // Relationships
    mentees: [{ type: Schema.Types.ObjectId, ref: "Mentee" }],

    // Background
    background: { type: [BackgroundSchema], default: [] },

    // NHS-specific
    isNhsMentor: { type: Boolean, default: false },
    nhsDetails: { type: NhsDetailsSchema, default: {} },

    // Mentorship Areas
    mentorshipAreas: { type: [String], required: true },

    // Languages
    languagesSpoken: { type: [String], required: true },

    // Availability & Mentorship
    availability: String,
    mentorshipFormat: {
      type: String,
      enum: [
        "online",
        "onsite",
        "hybrid",
        "Phone Call",
        "Video Call",
        "Video",
        "In-Person",
        "Online",
      ],
      default: "online",
    },

    mentoringApproach: String,
    successStories: String,
    handlingDifficultMentees: String,
    calendlyLink: String,
    mentorTier: String,
    bio: String,
    hourlyRate: Number,

    // Compliance
    gmcValid: { type: Boolean },
    noFitnessToPracticeIssues: { type: Boolean },
    codeOfConductAgreement: { type: Boolean },
    qualityReviewConsent: { type: Boolean },
    gdprCompliance: { type: Boolean, },
    gdprConsent: { type: Boolean, default: false },
    recordingConsent: { type: Boolean, default: false },
    termsConsent: { type: Boolean, default: false },

    // Payment & CPD
    preferredPaymentMethod: { type: String, },
    taxInfo: String,
    cpdParticipation: { type: Boolean, default: false },

    // Additional Info
    areasOfInterest: [String],
    allowPublicProfile: { type: Boolean, default: true },
    exclusiveMatching: { type: Boolean, default: false },
    otherNotes: String,

    // Documents
    gmcCertificate: String,
    specialtyCertificates: [String],
    cvDocument: String,
    indemnityInsurance: String,
    uploadedDocuments: {
      cv: String,
      gmc_certificate: String,
      medical_degree: String,
      photo_id: String,
      additional: [String],
    },
    documentsMetadata: { type: Map, of: String },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected", "active", "inactive"],
      default: "pending",
    },
    referralCode: String,
    role: {
      type: String,
      default: "Mentor",
    },
    approved: {
      type: Boolean,
      defalt: false,
    },
    otp: { type: String },
    otpExpiry: { type: Date },
  },
  { timestamps: true }
);

MentorSchema.methods.matchPassword = async function (
  enteredPassword: string
): Promise<boolean> {
  return await bcrypt.compare(enteredPassword, this.password);
};

const Mentor: Model<IMentor> =
  mongoose.models.Mentor || mongoose.model<IMentor>("Mentor", MentorSchema);

export default Mentor;
