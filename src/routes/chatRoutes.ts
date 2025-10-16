import { protect } from "../middlewares/authMiddleware";
import { sendChat, getChats } from "../controllers/chatController";
import express from "express";

const router = express.Router();

router.post("/", protect, sendChat);
router.get("/", protect, getChats);

export default router;
