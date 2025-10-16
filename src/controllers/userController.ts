import { Request, Response, NextFunction } from "express";
import asyncHandler from "express-async-handler";
import { User } from "../models/User";
import { generateToken } from "../utils/generateToken";
import bcrypt from "bcryptjs";
import { generateOtpCode } from "../utils/generateOtp";
import sendOtpEmail from "../utils/sendOtpEmail";
import CV from "../models/CV";
import GapMap from "../models/Gapmap";
import { InterviewSession } from "../models/Interview";
import PLABSession from "../models/PlabQuizSession";
export const registerUser = asyncHandler(
  async (req: Request, res: Response) => {
    const {
      firstName,
      lastName,
      email,
      password,
      phoneNumber,
      homeCountry,
      yearsOfExperience,
      primaryGoal,
      medicalBackground,
      agreeToTerms,
      subscribeToUpdates,
    } = req.body;

    const userExists = await User.findOne({ email });

    if (userExists) {
      res.status(400).json({ success: false, message: "User already exists" });
      return;
    }

    const user = await User.create({
      firstName,
      lastName,
      name: `${firstName} ${lastName}`, // <-- Add name field
      email,
      password,
      phoneNumber,
      homeCountry,
      yearsOfExperience,
      primaryGoal,
      medicalBackground,
      agreeToTerms,
      subscribeToUpdates,
    });

    const token = generateToken(user._id.toString(), user.role || "User");

    res.status(201).json({
      success: true,
      data: {
        user: user,
        _id: user._id.toString(),
        name: user.name, // <-- Return the full name
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        token,
      },
    });
  }
);

export const createUser = asyncHandler(async (req: Request, res: Response) => {
  const {
    firstName,
    lastName,
    email,
    phoneNumber,
    homeCountry,
    yearsOfExperience,
    primaryGoal,
    medicalBackground,
    agreeToTerms,
    subscribeToUpdates,
    role,
  } = req.body;

  // Validate required fields
  if (!firstName || !lastName || !email) {
    res.status(400).json({
      success: false,
      message: "First name, last name, email and password are required",
    });
    return;
  }

  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400).json({
      success: false,
      message: "User already exists",
    });
    return;
  }

  const user = await User.create({
    firstName,
    lastName,
    email,

    phoneNumber,
    homeCountry,
    yearsOfExperience,
    primaryGoal,
    medicalBackground,
    agreeToTerms,
    subscribeToUpdates,
    role: role || "User",
  });

  res.status(201).json({
    success: true,
    message: "User created successfully",
    data: {
      user: user,
      _id: user._id.toString(),
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
    },
  });
});

export const getUserStats = async (req: Request, res: Response) => {
  const { id } = req.params;

  const user = await User.findById(id);
  if (!user) res.status(404).json({ message: "User not found" });

  const gapmaps = await GapMap.find({ user_id: id });
  const cvs = await CV.find({ user_id: id });
  const interviews = await InterviewSession.find({ userId: id });
  const plab = await PLABSession.find({ userId: id });
  res.json({
    gapmaps: gapmaps.length,
    cvs: cvs.length,
    interviews: interviews.length,
    gapmapDetails: gapmaps,
    cvDetails: cvs,
    interviewDetails: interviews,
    plabquiz: plab,
  });
};

export const loginUser = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (user && (await user.matchPassword(password))) {
    res.status(200).json({
      success: true,
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id.toString(), user.role),
      },
    });
  } else {
    res
      .status(401)
      .json({ success: false, message: "Invalid email or password" });
  }
});

export const forgotPassword = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email } = req.body;
    const user = await User.findOne({ email });

    const otp = generateOtpCode();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 mins expiry

    user.otp = otp;
    user.otpExpiry = otpExpiry;

    if (!user) {
      res.status(404).json({
        success: false,
        message: "No User found with that email",
      });
    }

    await user.save();

    await sendOtpEmail(user.email, user.name, otp);

    res.status(200).json({
      suceess: true,
      message: "Reset password OTP sent to your email",
    });
  }
);

export const resetPassword = asyncHandler(
  async (req: Request, res: Response) => {
    const { otp, password } = req.body;

    const user = await User.findOne({ otp });

    if (!user || !user.otpExpiry || user.otpExpiry < new Date()) {
      res.status(400).json({
        success: false,
        message: "Invalid or expired OTP",
      });
      return;
    }

    user.password = password;
    user.otp = undefined;
    user.otpExpiry = undefined;

    await user.save();

    res.status(200).json({
      success: true,
      message: "Password updated successfully",
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id.toString(), user.role),
      },
    });
  }
);

export const profile = asyncHandler(async (req: any, res: Response) => {
  const { _id } = req.user;
  const user = await User.findById(_id).lean();
  if (!user) {
    res.status(404).json({
      success: false,
      mesagge: "Super admin not found",
    });
  } else {
    res.status(200).json({
      success: true,
      message: "Super admin profile fetched successfully",
      data: user,
    });
  }
});

export const updateProfile = asyncHandler(
  async (req: any, res: Response) => {
    const { _id } = req.user;

    const updateData = { ...req.body };

    if (updateData.password) {
      const salt = await bcrypt.genSalt(10);
      updateData.password = await bcrypt.hash(updateData.password, salt);
    }

    const user = await User.findByIdAndUpdate(_id, updateData, {
      new: true,
    });

    if (!user) {
      res.status(404).json({
        success: false,
        message: "Super admin not found",
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: "Super admin profile updated successfully",
      data: user,
    });
  }
);

export const getUserById = asyncHandler(async (req: Request, res: Response) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    res.status(404).json({
      success: false,
      message: "Super admin not found",
    });
    return;
  }

  res.status(200).json({
    success: true,
    message: "Fetched super admin successfully",
    data: user,
  });
});

export const getUsers = asyncHandler(async (req: Request, res: Response) => {
  const user = await User.find();

  if (!user) {
    res.status(404).json({
      success: false,
      message: "Super admin not found",
    });
    return;
  }

  res.status(200).json({
    success: true,
    message: "Fetched super admin successfully",
    data: user,
  });
});

export const updateUserById = asyncHandler(
  async (req: Request, res: Response) => {
    const updateData = { ...req.body };

    if (updateData.password) {
      const salt = await bcrypt.genSalt(10);
      updateData.password = await bcrypt.hash(updateData.password, salt);
    }

    const user = await User.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
    });

    if (!user) {
      res.status(404).json({
        success: false,
        message: "Super admin not found",
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: "Super admin updated successfully",
      data: user,
    });
  }
);

export const deleteUser = asyncHandler(async (req: Request, res: Response) => {
  const user = await User.findByIdAndDelete(req.params.id);

  if (!user) {
    res.status(404).json({
      success: false,
      message: "Super admin not found",
    });
    return;
  }

  res.status(200).json({
    success: true,
    message: "Super admin deleted successfully",
  });
});
