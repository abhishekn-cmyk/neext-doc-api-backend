import mongoose, { Schema, Document, Model } from "mongoose";

export interface IFeature {
  description: string;
}

export interface IPricingOption {
  type: "monthly" | "yearly" | "one-time";
  price: number;
  currency: string;
  durationInMonths?: number; // e.g., 1 for monthly, 12 for yearly
  label?: string; // e.g., "Monthly", "Yearly"
}

export interface IProduct extends Document {
  name: string;
  category: "subscription" | "bundle";
  tagline?: string;
  description?: string;
  features: IFeature[];
  pricingOptions: IPricingOption[];
  highlightTag?: string; // e.g., "Most Popular", "Premium", "Best Value"
  isActive: boolean;
}

const FeatureSchema = new Schema<IFeature>({
  description: { type: String, required: true },
});

const PricingOptionSchema = new Schema<IPricingOption>({
  type: { type: String, enum: ["monthly", "yearly", "one-time"], required: true },
  price: { type: Number, required: true },
  currency: { type: String, default: "GBP" },
  durationInMonths: { type: Number },
  label: { type: String },
});

const ProductSchema = new Schema<IProduct>(
  {
    name: { type: String, required: true },
    category: { type: String, enum: ["subscription", "bundle"], required: true },
    tagline: { type: String },
    description: { type: String },
    features: [FeatureSchema],
    pricingOptions: [PricingOptionSchema],
    highlightTag: { type: String }, // NEW field for "Most Popular", "Premium"
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const Product: Model<IProduct> = mongoose.model<IProduct>(
  "Product",
  ProductSchema
);
