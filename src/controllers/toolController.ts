import { Request, Response } from "express";
import fs from "fs";
import path from "path";
import Tool from "../models/Tool";
import { ICategory } from "../models/Tool";
import { CategorySchema } from "../models/Tool";
import Payment from "../models/Payment";
import { asyncHandler } from "../utils/asyncHandler";
import CV from "../models/CV";
import mongoose, { Model } from "mongoose";
import { Document } from "mongoose";
import PDFDocument from "pdfkit";
import { Types } from "mongoose";
import { InterviewSession } from "../models/Interview";
import { IGapMap } from "../models/Gapmap";
import GapMap from "../models/Gapmap";
import { MatchWithScore } from "../models/Sponsormatch";
import { DoctorSponsorship, IDoctorSponsorship } from "../models/Sponsormatch";

// ✅ Helper to delete old image safely
const deleteOldImage = (imagePath: string | undefined) => {
  if (!imagePath) return;
  const fullPath = path.join(__dirname, "..", imagePath);
  if (fs.existsSync(fullPath)) {
    fs.unlinkSync(fullPath);
  }
};
const Category: Model<ICategory> = mongoose.model<ICategory>(
  "Category",
  CategorySchema
);

// Public: Get all tools

export const getTools = asyncHandler(async (req: Request, res: Response) => {
  const tools = await Tool.find().sort({ createdAt: -1 });
  res.json({ success: true, data: tools });
});

// Public: Get single tool

export const getToolById = asyncHandler(async (req: Request, res: Response) => {
  const tool = await Tool.findById(req.params.id);
  if (!tool) {
    res.status(404).json({ success: false, message: "Tool not found" });
    return;
  }
  res.json({ success: true, data: tool });
});

// Admin: Create tool
export const createTool = asyncHandler(async (req: Request, res: Response) => {
  const data: any = {
    ...req.body,
    features: req.body.features ? JSON.parse(req.body.features) : [],
    pricingOptions: req.body.pricingOptions
      ? JSON.parse(req.body.pricingOptions)
      : [],
    actions: req.body.actions ? JSON.parse(req.body.actions) : [],
  };

  if (req.file) {
    data.image = `/uploads/${req.file.filename}`;
  }

  const tool = await Tool.create(data);
  res.status(201).json({ success: true, data: tool });
});

const parseArrayField = (field: any): any[] => {
  if (!field) return [];
  if (Array.isArray(field)) return field;
  if (typeof field === "string") {
    try {
      const parsed = JSON.parse(field);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }
  return [];
};

// Helper to safely parse objects from strings or objects
const parseObjectField = (field: any): object | undefined => {
  if (!field) return undefined;
  if (typeof field === "object" && !Array.isArray(field)) return field;
  if (typeof field === "string") {
    try {
      const parsed = JSON.parse(field);
      return typeof parsed === "object" && !Array.isArray(parsed)
        ? parsed
        : undefined;
    } catch {
      return undefined;
    }
  }
  return undefined;
};

// Helper to parse numbers
const parseNumberField = (field: any): number | undefined => {
  const num = Number(field);
  return isNaN(num) ? undefined : num;
};

// Optional: parse date fields
const parseDateField = (field: any): Date | undefined => {
  if (!field) return undefined;
  const date = new Date(field);
  return isNaN(date.getTime()) ? undefined : date;
};

export const updateTool = asyncHandler(async (req: Request, res: Response) => {
  try {
    const tool = await Tool.findById(req.params.id);
    if (!tool) {
      console.log("❌ Tool not found for id:", req.params.id);
     res.status(404).json({ success: false, message: "Tool not found" });
    }

    console.log("📥 [UPDATE TOOL] Incoming body:", req.body);
    console.log("📸 [UPDATE TOOL] Uploaded file:", req.file);

    const data: any = {};

    // Parse arrays
    data.features = parseArrayField(req.body.features);
    data.pricingOptions = parseArrayField(req.body.pricingOptions);
    data.actions = parseArrayField(req.body.actions);
    data.categories = parseArrayField(req.body.categories);
    data.exams = parseArrayField(req.body.exams);

    // Parse objects
    data.personal = parseObjectField(req.body.personal);
    data.status = parseObjectField(req.body.status);
    data.examsData = parseObjectField(req.body.examsData);
    data.goals = parseObjectField(req.body.goals);

    // Parse number fields
    if ("basePrice" in req.body) {
      const num = parseNumberField(req.body.basePrice);
      if (num !== undefined) data.basePrice = num;
    }

    // Copy other string fields
    Object.keys(req.body).forEach((key) => {
      if (![
        "features","pricingOptions","actions","categories","exams",
        "personal","status","examsData","goals","basePrice"
      ].includes(key)) {
        if (req.body[key] !== "") data[key] = req.body[key];
      }
    });

    // Handle uploaded image
    if (req.file) {
      if (tool.image) deleteOldImage(tool.image);
      data.image = `/uploads/${req.file.filename}`;
    }

    console.log("✅ [UPDATE TOOL] Final data to update:", data);

    const updatedTool = await Tool.findByIdAndUpdate(
      req.params.id,
      { $set: data },
      { new: true, runValidators: true }
    );

    res.json({ success: true, data: updatedTool });
  } catch (err: any) {
    console.error("❌ [UPDATE TOOL] Caught error:", err);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: err.message,
      stack: err.stack,
    });
  }
});

