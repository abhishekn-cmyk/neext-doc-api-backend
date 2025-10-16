import { RequestHandler } from "express";
import Program from "../models/Program";
import Payment from "../models/Payment";
import Booking from "../models/Booking";
import Mentor from "../models/Mentor";
import { asyncHandler } from "../utils/asyncHandler";

// ✅ helper for safe JSON parsing
const safeParse = (value: any, fallback: any = []) => {
  try {
    return typeof value === "string" ? JSON.parse(value) : value || fallback;
  } catch {
    return fallback;
  }
};

// Create Program
export const createProgram: RequestHandler = asyncHandler(async (req, res) => {
  const { body, files } = req as any;

  const program = new Program({
    ...body,
    image: files?.image
      ? `/uploads/programs/${files.image[0].filename}`
      : undefined,
    gallery: files?.gallery
      ? files.gallery.map((file: any) => `/uploads/programs/${file.filename}`)
      : [],
    pricingOptions: safeParse(body.pricingOptions),
    mentors: safeParse(body.mentors),
    features: safeParse(body.features),
  });

  await program.save();

  res.status(201).json({ success: true, data: program });
});

// Get All Programs
export const getPrograms: RequestHandler = asyncHandler(async (_req, res) => {
  const programs = await Program.find().populate("mentors");

  res.json({ success: true, data: programs });
});

// Get Single Program
export const getProgramById: RequestHandler = asyncHandler(async (req, res) => {
  const program = await Program.findById(req.params.id).populate("mentors");
  if (!program) {
    res.status(404).json({ success: false, message: "Program not found" });
    return;
  }

  res.json({ success: true, data: program });
});

// Update Program
export const updateProgram: RequestHandler = asyncHandler(async (req, res) => {
  const { body, files } = req as any;

  const updateData: any = {
    ...body,
    pricingOptions: safeParse(body.pricingOptions),
    mentors: safeParse(body.mentors),
    features: safeParse(body.features),
  };

  if (files?.image) {
    updateData.image = `/uploads/programs/${files.image[0].filename}`;
  }
  if (files?.gallery) {
    updateData.gallery = files.gallery.map(
      (file: any) => `/uploads/programs/${file.filename}`
    );
  }

  const program = await Program.findByIdAndUpdate(req.params.id, updateData, {
    new: true,
  });
  if (!program) {
    res.status(404).json({ success: false, message: "Program not found" });
    return;
  }

  res.json({ success: true, data: program });
});

// Delete Program
export const deleteProgram: RequestHandler = asyncHandler(async (req, res) => {
  const program = await Program.findByIdAndDelete(req.params.id);
  if (!program) {
    res.status(404).json({ success: false, message: "Program not found" });
    return;
  }

  res.json({ success: true, message: "Program deleted successfully" });
});

// Make Payment
export const makePayment: RequestHandler = asyncHandler(async (req, res) => {
  const { programId, amount, paymentMethod } = req.body;
  const userId = (req as any).user.id;

  const program = await Program.findById(programId);
  if (!program) {
    res.status(404).json({ success: false, message: "Program not found" });
    return;
  }

  const payment = await Payment.create({
    user: userId,
    program: programId,
    amount,
    method: paymentMethod,
    status: "completed",
  });

  res.status(201).json({ success: true, data: payment });
});

// Book Mentor Session
export const bookSession: RequestHandler = asyncHandler(async (req, res) => {
  const { programId, mentorId, date } = req.body;
  const userId = (req as any).user.id;

  const program = await Program.findById(programId);
  if (!program) {
    res.status(404).json({ success: false, message: "Program not found" });
    return;
  }

  const mentor = await Mentor.findById(mentorId);
  if (!mentor) {
    res.status(404).json({ success: false, message: "Mentor not found" });
    return;
  }

  const booking = await Booking.create({
    user: userId,
    program: programId,
    mentor: mentorId,
    date,
    status: "confirmed",
  });

  res.status(201).json({ success: true, data: booking });
});
