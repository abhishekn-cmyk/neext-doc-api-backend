import mongoose, { Schema, Document, Model } from "mongoose";

export interface ICV extends Document {
  category: string;
  user_id: mongoose.Types.ObjectId | string;
  token: string;

  personalInfo: {
    fullName: string;
    email: string;
    phone: string;
    gmcNumber: string;
    preferredTitle: string;
  };

  experience: {
    currentRole: string;
    currentEmployer: string;
    yearsExperience: string;
    specialty: string;
    previousRoles: string[];
  };

  education: {
    medicalSchool: string;
    graduationYear: string;
    postgraduateQualifications: string[];
    currentStudy: string;
  };

  achievements: {
    audits: string[];
    research: string[];
    teaching: string[];
    cpd: string[];
  };

  additional: {
    languages: string[];
    interests: string;
    availability: string;
  };

  createdAt: Date;
  updatedAt: Date;
}

const CVSchema: Schema<ICV> = new Schema(
  {
    category: { type: String, required: true }, // e.g., "cvbooster"
    user_id: { type: Schema.Types.ObjectId, ref: "User", required: true },
    token: { type: String, required: true },

    personalInfo: {
      fullName: { type: String, required: true },
      email: { type: String, required: true },
      phone: { type: String, required: true },
      gmcNumber: { type: String },
      preferredTitle: { type: String },
    },

    experience: {
      currentRole: { type: String },
      currentEmployer: { type: String },
      yearsExperience: { type: String },
      specialty: { type: String },
      previousRoles: [{ type: String }],
    },

    education: {
      medicalSchool: { type: String },
      graduationYear: { type: String },
      postgraduateQualifications: [{ type: String }],
      currentStudy: { type: String },
    },

    achievements: {
      audits: [{ type: String }],
      research: [{ type: String }],
      teaching: [{ type: String }],
      cpd: [{ type: String }],
    },

    additional: {
      languages: [{ type: String }],
      interests: { type: String },
      availability: { type: String },
    },
  },
  { timestamps: true }
);

const CV: Model<ICV> = mongoose.model<ICV>("CV", CVSchema);
export default CV;
