import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import Mentor, { IMentor } from "../models/Mentor";
import Mentee from "../models/Mentee";
import bcryptjs from "bcryptjs";
import { generateOtpCode } from "../utils/generateOtp";
import { generateToken } from "../utils/generateToken";
import sendOtpEmail from "../utils/sendOtpEmail";

// Helper → always save as uploads/filename
const buildPath = (file?: Express.Multer.File) => {
  return file ? `uploads/${file.filename}` : undefined;
};

// @desc    Create new mentor
// @route   POST /api/mentors
export const createMentor = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const mentorData: any = req.body;

    // Attach file paths
    if (req.files) {
      const files = req.files as { [fieldname: string]: Express.Multer.File[] };

      mentorData.gmcCertificate = buildPath(files["gmcCertificate"]?.[0]);
      mentorData.specialtyCertificates =
        files["specialtyCertificates"]?.map(buildPath);
      mentorData.cvDocument = buildPath(files["cvDocument"]?.[0]);
      mentorData.indemnityInsurance = buildPath(
        files["indemnityInsurance"]?.[0]
      );
      mentorData.image = buildPath(files["image"]?.[0]);
      mentorData.profilePicture = buildPath(files["profilePicture"]?.[0]);
    }

    // Required validation
    if (!mentorData.name || !mentorData.email || !mentorData.gmcNumber) {
      res
        .status(400)
        .json({ success: false, message: "Missing required fields" });
      return;
    }

    const existing = await Mentor.findOne({ email: mentorData.email });
    if (existing) {
      res.status(400).json({
        success: false,
        message: "Mentor with this email already exists",
      });
      return;
    }

    const mentor = new Mentor(mentorData);
    await mentor.save();

    res.status(201).json({ success: true, data: mentor });
  }
);

// @desc    Get all mentors
// @route   GET /api/mentors
export const getMentors = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const mentors = await Mentor.find();
    res.status(200).json({ success: true, data: mentors });
  }
);

// @desc    Get mentor by ID
// @route   GET /api/mentors/:id
export const getMentorById = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const mentor = await Mentor.findById(req.params.id);
    if (!mentor) {
      res.status(404).json({ success: false, message: "Mentor not found" });
      return;
    }
    res.status(200).json({ success: true, data: mentor });
  }
);

// @desc    Update mentor
// @route   PUT /api/mentors/:id
export const updateMentor = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const updateData: any = req.body;

    // Parse JSON fields (if they came as strings)
    if (typeof updateData.background === "string") {
      try {
        updateData.background = JSON.parse(updateData.background);
      } catch (err) {
        updateData.background = [];
      }
    }

    if (updateData.mentees) {
      if (typeof updateData.mentees === "string") {
        try {
          const parsed = JSON.parse(updateData.mentees);
          updateData.mentees = Array.isArray(parsed) ? parsed : [parsed];
        } catch {
          updateData.mentees = [updateData.mentees];
        }
      }
    }
    const allowedFormats = [
      "online",
      "onsite",
      "hybrid",
      "Phone Call",
      "Video Call",
      "Video",
      "In-Person",
      "Online",
    ];

    if (
      typeof updateData.mentorshipFormat !== "string" ||
      !allowedFormats.includes(updateData.mentorshipFormat)
    ) {
      updateData.mentorshipFormat = "online";
    }
    // Handle new files (if uploaded)
    if (req.files) {
      const files = req.files as { [fieldname: string]: Express.Multer.File[] };

      if (files["gmcCertificate"])
        updateData.gmcCertificate = buildPath(files["gmcCertificate"][0]);

      if (files["specialtyCertificates"])
        updateData.specialtyCertificates =
          files["specialtyCertificates"].map(buildPath);

      if (files["cvDocument"])
        updateData.cvDocument = buildPath(files["cvDocument"][0]);

      if (files["indemnityInsurance"])
        updateData.indemnityInsurance = buildPath(
          files["indemnityInsurance"][0]
        );

      if (files["image"]) updateData.image = buildPath(files["image"][0]);
      if (files["profilePicture"])
        updateData.profilePicture = buildPath(files["profilePicture"][0]);
    }

    try {
      const updated = await Mentor.findByIdAndUpdate(
        req.params.id,
        updateData,
        {
          new: true,
          runValidators: true,
        }
      );

      if (!updated) {
        res.status(404).json({ success: false, message: "Mentor not found" });
      }

      res.status(200).json({ success: true, data: updated });
    } catch (err: any) {
      if (err.name === "ValidationError") {
        const messages = Object.values(err.errors).map((e: any) => e.message);
        res.status(400).json({
          success: false,
          message: "Validation failed",
          errors: messages,
        });
      }
      res.status(500).json({
        success: false,
        message: "Server error",
        error: err.message || err,
      });
    }
  }
);

