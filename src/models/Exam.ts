import mongoose, { Document, Schema, Model } from "mongoose";

// ---------------- Types ----------------
export interface IExam extends Document {
  category?: "English Proficiency" | "PLAB" | "Postgraduate";
  subcategory?: string;
  title?: string;
  subtitle?: string;
  description?: string;
  features?: string[];
  includes?: string[];
  mentors?: string[];

  timeline?: {
    phase?: string;
    weeks?: string;
    details?: string;
  }[];

  components?: {
    name?: string;
    type?: string;
    details?: string[];
  }[];

  mentorship?: {
    included?: boolean;
    type?: "1:1" | "group" | "principal";
    sessions?: number;
  };

  price?: number;
  currency?: string;
  pricingOptions?: {
    label?: string;
    price?: number;
  }[];
  paymentLink?: string;

  examType?: "IELTS" | "OET" | "PLAB-1" | "MRCP" | "MRCS" | "MRCOG" | "MRCPCH";

  bundleItems?: string[];

  actions?: {
    label?: string;
    type?: "enroll" | "download" | "consultation" | "purchase";
    link?: string;
  }[];

  startDate?: Date;
  endDate?: Date;
  duration?: string;

  createdAt?: Date;
  updatedAt?: Date;
}

// ---------------- Schema ----------------
const ExamSchema = new Schema<IExam>(
  {
    category: { type: String, enum: ["English Proficiency", "PLAB", "Postgraduate"] },
    subcategory: { type: String },
    title: { type: String },
    subtitle: { type: String },
    description: { type: String },
    features: { type: [String], default: [] },
    includes: { type: [String], default: [] },
    mentors: { type: [String], default: [] },

    timeline: [
      {
        phase: { type: String },
        weeks: { type: String },
        details: { type: String },
      },
    ],

    components: [
      {
        name: { type: String },
        type: { type: String },
        details: { type: [String], default: [] },
      },
    ],

    mentorship: {
      included: { type: Boolean },
      type: { type: String, enum: ["1:1", "group", "principal"] },
      sessions: { type: Number },
    },

    price: { type: Number },
    currency: { type: String, default: "GBP" },
    pricingOptions: [
      {
        label: { type: String },
        price: { type: Number },
      },
    ],
    paymentLink: { type: String },

    examType: {
      type: String,
      enum: ["IELTS", "OET", "PLAB-1", "MRCP", "MRCS", "MRCOG", "MRCPCH"],
    },

    bundleItems: { type: [String], default: [] },

    actions: [
      {
        label: { type: String },
        type: { type: String, enum: ["enroll", "download", "consultation", "purchase"] },
        link: { type: String },
      },
    ],

    startDate: { type: Date },
    endDate: { type: Date },
    duration: { type: String },
  },
  { timestamps: true }
);

// ---------------- Pre-save hook ----------------
ExamSchema.pre<IExam>("save", function (next) {
  if (this.startDate && this.endDate) {
    const diffInMs = this.endDate.getTime() - this.startDate.getTime();

    if (diffInMs <= 0) {
      this.duration = "0 seconds";
    } else {
      const diffInSeconds = Math.floor(diffInMs / 1000);
      const diffInMinutes = Math.floor(diffInSeconds / 60);
      const diffInHours = Math.floor(diffInMinutes / 60);
      const diffInDays = Math.floor(diffInHours / 24);

      if (diffInDays >= 7) {
        const weeks = Math.floor(diffInDays / 7);
        const days = diffInDays % 7;
        this.duration =
          days > 0
            ? `${weeks} week${weeks > 1 ? "s" : ""} ${days} day${days > 1 ? "s" : ""}`
            : `${weeks} week${weeks > 1 ? "s" : ""}`;
      } else if (diffInDays >= 1) {
        this.duration = `${diffInDays} day${diffInDays > 1 ? "s" : ""}`;
      } else if (diffInHours >= 1) {
        this.duration = `${diffInHours} hour${diffInHours > 1 ? "s" : ""}`;
      } else if (diffInMinutes >= 1) {
        this.duration = `${diffInMinutes} minute${diffInMinutes > 1 ? "s" : ""}`;
      } else {
        this.duration = `${diffInSeconds} second${diffInSeconds > 1 ? "s" : ""}`;
      }
    }
  }
  next();
});

// ---------------- Model ----------------
const Exam: Model<IExam> = mongoose.models.Exam || mongoose.model<IExam>("Exam", ExamSchema);

export default Exam;
