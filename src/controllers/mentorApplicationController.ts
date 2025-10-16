import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import Mentor from "../models/Mentor";
import bcryptjs from "bcryptjs";
import { MentorApplication } from "../models/MentorApplication";
import sendEmail from "../utils/sendEmail";

export const createMentorApplication = asyncHandler(
  async (req: Request, res: Response) => {
    const mentorApplication = await MentorApplication.create(req.body);
    res.status(201).json({
      success: true,
      message: "Mentor application submitted successfully",
      data: mentorApplication,
    });
  }
);

export const getMentorApplication = asyncHandler(
  async (req: Request, res: Response) => {
    const limit = parseInt(req.query.limit as string) || 10;
    const page = parseInt(req.query.page as string) || 1;

    const skip = (page - 1) * limit;

    const mentorApplication = await MentorApplication.find()
      .skip(skip)
      .limit(limit)
      .lean();

    res.status(200).json({
      success: true,
      message: "Mentor application fetched successfully",
      data: mentorApplication,
    });
  }
);
import path from "path";
import fs from "fs";

export const updateTerms = asyncHandler(async (req: Request, res: Response) => {
  const { terms } = req.body; // e.g., "uploads/file.pdf"
  const mentor = await MentorApplication.findById(req.params.id);

  if (!mentor) {
    res.status(404).json({ message: "Mentor application not found" });
    return;
  }

  if (!terms) {
    res.status(400).json({ message: "No terms file provided" });
    return;
  }

  // Extract filename
  const fileName = path.basename(terms);

  // Resolve absolute path to backend uploads folder
  const filePath = path.join(__dirname, "..", "uploads", fileName);

  console.log("Resolved path:", filePath);

  if (!fs.existsSync(filePath)) {
    res.status(400).json({ message: "Terms file not found on server" });
    return;
  }

  // Save relative path in DB
  mentor.terms = terms;
  await mentor.save();

  // Send email with attachment
  await sendEmail(
    mentor.email,
    "Updated Terms & Conditions - Next Doc",
    `<p>Hi <strong>${mentor.fullName}</strong>,</p>
     <p>We have updated our <strong>Terms & Conditions</strong>. Please review the attached document carefully.</p>
     <p>Thank you,<br>The Next Doc Team</p>`,
    [
      {
        filename: fileName,
        path: filePath,
      },
    ]
  );

  res.status(200).json({
    success: true,
    message: "Terms updated and sent via email with attachment",
    data: mentor,
  });
});

export const approveMentor = asyncHandler(
  async (req: Request, res: Response) => {
    const mentorApplication = await MentorApplication.findById(req.params.id);

    if (!mentorApplication) {
      res.status(404).json({ message: "Mentor not found" });
      return;
    }

    mentorApplication.status = "approved";

    const plainPassword = Math.random().toString(36).slice(-8); // 8 chars
    const hashedPassword = await bcryptjs.hash(plainPassword, 10);

    console.log(mentorApplication )

    const mentor = await Mentor.create({
      ...mentorApplication.toObject(),
      name:mentorApplication.fullName,
      password: hashedPassword,
    });

    await sendEmail(
      mentor.email,
      "Mentor Application Approved - Next Doc",
      `<div style="font-family: Roboto, sans-serif; max-width: 600px; margin: auto; padding: 20px; background-color: #f9f9f9; border: 1px solid #e0e0e0; border-radius: 10px;">
  <div style="text-align: center;">
    <img src="http://next-doc-backend.vual.in/uploads/logo.png" alt="Logo" style="max-width: 120px; margin-bottom: 20px;">
  </div>

  <h2 style="color: #00125c; text-align: center;">Congratulations, ${mentor?.fullName} 🎉</h2>

  <p style="color: #555555;">Hi <strong>${mentor?.fullName}</strong>,</p>

  <p style="color: #555555;">
    We’re excited to inform you that your <strong>Mentor Application</strong> has been
    <span style="color: green; font-weight: bold;">approved successfully</span>!
  </p>

  <p style="color: #555555;">
    You can now access your <strong>Mentor Dashboard</strong> and start your journey with us:
  </p>

  <div style="text-align: center; margin: 20px 0;">
    <a href=${process.env.MENTOR_DASHBOARD_URL}
     style="font-size: 18px; font-weight: bold; color: #ffffff; background-color: #00125c; padding: 12px 20px; text-decoration: none; border-radius: 8px; display: inline-block;">
      Go to Mentor Dashboard
    </a>
  </div>

  <p style="color: #555555; margin-bottom: 10px;">Here are your login details:</p>
  <ul style="color: #555555; padding-left: 20px;">
    <li><strong>Email:</strong> ${mentor?.email}</li>
    <li><strong>Password:</strong> ${plainPassword}</li>
  </ul>

  <p style="color: #555555;">
    Please keep your login credentials safe and do not share them with anyone.
  </p>

  <p style="color: #555555;">We’re thrilled to have you onboard! 🚀</p>

  <p style="color: #555555;">Thank you,<br>The Next Doc Team</p>

  <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 20px 0;">

  <p style="font-size: 12px; color: #999999; text-align: center;">
    &copy; 2025 Next Doc. All rights reserved.
  </p>
</div>
`
    );

    res.json({ message: "Mentor approved and credentials sent via email" });
  }
);

export const rejectMentor = asyncHandler(
  async (req: Request, res: Response) => {
    const mentorApplication = await MentorApplication.findById(req.params.id);

    if (!mentorApplication) {
      res
        .status(404)
        .json({ success: false, message: "Mentor application not found" });
      return;
    }

    const { remarks } = req.body;

    mentorApplication.status = "rejected";
    mentorApplication.remarks = remarks;
    await mentorApplication.save();

    await sendEmail(
      mentorApplication.email,
      "Mentor Application Status - Next Doc",
      `<div style="font-family: Roboto, sans-serif; max-width: 600px; margin: auto; padding: 20px; background: #fff;">
      <h2 style="color: #d9534f;">Application Rejected</h2>
      <p>Hi <strong>${mentorApplication.fullName}</strong>,</p>
      <p>We regret to inform you that your <strong>Mentor Application</strong> has been rejected.</p>
      <p><strong>Remarks:</strong> ${remarks}</p>
      <p>If you have any questions, please reach out to our support team.</p>
      <br/>
      <p>Thank you,<br/>The Next Doc Team</p>
    </div>`
    );

    res.status(200).json({
      success: true,
      message: "Mentor rejected and email sent with remarks",
    });
  }
);
