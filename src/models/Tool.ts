import mongoose, { Schema, Document, Model } from "mongoose";
import { IExam } from "./Exam"; // Import the TypeScript interface
import Exam from "./Exam"; // Import the Mongoose model
export interface IPersonal {
  fullName: string;
  nationality: string;
  gmcNumber?: string;
  medicalDegree: string;
  graduationYear: string;
  currentLocation: string;
}

export interface IStatus {
  visaStatus: string;
  currentRole: string;
  nhsExperience: string;
  englishTest: string;
  englishScore?: string;
}

export interface IExams {
  completedExams: string[];
  examDates?: Record<string, Date>;
  currentStudy?: string;
}

export interface IGoals {
  targetRole: string;
  timeframe: string;
  preferredLocation: string;
  specialtyInterest: string;
}

export interface ISubCategory {
  title: string;
  description?: string;
  tagline?: string;
}

export interface ICategory {
  title: string;
  description?: string;
  tagline?: string;
  milestone?:string;
  duration?:string;
  subcategories?: ISubCategory[];
}

export interface ITool extends Document {
  name: string; // e.g. "GapMap"
  categories: ICategory[];
  features: string[];
  tagline:string;
  description:string;
  basePrice: number;
  pricingOptions?: {
    label: string;
    price: number;
  }[];
  exams?: IExam[];
  category?: string; // e.g. "Pathway", "Most Popular", "Job Ready"
  actions?: {
    label: string;
    type: "link" | "button";
    url?: string;
  }[];
  image?: string;
   personal: IPersonal;
  status: IStatus;
  examsData: IExams;
  goals: IGoals;

  // 👇 Auth
  user_id: mongoose.Types.ObjectId | string;
  token: string;
  createdAt: Date;
  updatedAt: Date;
}




export const SubCategorySchema = new Schema<ISubCategory>({
  title: { type: String, required: true },
  description: { type: String },
  tagline: { type: String },
});

export const CategorySchema = new Schema<ICategory>({
  title: { type: String, required: true },
  description: { type: String },
  tagline: { type: String },
  milestone: { type: String },
  duration: { type: String },
  subcategories: [SubCategorySchema],
});
const ToolSchema: Schema<ITool> = new Schema(
  {
    name: { type: String, required: true }, // main tool name
    categories: [CategorySchema],
     exams: [Exam.schema],
    description:{type:String},
    tagline:{type:String},
    features: [{ type: String }],
    basePrice: { type: Number, required: true },
    pricingOptions: [
      {
        label: { type: String },
        price: { type: Number },
      },
    ],
    
    category: { type: String },
    actions: [
      {
        label: { type: String },
        type: { type: String, enum: ["link", "button"], default: "button" },
        url: { type: String },
      },
    ],
    image: { type: String },
  
  },
  { timestamps: true }
);

const Tool: Model<ITool> = mongoose.model<ITool>("Tool", ToolSchema);
export default Tool;
