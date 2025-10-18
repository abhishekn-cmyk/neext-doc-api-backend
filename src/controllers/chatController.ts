import { Request, Response } from "express";
import { Chat } from "../models/Chat";
import { GoogleGenerativeAI } from "@google/generative-ai";
import asyncHandler from "express-async-handler";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

export const sendChat = asyncHandler(async (req: any, res: Response) => {
  const { text, userId, tab } = req.body; // ✅ extract userId from body

  console.log("Text:", text);
  console.log("User ID:", userId);
  console.log("Tab:", tab);

  if (!text) {
     res
      .status(400)
      .json({ success: false, message: "Text is required" });
  }

  if (!userId) {
     res
      .status(401)
      .json({ success: false, message: "User not authenticated" });
  }

  // Generate AI response
  const result = await model.generateContent(text);
  const response = await result.response.text();

  // Save chat in MongoDB
  const chat = await Chat.create({
    userId,
    text,
    response,
  });

  res.status(201).json({
    success: true,
    message: "Chat created successfully",
    data: {
      chat,
      response,
    },
  });
});


export const getChats = asyncHandler(async (req: any, res: Response) => {
  const userId = req.user?._id;

  const chats = await Chat.find({ userId }).sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    message: "Chats fetched successfully",
    data: chats,
  });
});
