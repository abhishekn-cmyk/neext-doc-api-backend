

import mongoose, { Schema, Document, Model } from "mongoose";

export interface IPayment extends Document {
  user: mongoose.Types.ObjectId;
  program: mongoose.Types.ObjectId;
  amount: number;
  method: "card" | "upi" | "paypal";
  status: "pending" | "completed" | "failed";
  createdAt: Date;
}

const paymentSchema: Schema<IPayment> = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    program: { type: Schema.Types.ObjectId, ref: "Program", required: true },
    amount: { type: Number, required: true },
    method: { type: String, enum: ["card", "upi", "paypal"], required: true },
    status: { type: String, enum: ["pending", "completed", "failed"], default: "pending" },
  },
  { timestamps: true }
);

const Payment: Model<IPayment> = mongoose.model<IPayment>("Payment", paymentSchema);
export default Payment;
