import mongoose, { Document, Schema, Model } from "mongoose";
import bcrypt from "bcryptjs";


export interface ISuperAdmin extends Document {
  name: string;
  email: string;
  password: string;
  role: "SuperAdmin";
  otp: String;
  otpExpiry: Date;
  matchPassword(enteredPassword: string): Promise<boolean>;
}

const superAdminSchema = new Schema<ISuperAdmin>({
  name: { type: String, required: [true, "Name can't be empty"] },
  email: {
    type: String,
    required: [true, "Email can't be empty"],
    unique: true,
    trim: true,
  },
  password: { type: String, required: [true, "Password can't be empty"] },
  role: { type: String, required: true, default: "SuperAdmin" },
  otp: { type: String },
  otpExpiry: { type: Date },
});

superAdminSchema.pre<ISuperAdmin>("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

superAdminSchema.methods.matchPassword = async function (
  enteredPassword: string
): Promise<boolean> {
  return await bcrypt.compare(enteredPassword, this.password);
};

export const SuperAdmin: Model<ISuperAdmin> = mongoose.model<ISuperAdmin>(
  "SuperAdmin",
  superAdminSchema
);
