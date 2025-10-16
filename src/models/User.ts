import mongoose, { Document, Schema, Model } from "mongoose";
import bcrypt from "bcryptjs";

export interface IUser extends Document {
  firstName: string;
  lastName: string;
  name?: string; // <-- virtual field
  email: string;
  phoneNumber: string;
  homeCountry: string;
  yearsOfExperience: string;
  primaryGoal: string;
  medicalBackground: string;
  agreeToTerms: boolean;
  subscribeToUpdates: boolean;
  password: string;
  role: "User";
  otp: string;
  otpExpiry: Date;
  matchPassword(enteredPassword: string): Promise<boolean>;
}

const userSchema = new Schema<IUser>(
  {
    firstName: { type: String, required: [true, "First name can't be empty"] },
    lastName: { type: String, required: [true, "Last name can't be empty"] },
    email: {
      type: String,
      required: [true, "Email can't be empty"],
      unique: true,
      trim: true,
    },
    phoneNumber: { type: String, required: [true, "Phone number is required"] },
    homeCountry: { type: String, required: [true, "Home country is required"] },
    yearsOfExperience: {
      type: String,
      required: [true, "Years of experience is required"],
    },
    primaryGoal: { type: String, required: [true, "Primary goal is required"] },
    medicalBackground: { type: String },
    agreeToTerms: { type: Boolean, required: true },
    subscribeToUpdates: { type: Boolean, default: false },

    password: { type: String },
    role: { type: String, required: true, default: "User" },
    otp: { type: String },
    otpExpiry: { type: Date },
  },
  { timestamps: true }
);

userSchema.virtual("name").get(function (this: IUser) {
  return `${this.firstName} ${this.lastName}`;
});

userSchema.pre<IUser>("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.matchPassword = async function (
  enteredPassword: string
): Promise<boolean> {
  return await bcrypt.compare(enteredPassword, this.password);
};

export const User: Model<IUser> = mongoose.model<IUser>("User", userSchema);
