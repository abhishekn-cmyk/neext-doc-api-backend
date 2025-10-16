import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import Consent from "../models/Consent";

// Save consent (public: logged-in or guest)
export const saveConsent = asyncHandler(async (req: any, res: Response) => {
  const { choice, userId, policy, location } = req.body;

  if (!choice || !policy) {
    res
      .status(400)
      .json({ success: false, message: "Choice and policy required" });
    return;
  }

  let ip = (req.headers["x-forwarded-for"] as string)?.split(",")[0] || req.ip;
  if (ip === "::1") ip = "127.0.0.1";
  if (ip.startsWith("::ffff:")) ip = ip.substring(7);

  const userAgent = req.headers["user-agent"];

  const consent = await Consent.findOneAndUpdate(
    { userId: userId || null, ipAddress: ip },
    {
      userId: userId || undefined,
      choice,
      ipAddress: ip,
      userAgent,
      policy,
      location: location || undefined,
    },
    { new: true, upsert: true }
  );

  res.status(200).json({ success: true, data: consent });
});

// Get consent (logged-in or guest)
export const getConsent = asyncHandler(async (req: any, res: Response) => {
  const ip = req.headers["x-forwarded-for"]?.split(",")[0] || req.ip;

  let consent;
  if (req.user?._id) {
    consent = await Consent.findOne({ userId: req.user._id });
  } else {
    consent = await Consent.findOne({ ipAddress: ip });
  }

  if (!consent) {
    res
      .status(404)
      .json({ success: false, message: "No consent record found" });
    return;
  }

  res.status(200).json({ success: true, data: consent });
});

// Admin: update consent
export const adminUpdateConsent = asyncHandler(
  async (req: any, res: Response) => {
    const { userId, ipAddress, choice, policy } = req.body;

    if (!choice) {
      res
        .status(400)
        .json({ success: false, message: "Consent choice is required" });
      return;
    }
    if (!policy) {
      res
        .status(400)
        .json({ success: false, message: "Policy details are required" });
      return;
    }

    const query: any = {};
    if (userId) query.userId = userId;
    else if (ipAddress) query.ipAddress = ipAddress;
    else {
      res.status(400).json({
        success: false,
        message: "Either userId or ipAddress is required",
      });
      return;
    }

    const consent = await Consent.findOneAndUpdate(
      query,
      { choice, policy },
      { new: true, upsert: true }
    );

    res.status(200).json({ success: true, data: consent });
  }
);

// Admin: create consent
export const adminCreateConsent = asyncHandler(
  async (req: Request, res: Response) => {
    const { userId, choice, policy } = req.body;

    if (!choice || !policy) {
      res
        .status(400)
        .json({ success: false, message: "Choice and policy are required" });
      return;
    }

    const consent = await Consent.create({
      userId: userId || undefined,
      ipAddress: req.ip,
      userAgent: req.headers["user-agent"],
      choice,
      policy,
    });

    res.status(201).json({ success: true, data: consent });
  }
);

// Admin: list all consents
export const adminGetAllConsents = asyncHandler(
  async (req: Request, res: Response) => {
    const consents = await Consent.find().populate("userId", "name email");

    res.json({ success: true, data: consents });
  }
);
