import mongoose, { Document, Schema, Model } from "mongoose";
import bcrypt from "bcryptjs";

export interface IPricing extends Document {
  icon: string;
  title: string;
  subTitle: string;
  monthlyPrice: number;
  yearlyPrice: number;
  benefits: string[];
  popular: boolean;
  order: number;
  display: boolean;
}

const pricingSchema = new Schema<IPricing>({
  icon: { type: String, required: [true, "Icon can't be empty"] },
  title: { type: String, required: [true, "Title can't be empty"] },
  subTitle: { type: String, required: [true, "Subtitle can't be empty"] },
  monthlyPrice: Number,
  yearlyPrice: Number,
  benefits: [String],
  popular: { type: Boolean, default: false },
  order: Number,
  display: { type: Boolean, default: true },
});

export const Pricing: Model<IPricing> = mongoose.model<IPricing>(
  "Pricing",
  pricingSchema
);