// @desc    Delete mentor
// @route   DELETE /api/mentors/:id
export const deleteMentor = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const deleted = await Mentor.findByIdAndDelete(req.params.id);
    if (!deleted) {
      res.status(404).json({ success: false, message: "Mentor not found" });
      return;
    }
    res
      .status(200)
      .json({ success: true, message: "Mentor deleted successfully" });
  }
);

// @desc    Get all mentees
// @route   GET /api/mentees
// @access  Public (or private)
export const getMentees = asyncHandler(async (req: Request, res: Response) => {
  const mentees = await Mentee.find();
  res.status(200).json(mentees);
});

// @desc    Get a single mentee
// @route   GET /api/mentees/:id
export const getMentee = asyncHandler(async (req: Request, res: Response) => {
  const mentee = await Mentee.findById(req.params.id);
  if (!mentee) {
    res.status(404);
    throw new Error("Mentee not found");
  }
  res.status(200).json(mentee);
});

// @desc    Create a mentee
// @route   POST /api/mentees
// @access  Private
// Create mentee with multiple mentors
export const createMentee = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { mentors, ...menteeData } = req.body; // Extract mentors array

    if (!mentors || !Array.isArray(mentors) || mentors.length === 0) {
      res.status(400).json({
        success: false,
        message: "At least one Mentor ID is required",
      });
    }

    // 1. Create the mentee with assigned mentors
    const mentee = await Mentee.create({ ...menteeData, mentors });

    // 2. Update each mentor to include this mentee

    res.status(201).json({ success: true, data: mentee });
  }
);

export const updateMentee = asyncHandler(
  async (req: Request, res: Response) => {
    const menteeId = req.params.id;
    const { mentor: newMentorId, ...updateData } = req.body;

    // 1. Find current mentee
    const currentMentee = await Mentee.findById(menteeId);
    if (!currentMentee) {
      res.status(404).json({ success: false, message: "Mentee not found" });
      return;
    }

    const oldMentorId = currentMentee.mentors?.toString();

    // 2. Update mentee
    const updatedMentee = await Mentee.findByIdAndUpdate(
      menteeId,
      { ...updateData, mentor: newMentorId || oldMentorId },
      { new: true, runValidators: true }
    );

    // 3. Remove from old mentor if mentor changed
    if (newMentorId && oldMentorId !== newMentorId) {
      await Mentor.findByIdAndUpdate(oldMentorId, {
        $pull: { mentees: menteeId },
      });
      await Mentor.findByIdAndUpdate(newMentorId, {
        $addToSet: { mentees: menteeId },
      });
    }

    res.status(200).json({ success: true, data: updatedMentee });
  }
);

export const deleteMentee = asyncHandler(
  async (req: Request, res: Response) => {
    const deleted = await Mentee.findByIdAndDelete(req.params.id);

    if (!deleted) {
      res.status(404).json({ success: false, message: "Mentee not found" });
      return;
    }

    res
      .status(200)
      .json({ success: true, message: "Mentee deleted successfully" });
  }
);

interface MulterFiles {
  cv?: Express.Multer.File[];
  gmcCertificate?: Express.Multer.File[];
  specialtyCertificates?: Express.Multer.File[];
  insuranceProof?: Express.Multer.File[];
}

