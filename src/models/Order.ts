import mongoose, { Document, Schema, Model, Types } from "mongoose";

export interface IOrder extends Document {
  user: Schema.Types.ObjectId;
  itemType: "tool" | "bundle" | "subscription";
  itemId: Schema.Types.ObjectId;
  name: string;
  description?: string;
  price: number;
  status: "pending" | "paid" | "cancelled";
  createdAt: Date;
}

const orderSchema = new Schema<IOrder>({
  user: { type: Types.ObjectId, ref: "User", required: true },
  itemType: {
    type: String,
    enum: ["tool", "bundle", "subscription"],
    required: true,
  },
  itemId: { type: Types.ObjectId, required: true },
  name: { type: String, required: true },
  description: String,
  price: { type: Number, required: true },
  status: {
    type: String,
    enum: ["pending", "paid", "cancelled"],
    default: "pending",
  },
  createdAt: { type: Date, default: Date.now },
});

export const Order = mongoose.model<IOrder>("Order", orderSchema);
