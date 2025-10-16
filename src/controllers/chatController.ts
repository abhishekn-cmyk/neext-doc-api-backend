import { Request, Response } from "express";
import { Chat } from "../models/Chat";
import { GoogleGenerativeAI } from "@google/generative-ai";
import asyncHandler from "express-async-handler";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

export const sendChat = asyncHandler(async (req: any, res: Response) => {
  const { text } = req.body;
  const userId = req.user?._id;
   console.log(text);
   console.log(userId);
  if (!text) {
    res.status(400).json({ success: false, message: "Text is required" });
    return;
  }

  const result = await model.generateContent(text);
  console.log(result);
  // Corrected line: Await the .text() method to get the string response.
  const response = await result.response.text();

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
