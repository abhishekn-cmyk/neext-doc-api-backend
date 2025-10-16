import mongoose, { Schema, Document, Model } from "mongoose";

export interface IBooking extends Document {
  user: mongoose.Types.ObjectId;
  program: mongoose.Types.ObjectId;
  mentor: mongoose.Types.ObjectId;
  date: Date;
  status: "pending" | "confirmed" | "cancelled";
  createdAt: Date;
}

const bookingSchema: Schema<IBooking> = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    program: { type: Schema.Types.ObjectId, ref: "Program", required: true },
    mentor: { type: Schema.Types.ObjectId, ref: "Mentor", required: true },
    date: { type: Date, required: true },
    status: { type: String, enum: ["pending", "confirmed", "cancelled"], default: "pending" },
  },
  { timestamps: true }
);

const Booking: Model<IBooking> = mongoose.model<IBooking>("Booking", bookingSchema);
export default Booking;
