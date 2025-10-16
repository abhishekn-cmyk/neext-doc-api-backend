import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import { DoctorSponsorship } from "../models/Sponsormatch";
import { fetchJobMatches } from "../utils/jobMatching";

export const matchJobsByUser = asyncHandler(
  async (req: any, res: Response) => {
    const { _id } = req.user;

    const profile = await DoctorSponsorship.findOne({ userId: _id }).sort({
      createdAt: -1,
    });
    if (!profile) {
      res
        .status(404)
        .json({ success: false, message: "No user profile found" });
      return;
    }

    const matches = await fetchJobMatches(profile);

    res.status(200).json({
      success: true,
      message: "Match fetched successfully",
      data: matches,
    });
  }
);
