import { protect } from "../middlewares/authMiddleware";
import { createPaymentIntent } from "../controllers/paymentController";
import express from "express";

const router = express.Router();

router.post("/", protect, createPaymentIntent);

export default router;