// Admin: Delete tool

export const deleteTool = asyncHandler(async (req: Request, res: Response) => {
  const tool = await Tool.findByIdAndDelete(req.params.id);
  if (!tool) {
    res.status(404).json({ success: false, message: "Tool not found" });
    return;
  }

  deleteOldImage(tool.image);
  res.json({ success: true, message: "Tool deleted" });
});

// User: Initiate payment

export const initiateToolPayment = asyncHandler(
  async (req: Request, res: Response) => {
    const { toolId, amount, method } = req.body;
    const tool = await Tool.findById(toolId);

    if (!tool) {
      res.status(404).json({ success: false, message: "Tool not found" });
      return;
    }

    const payment = await Payment.create({
      user: (req as any).user?._id, // user may come from protect middleware
      tool: toolId,
      amount,
      method,
      status: "pending",
    });

    res.json({ success: true, data: payment });
  }
);

// User: Verify tool access

export const checkToolAccess = asyncHandler(
  async (req: Request, res: Response) => {
    const { toolId } = req.params;
    const userId = (req as any).user?._id;

    const payment = await Payment.findOne({
      user: userId,
      tool: toolId,
      status: "success",
    });

    if (!payment) {
      res.status(403).json({ success: false, message: "Payment required" });
      return;
    }

    const tool = await Tool.findById(toolId);
    res.json({ success: true, data: tool });
  }
);

// Get categories for a specific tool
export const getCategoriesByTool = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const tool = await Tool.findById(id, "categories"); // only fetch categories
    if (!tool) res.status(404).json({ message: "Tool not found" });

    res.json(tool.categories);
  } catch (error) {
    res.status(500).json({ message: "Error fetching categories", error });
  }
};

// Controller
export const getCategory = async (req: Request, res: Response) => {
  try {
    const categories = await Category.find(); // ✅ works now
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ message: "Error fetching categories", error });
  }
};
// Add category to a tool
export const addCategoryToTool = async (req: Request, res: Response) => {
  try {
    const { id } = req.params; // tool id
    const category: ICategory = req.body;

    const tool = await Tool.findById(id);
    if (!tool) res.status(404).json({ message: "Tool not found" });

    tool.categories.push(category);
    await tool.save();

    res.status(201).json(tool);
  } catch (error) {
    res.status(500).json({ message: "Error adding category", error });
  }
};

