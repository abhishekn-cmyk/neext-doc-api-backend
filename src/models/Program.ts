import mongoose, { Document, Schema, Model } from "mongoose";

export interface IPricingOption {
  name: string;
  description?: string;
  price: number;
  currency: string;

  type: "cpd" | "mentorship" | "bundle" | "subscription"; // added "subscription"
  billingCycle?: "monthly" | "yearly" | "one-time"; // added billing cycle support

  perSession?: boolean;

  // Marketing flags
  popular?: boolean;   // "Most Popular"
  premium?: boolean;   // "Premium"
  bestValue?: boolean; // "Best Value"
  badge?: string;      // e.g. "Job Ready", "Complete"

  // CTA
  ctaLabel?: string;
  ctaLink?: string;

  // UI
  icon?: string; 
  trialPeriod?: string; // optional e.g. "7 days free"
}

export interface IProgram extends Document {
  category: "CPD" | "Mentorship" | "CPD & Mentorship" | "Bundles & Subscriptions"; // added subscriptions
  title: string;
  subtitle?: string;
  description?: string;
  features?: string[];

  // Media
  image?: string;
  gallery?: string[];

  pricingOptions: IPricingOption[];

  mentors?: mongoose.Types.ObjectId[];

  createdAt: Date;
  updatedAt: Date;
}

const PricingOptionSchema = new Schema<IPricingOption>(
  {
    name: { type: String, required: true },
    description: String,
    price: { type: Number, required: true },
    currency: { type: String, default: "GBP" },
    type: { type: String, enum: ["cpd", "mentorship", "bundle", "subscription"], required: true },
    billingCycle: { type: String, enum: ["monthly", "yearly", "one-time"] },

    perSession: { type: Boolean, default: false },
    popular: { type: Boolean, default: false },
    premium: { type: Boolean, default: false },
    bestValue: { type: Boolean, default: false },
    badge: String,

    ctaLabel: String,
    ctaLink: String,
    icon: String,
    trialPeriod: String,
  },
  { _id: false }
);

const ProgramSchema = new Schema<IProgram>(
  {
    category: { 
      type: String, 
      enum: ["CPD", "Mentorship", "CPD & Mentorship", "Bundles & Subscriptions"], 
      required: true 
    },
    title: { type: String, required: true },
    subtitle: String,
    description: String,
    features: { type: [String], default: [] },

    image: String,
    gallery: { type: [String], default: [] },

    pricingOptions: { type: [PricingOptionSchema], required: true },

    mentors: [{ type: Schema.Types.ObjectId, ref: "Mentor" }],
  },
  { timestamps: true }
);

const Program: Model<IProgram> =
  mongoose.models.Program || mongoose.model<IProgram>("Program", ProgramSchema);

export default Program;