export const createMentors = async (req: Request, res: Response) => {
  try {
    const body = req.body;

    const files = req.files as MulterFiles;

    // Validate required fields
    const requiredFields = [
      "fullName",
      "contactEmail",
      "phoneNumber",
      "specialty",
      "gmcNumber",
      "currentEmployer",
      "currentRole",
      "areasOfMentorship",
      "languagesSpoken",
      "yearsClinicalExperience",
      "yearsNhsExperience",
      "gmcRegistrationValid",
      "noFitnessToPractice",
      "codeOfConduct",
      "qualityReview",
      "gdprCompliance",
      "paymentMethod",
    ];

    for (const field of requiredFields) {
      if (!body[field]) {
        res.status(400).json({
          success: false,
          message: `Missing required field: ${field}`,
        });
      }
    }

    const newMentor = new Mentor({
      // Basic & Personal Info
      name: body.fullName,
      fullName: body.fullName,
      email: body.contactEmail,
      phone: body.phoneNumber,
      specialty: body.specialty,
      subspecialty: body.subspecialty,
      gmcNumber: body.gmcNumber,
      currentNhsTrust: body.currentEmployer,
      currentRole: body.currentRole,
      specialities: body.areasOfMentorship?.split(",") || [], // REQUIRED
      mentorshipAreas: body.areasOfMentorship?.split(",") || [],
      languagesSpoken: body.languagesSpoken?.split(",") || [],
      clinicalExperienceYears: Number(body.yearsClinicalExperience),
      nhsExperienceYears: Number(body.yearsNhsExperience),
      postgraduateQualifications:
        body.postgraduateQualifications?.split(",") || [],
      teachingRoles: body.teachingRoles?.split(",") || [],
      mentorshipExperience: body.previousMentorshipExperience,

      // Availability & Mentorship
      availability: body.typicalAvailability,
      mentorshipFormat: body.preferredMentorshipFormat,

      // Compliance
      gmcValid: body.gmcRegistrationValid === "true",
      noFitnessToPracticeIssues: body.noFitnessToPractice === "true",
      codeOfConductAgreement: body.codeOfConduct === "true",
      qualityReviewConsent: body.qualityReview === "true",
      gdprCompliance: body.gdprCompliance === "true",

      // Payment & CPD
      preferredPaymentMethod: body.paymentMethod,
      taxInfo: body.taxInfo,
      cpdParticipation: body.participateCpd === "yes",

      // Additional Info
      areasOfInterest: body.developmentInterests?.split(",") || [],
      allowPublicProfile: body.publicProfile === "yes",
      exclusiveMatching: body.exclusiveMatching === "yes",
      otherNotes: body.additionalNotes,

      // Uploaded Documents
      uploadedDocuments: {
        cv: files?.cv?.[0]?.filename,
        gmc_certificate: files?.gmcCertificate?.[0]?.filename,
        medical_degree: files?.specialtyCertificates?.[0]?.filename,
        indemnityInsurance: files?.insuranceProof?.[0]?.filename,
      },
    });

    await newMentor.save();

    res
      .status(201)
      .json({ success: true, message: "Mentor submitted successfully!" });
  } catch (err) {
    res
      .status(500)
      .json({ success: false, message: "Failed to submit mentor", error: err });
  }
};

export const loginMentor = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const mentor = await Mentor.findOne({ email });
  if (mentor && (await mentor.matchPassword(password))) {
    res.status(200).json({
      success: true,
      data: {
        _id: mentor._id,
        name: mentor.name,
        email: mentor.email,
        role: mentor.role,
        token: generateToken(mentor._id.toString(), mentor.role),
      },
    });
  } else {
    res
      .status(401)
      .json({ success: false, message: "Invalid email or password" });
  }
});

export const forgotPassword = asyncHandler(
  async (req: Request, res: Response) => {
    const { email } = req.body;
    const mentor = await Mentor.findOne({ email });

    const otp = generateOtpCode();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 mins expiry

    mentor.otp = otp;
    mentor.otpExpiry = otpExpiry;

    if (!mentor) {
      res.status(404).json({
        success: false,
        message: "No Mentor found with that email",
      });
    }

    await mentor.save();

    await sendOtpEmail(mentor.email, mentor.name, otp);

    res.status(200).json({
      suceess: true,
      message: "Reset password OTP sent to your email",
    });
  }
);

export const resetPassword = asyncHandler(
  async (req: Request, res: Response) => {
    const { otp, password } = req.body;

    const mentor = await Mentor.findOne({ otp });

    if (!mentor || !mentor.otpExpiry || mentor.otpExpiry < new Date()) {
      res.status(400).json({
        success: false,
        message: "Invalid or expired OTP",
      });
      return;
    }

    mentor.password = password;
    mentor.otp = undefined;
    mentor.otpExpiry = undefined;

    await mentor.save();

    res.status(200).json({
      success: true,
      message: "Password updated successfully",
      data: {
        _id: mentor._id,
        name: mentor.name,
        email: mentor.email,
        role: mentor.role,
        token: generateToken(mentor._id.toString(), mentor.role),
      },
    });
  }
);

export const profile = asyncHandler(async (req: any, res: Response) => {
  const { _id } = req.user;
  const mentor = await Mentor.findById(_id).lean();
  if (!mentor) {
    res.status(404).json({
      success: false,
      mesagge: "Mentor not found",
    });
  } else {
    res.status(200).json({
      success: true,
      message: "Mentor profile fetched successfully",
      data: mentor,
    });
  }
});

export const updateProfile = asyncHandler(async (req: any, res: Response) => {
  const { _id } = req.user;

  const updateData = { ...req.body };

  if (updateData.password) {
    const salt = await bcryptjs.genSalt(10);
    updateData.password = await bcryptjs.hash(updateData.password, salt);
  }

  const mentor = await Mentor.findByIdAndUpdate(_id, updateData, {
    new: true,
  });

  if (!mentor) {
    res.status(404).json({
      success: false,
      message: "Mentor not found",
    });
    return;
  }

  res.status(200).json({
    success: true,
    message: "Mentor profile updated successfully",
    data: mentor,
  });
});
