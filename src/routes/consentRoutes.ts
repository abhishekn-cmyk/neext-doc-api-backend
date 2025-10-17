import express from "express";
import {
  saveConsent,
  getConsent,
  adminUpdateConsent,
  adminCreateConsent,
  adminGetAllConsents,
} from "../controllers/consentController";

const router = express.Router();

// Public routes
router.post("/", saveConsent);
router.get("/me", getConsent); // works by userId if logged in, else by IP

// Admin routes without auth (now public, be careful!)
router.post("/admin", adminCreateConsent);  
router.get("/admin", adminGetAllConsents); 
router.put("/admin/update-consent", adminUpdateConsent);

export default router;
