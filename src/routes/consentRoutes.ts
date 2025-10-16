import express from "express";
import { protect } from "../middlewares/authMiddleware";
import { authorize } from "../middlewares/roleMiddleware";
import {
  saveConsent,
  getConsent,
  adminUpdateConsent,
  adminCreateConsent,   // <-- new controller
  adminGetAllConsents,  // <-- optional: list all consents
} from "../controllers/consentController";

const router = express.Router();

// Public (works with or without login)
router.post("/", saveConsent);
router.get("/me",  getConsent); // if logged in → by userId, else → by IP

// Admin
router.post("/admin", protect, authorize(["SuperAdmin"]), adminCreateConsent);  // <-- add consent
router.get("/admin", protect, authorize(["SuperAdmin"]), adminGetAllConsents); // <-- optional list
router.put("/admin/update-consent", protect, authorize(["SuperAdmin"]), adminUpdateConsent);

export default router;