export const saveProfileForm = async (req: Request, res: Response) => {
  try {
    const {
      name,
      description,
      tagline,
      features,
      basePrice,
      personal,
      status,
      examsData,
      goals,
      user_id,
      token,
      category,
    } = req.body;

    if (!user_id || !token) {
      res.status(400).json({ error: "⚠️ Please sign in to continue" });
      return;
    }

    // Check if profile already exists for this user
    let gapmap = (await GapMap.findOne({ user_id })) as
      | (IGapMap & Document)
      | null;

    if (gapmap) {
      gapmap.name = name || gapmap.name;
      gapmap.description = description || gapmap.description;
      gapmap.category = category || gapmap.category;
      gapmap.tagline = tagline || gapmap.tagline;
      gapmap.features = features || gapmap.features;
      gapmap.basePrice = basePrice ?? gapmap.basePrice;
      gapmap.personal = personal || gapmap.personal;
      gapmap.status = status || gapmap.status;
      gapmap.examsData = examsData || gapmap.examsData;
      gapmap.goals = goals || gapmap.goals;
      gapmap.token = token;
      await gapmap.save();

      res.status(200).json({
        message: "Profile updated successfully ✅",
        gapmap,
      });
    } else {
      // ✅ Create new profile if not exists
      const newGapMap = new GapMap({
        name,
        description,
        tagline,
        features,
        basePrice,
        personal,
        status,
        category,
        examsData,
        goals,
        user_id,
        token,
      });

      await newGapMap.save();

      res.status(201).json({
        message: "Profile created successfully",
        tool: newGapMap,
      });
    }
  } catch (err: any) {
    res.status(500).json({ error: "Failed to save profile form" });
  }
};

// Fetch profile for logged-in user
export const getProfileForm = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;

    const gapmap = await GapMap.findOne({ user_id: userId });

    if (!gapmap) {
      res.status(404).json({ error: "Profile not found" });
    } else {
      res.status(200).json(gapmap);
    }
  } catch (err: any) {
    res.status(500).json({ error: "Failed to fetch profile form" });
  }
};

export const createCV = async (req: Request, res: Response) => {
  const {
    user_id,
    token,
    personalInfo,
    experience,
    education,
    achievements,
    additional,
  } = req.body;

  if (!user_id || !token) {
    res.status(401).json({ error: "User not authenticated" });
  }

  try {
    // Find CV tool category
    const tool = await Tool.findOne({ name: { $regex: /^cv/i } });
    if (!tool) {
      res.status(400).json({ error: "CV Tool category not found" });
    }

    const category = tool.name;

    // ❌ Skip update logic — always create a new CV
    const cv = new CV({
      user_id,
      token,
      category,
      personalInfo,
      experience,
      education,
      achievements,
      additional,
    });

    await cv.save();

    res.status(201).json({
      message: "CV created successfully",
      action: "created",
      cv,
    });
  } catch (error: any) {
    res.status(500).json({ error: "Failed to create CV" });
  }
};

export const getCVByUserId = async (req: Request, res: Response) => {
  const { user_id } = req.params;

  if (!user_id) {
    res.status(400).json({ error: "User ID is required" });
  }

  try {
    // Fetch all CVs for this user (can be multiple categories)
    const cvs = await CV.find({ user_id });

    if (!cvs || cvs.length === 0) {
      res.status(404).json({ message: "No CVs found for this user" });
    }

    res.status(200).json({ cvs });
  } catch (error: any) {
    res.status(500).json({ error: "Failed to fetch CVs" });
  }
};
export const getCVByUser = async (req: Request, res: Response) => {
  const userId = req.params.userId;

  try {
    const cv = await CV.findOne({ user_id: userId });
    if (!cv) {
      res.status(404).json({ error: "CV not found" });
    }

    res.status(200).json({ cv });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch CV" });
  }
};

