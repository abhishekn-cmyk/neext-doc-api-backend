import { Request, Response, NextFunction } from "express";
import asyncHandler from "express-async-handler";
import { SuperAdmin } from "../models/SuperAdmin";
import { generateToken } from "../utils/generateToken";
import bcrypt from "bcryptjs";
import { generateOtpCode } from "../utils/generateOtp";
import sendOtpEmail from "../utils/sendOtpEmail";

export const registerSuperAdmin = asyncHandler(
  async (req: Request, res: Response) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      res.status(400).json({
        success: false,
        message: "All fields are required",
      });
      return;
    }

    const superAdminExists = await SuperAdmin.findOne({ email });
    if (superAdminExists) {
      res.status(400).json({
        success: false,
        message: "SuperAdmin already exists",
      });
      return;
    }

    const superAdmin = await SuperAdmin.create({ name, email, password });

    res.status(201).json({
      success: true,
      message: "SuperAdmin registered successfully",
      data: {
        _id: superAdmin._id.toString(),
        name: superAdmin.name,
        email: superAdmin.email,
        token: generateToken(superAdmin._id.toString(), superAdmin.role),
      },
    });
  }
);

export const loginSuperAdmin = asyncHandler(
  async (req: Request, res: Response) => {
    const { email, password } = req.body;
    const superAdmin = await SuperAdmin.findOne({ email });
    if (superAdmin && (await superAdmin.matchPassword(password))) {
      res.status(200).json({
        success: true,
        data: {
          _id: superAdmin._id,
          name: superAdmin.name,
          email: superAdmin.email,
          role: superAdmin.role,
          token: generateToken(superAdmin._id.toString(), superAdmin.role),
        },
      });
    } else {
      res
        .status(401)
        .json({ success: false, message: "Invalid email or password" });
    }
  }
);

export const forgotPassword = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email } = req.body;
    const superAdmin = await SuperAdmin.findOne({ email });

    const otp = generateOtpCode();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 mins expiry

    superAdmin.otp = otp;
    superAdmin.otpExpiry = otpExpiry;

    if (!superAdmin) {
      res.status(404).json({
        success: false,
        message: "No SuperAdmin found with that email",
      });
    }

    await superAdmin.save();

    await sendOtpEmail(superAdmin.email, superAdmin.name, otp);

    res.status(200).json({
      suceess: true,
      message: "Reset password OTP sent to your email",
    });
  }
);

export const resetPassword = asyncHandler(
  async (req: Request, res: Response) => {
    const { otp, password } = req.body;

    const superAdmin = await SuperAdmin.findOne({ otp });

    if (
      !superAdmin ||
      !superAdmin.otpExpiry ||
      superAdmin.otpExpiry < new Date()
    ) {
      res.status(400).json({
        success: false,
        message: "Invalid or expired OTP",
      });
      return;
    }

    superAdmin.password = password;
    superAdmin.otp = undefined;
    superAdmin.otpExpiry = undefined;

    await superAdmin.save();

    res.status(200).json({
      success: true,
      message: "Password updated successfully",
      data: {
        _id: superAdmin._id,
        name: superAdmin.name,
        email: superAdmin.email,
        role: superAdmin.role,
        token: generateToken(superAdmin._id.toString(), superAdmin.role),
      },
    });
  }
);

export const profile = asyncHandler(async (req: any, res: Response) => {
  const { _id } = req.user;
  const superAdmin = await SuperAdmin.findById(_id).lean();
  if (!superAdmin) {
    res.status(404).json({
      success: false,
      mesagge: "Super admin not found",
    });
  } else {
    res.status(200).json({
      success: true,
      message: "Super admin profile fetched successfully",
      data: superAdmin,
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

    const superAdmin = await SuperAdmin.findByIdAndUpdate(_id, updateData, {
      new: true,
    });

    if (!superAdmin) {
      res.status(404).json({
        success: false,
        message: "Super admin not found",
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: "Super admin profile updated successfully",
      data: superAdmin,
    });
  }
);

export const getSuperAdminById = asyncHandler(
  async (req: Request, res: Response) => {
    const superAdmin = await SuperAdmin.findById(req.params.id);

    if (!superAdmin) {
      res.status(404).json({
        success: false,
        message: "Super admin not found",
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: "Fetched super admin successfully",
      data: superAdmin,
    });
  }
);

export const getSuperAdmin = asyncHandler(
  async (req: Request, res: Response) => {
    const superAdmin = await SuperAdmin.find();

    if (!superAdmin) {
      res.status(404).json({
        success: false,
        message: "Super admin not found",
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: "Fetched super admin successfully",
      data: superAdmin,
    });
  }
);

export const updateSuperAdminById = asyncHandler(
  async (req: Request, res: Response) => {
    const updateData = { ...req.body };

    if (updateData.password) {
      const salt = await bcrypt.genSalt(10);
      updateData.password = await bcrypt.hash(updateData.password, salt);
    }

    const superAdmin = await SuperAdmin.findByIdAndUpdate(
      req.params.id,
      updateData,
      {
        new: true,
      }
    );

    if (!superAdmin) {
      res.status(404).json({
        success: false,
        message: "Super admin not found",
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: "Super admin updated successfully",
      data: superAdmin,
    });
  }
);

export const deleteSuperAdmin = asyncHandler(
  async (req: Request, res: Response) => {
    const superAdmin = await SuperAdmin.findByIdAndDelete(req.params.id);

    if (!superAdmin) {
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
  }
);