export const downloadCVPDF = async (req: Request, res: Response) => {
  const userId = req.params.userId;

  try {
    const cv = await CV.findOne({ user_id: userId });
    if (!cv) {
      res.status(404).json({ error: "CV not found" });
    }

    const doc = new PDFDocument({ margin: 50 });
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=CV-${cv.personalInfo.fullName}.pdf`
    );
    res.setHeader("Content-Type", "application/pdf");

    doc.pipe(res);

    // ===== NHS CV HEADER =====
    doc
      .fontSize(24)
      .fillColor("#0a5ca5")
      .text("NHS CV", { align: "center", underline: true })
      .moveDown(1.5);

    // ===== Personal Info =====
    doc
      .fontSize(18)
      .fillColor("black")
      .text("Personal Information", { underline: true });
    doc.moveDown(0.5);
    doc.fontSize(12).text(`Full Name: ${cv.personalInfo.fullName}`);
    doc.text(`Preferred Title: ${cv.personalInfo.preferredTitle}`);
    doc.text(`Email: ${cv.personalInfo.email}`);
    doc.text(`Phone: ${cv.personalInfo.phone}`);
    doc.text(`GMC Number: ${cv.personalInfo.gmcNumber}`);
    doc.moveDown();

    // ===== Experience =====
    doc.fontSize(18).text("Experience", { underline: true });
    doc.moveDown(0.5);
    doc.fontSize(12).text(`Current Role: ${cv.experience.currentRole}`);
    doc.text(`Employer: ${cv.experience.currentEmployer}`);
    doc.text(`Specialty: ${cv.experience.specialty}`);
    doc.text(`Years of Experience: ${cv.experience.yearsExperience}`);
    doc.moveDown();

    // ===== Education =====
    doc.fontSize(18).text("Education", { underline: true });
    doc.moveDown(0.5);
    doc.fontSize(12).text(`Medical School: ${cv.education.medicalSchool}`);
    doc.text(`Graduation Year: ${cv.education.graduationYear}`);
    if (cv.education.postgraduateQualifications?.length) {
      doc.moveDown(0.5).text("Postgraduate Qualifications:");
      cv.education.postgraduateQualifications.forEach((q: string) =>
        doc.list([q])
      );
    }
    if (cv.education.currentStudy) {
      doc.text(`Current Study: ${cv.education.currentStudy}`);
    }
    doc.moveDown();

    // ===== Achievements =====
    doc.fontSize(18).text("Achievements", { underline: true });
    doc.moveDown(0.5);
    if (cv.achievements.audits?.length) {
      doc.text("Audits:").list(cv.achievements.audits);
    }
    if (cv.achievements.research?.length) {
      doc.text("Research:").list(cv.achievements.research);
    }
    if (cv.achievements.teaching?.length) {
      doc.text("Teaching:").list(cv.achievements.teaching);
    }
    if (cv.achievements.cpd?.length) {
      doc
        .text("Continuing Professional Development (CPD):")
        .list(cv.achievements.cpd);
    }
    doc.moveDown();

    // ===== Additional =====
    doc.fontSize(18).text("Additional Information", { underline: true });
    doc.moveDown(0.5);
    if (cv.additional.languages?.length) {
      doc.text("Languages:").list(cv.additional.languages);
    }
    if (cv.additional.interests) {
      doc.moveDown(0.5).text(`Interests: ${cv.additional.interests}`);
    }
    if (cv.additional.availability) {
      doc.text(`Availability: ${cv.additional.availability}`);
    }

    // ===== Footer =====
    doc.moveDown(2);
    doc
      .fontSize(10)
      .fillColor("gray")
      .text("Generated by NHS CV Booster Tool", { align: "center" });

    doc.end();
  } catch (error) {
    res.status(500).json({ error: "Failed to generate PDF" });
  }
};

export const updateCV = async (req: Request, res: Response) => {
  const userId = req.params.userId;
  const { personalInfo, experience, education, achievements, additional } =
    req.body;

  if (!userId) {
    res.status(400).json({ error: "User ID is required" });
  }

  try {
    // Find the CV for this user
    const cv = await CV.findOne({ user_id: userId });

    if (!cv) {
      res.status(404).json({ error: "CV not found" });
    }

    // Update fields if provided
    if (personalInfo) cv.personalInfo = personalInfo;
    if (experience) cv.experience = experience;
    if (education) cv.education = education;
    if (achievements) cv.achievements = achievements;
    if (additional) cv.additional = additional;

    await cv.save();

    res.status(200).json({ message: "CV updated successfully", cv });
  } catch (error) {
    res.status(500).json({ error: "Failed to update CV" });
  }
};

/**
 * Update CV
 */

/**
 * Start Interview Session
 */
export const startSession = async (req: Request, res: Response) => {
  try {
    const { userId, config, questions } = req.body;

    if (!userId || !config || !questions) {
      res.status(400).json({ error: "Missing required fields" });
    }

    const session = new InterviewSession({
      userId: new Types.ObjectId(userId),
      config,
      questions,
      answers: [],
      createdAt: new Date(),
      completedAt: null,
    });

    await session.save();
    res.status(201).json({ sessionId: session._id });
  } catch (err) {
    res.status(500).json({ error: "Failed to start session" });
  }
};

/**
 * Save/Update answer
 */
export const saveAnswer = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { questionIndex, answer } = req.body;

    if (questionIndex === undefined || answer === undefined) {
      res.status(400).json({ error: "Missing questionIndex or answer" });
    }

    const session = await InterviewSession.findById(id);
    if (!session) res.status(404).json({ error: "Session not found" });

    session.answers[questionIndex] = answer;
    await session.save();

    res.json({ message: "Answer saved", answers: session.answers });
  } catch (err) {
    res.status(500).json({ error: "Failed to save answer" });
  }
};

/**
 * Complete session
 */
export const completeSession = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const session = await InterviewSession.findById(id);
    if (!session) res.status(404).json({ error: "Session not found" });

    session.completedAt = new Date();
    await session.save();

    res.json({ message: "Session completed", session });
  } catch (err) {
    res.status(500).json({ error: "Failed to complete session" });
  }
};

/**
 * Get session details
 */
export const getSession = async (req: Request, res: Response) => {
  try {
    const session = await InterviewSession.findById(req.params.id);
    if (!session) res.status(404).json({ error: "Session not found" });

    res.json(session);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch session" });
  }
};

// SPONSORMATCH

// ---------------- Create a new sponsorship record ----------------
const mapExamsToSchema = (examsPassed: string[]) => ({
  plab1: examsPassed.includes("PLAB 1"),
  plab2: examsPassed.includes("PLAB 2"),
  ielts: examsPassed.includes("IELTS"),
  oet: examsPassed.includes("OET"),
  pte: examsPassed.includes("PTE"),
  toefl: examsPassed.includes("TOEFL"),
  ukcat: examsPassed.includes("UKCAT"),
  mrcpPart1: examsPassed.includes("MRCP Part 1"),
  mrcpPart2: examsPassed.includes("MRCP Part 2"),
  mrcpPaces: examsPassed.includes("MRCP PACES"),
  mrcsPartA: examsPassed.includes("MRCS Part A"),
  mrcsPartB: examsPassed.includes("MRCS Part B"),
  mrcogPart1: examsPassed.includes("MRCOG Part 1"),
  mrcogPart2: examsPassed.includes("MRCOG Part 2"),
  mrcpch: examsPassed.includes("MRCPCH"),
});

export const createSponsorship = async (req: Request, res: Response) => {
  try {
    const {
      userId,
      personalInfo,
      visaInfo,
      medicalQualifications,
      jobPreferences,
    } = req.body;

    if (!userId) res.status(400).json({ error: "userId is required" });

    const sponsorshipData = {
      userId,
      personalInfo: personalInfo, // comes from frontend
      visaInfo: {
        currentVisaStatus: visaInfo?.currentVisaStatus,
        visaExpiryDate: visaInfo?.visaExpiry || null,
        hasDependents: visaInfo?.dependents || false,
        previousUKSponsorship: visaInfo?.sponsorshipHistory,
      },
      medicalQualifications: {
        completedMedicalExams: mapExamsToSchema(
          medicalQualifications?.examsPassed || []
        ),
        englishLanguageTest: medicalQualifications?.englishTest,
        englishScore: medicalQualifications?.englishScore,
        ukClinicalExperience: medicalQualifications?.ukExperience,
        currentRole: medicalQualifications?.currentRole,
      },
      jobPreferences: {
        targetSpecialty: jobPreferences?.targetSpecialty,
        targetRoleLevel: jobPreferences?.targetRole,
        preferredLocations: jobPreferences?.preferredLocations || [],
        preferredStartDate: jobPreferences?.startDate || null,
        workPatternPreference: jobPreferences?.workPattern,
      },
    };

    const sponsorship = new DoctorSponsorship(sponsorshipData);
    await sponsorship.save();

    res.status(201).json(sponsorship);
  } catch (error: any) {
    res.status(500).json({ error: "Server error" });
  }
};

// ---------------- Get sponsorships by userId ----------------
export const getLatestSponsorshipByUserId = asyncHandler(
  async (req: Request, res: Response) => {
    const { userId } = req.params;
    if (!userId) {
       res.status(400).json({ error: "userId is required" });
    }

    // Don't type as IDoctorSponsorship; let TS infer lean type
    const latestRecord = await DoctorSponsorship.findOne({ userId })
      .sort({ createdAt: -1 }) // get the latest record
      .lean()
      .exec(); // returns a plain object

    if (!latestRecord) {
       res
        .status(404)
        .json({ error: "No sponsorship record found for this user" });
    }

    res.json({ sponsorship: latestRecord });
  }
);


export const updateLatestSponsorshipByUserId = asyncHandler(
  async (req: Request, res: Response) => {
    const { userId } = req.params;
    const updateData = req.body;

    if (!userId) res.status(400).json({ error: "userId is required" });

    const latestRecord = await DoctorSponsorship.findOne({ userId }).sort({
      createdAt: -1,
    });
    if (!latestRecord)
      res
        .status(404)
        .json({ error: "No sponsorship record found for this user" });

    Object.assign(latestRecord, updateData);
    await latestRecord.save();

    res.json({ sponsorship: latestRecord });
  }
);

// ---------------- Download Report ----------------
export const downloadReport = async (req: Request, res: Response) => {
  try {
    const { id: userId } = req.params;

    if (!userId) {
      res.status(400).json({ error: "User ID is required" });
    }

    // Doctor's own profile (plain object)
    const doctorProfile = await DoctorSponsorship.findOne({ userId })
      .lean()
      .exec(); // plain object
    if (!doctorProfile) {
       res.status(404).json({ error: "Doctor profile not found" });
    }

    // All sponsorships (plain objects)
    const sponsorships = await DoctorSponsorship.find().lean().exec();

    // Compute fitScore for each sponsorship
    const matches = sponsorships.map((trust) => {
      let score = 60;

      if (
        trust.jobPreferences?.targetSpecialty &&
        trust.jobPreferences.targetSpecialty === doctorProfile.jobPreferences?.targetSpecialty
      ) {
        score += 20;
      }

      if (
        doctorProfile.jobPreferences?.preferredLocations?.some((loc) =>
          trust.jobPreferences?.preferredLocations?.includes(loc)
        )
      ) {
        score += 20;
      }

      return { ...trust, fitScore: Math.min(score, 100) };
    });

    matches.sort((a, b) => (b.fitScore ?? 0) - (a.fitScore ?? 0));

    // ---------------- PDF Generation ----------------
    const doc = new PDFDocument({ margin: 50, size: "A4" });
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=${
        doctorProfile.personalInfo?.fullName || "doctor"
      }-sponsorship-report.pdf`
    );

    doc.pipe(res);

    // ... rest of PDF logic remains unchanged ...
    // You can safely use doctorProfile and matches now
    doc.end();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to generate report" });
  }
};


export const getfullSponsorShip = async (_req: Request, res: Response) => {
  try {
    // Fetch all documents from all 4 collections in parallel and populate userId
    const [doctorSponsorships, gapMaps, interviewSessions, cvs] =
      await Promise.all([
        DoctorSponsorship.find({}).populate("userId", "firstName email").lean(),
        GapMap.find({}).populate("user_id", "firstName email").lean(),
        InterviewSession.find({}).lean(), // If userId is just a string, you need to join manually
        CV.find({}).populate("user_id", "firstName email").lean(),
      ]);

    res.status(200).json({
      doctorSponsorships,
      gapMaps,
      interviewSessions,
      cvs,
    });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};
