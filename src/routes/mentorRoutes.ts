import express from "express";
import {
  createMentor,
  getMentors,
  getMentorById,
  updateMentor,
  deleteMentor,
  createMentee,
  getMentee,
  getMentees,
  updateMentee,
  deleteMentee,
  loginMentor,
  forgotPassword,
  resetPassword,
  profile,
  updateProfile,
} from "../controllers/MentorController";
import { upload } from "../middlewares/upload";

const router = express.Router();

// Mentor routes with file uploads
router.post(
  "/",
  upload.fields([
    { name: "gmcCertificate", maxCount: 1 },
    { name: "specialtyCertificates", maxCount: 5 },
    { name: "cvDocument", maxCount: 1 },
    { name: "indemnityInsurance", maxCount: 1 },
    { name: "image", maxCount: 1 },
    { name: "profilePicture", maxCount: 1 },
  ]),
  createMentor
);

router.get("/", getMentors);
router.get("/:id", getMentorById);

router.put(
  "/:id",
  upload.fields([
    { name: "gmcCertificate", maxCount: 1 },
    { name: "specialtyCertificates", maxCount: 5 },
    { name: "cvDocument", maxCount: 1 },
    { name: "indemnityInsurance", maxCount: 1 },
    { name: "image", maxCount: 1 },
    { name: "profilePicture", maxCount: 1 },
  ]),
  updateMentor
);

// Mentee routes
router.route("/mentees").get(getMentees).post(createMentee);

router
  .route("/mentees/:id")
  .get(getMentee)
  .put(updateMentee)
  .delete(deleteMentee);

// Delete mentor
router.delete("/:id", deleteMentor);

// Auth routes
router.post("/login", loginMentor);
router.post("/forgot-password", forgotPassword);
router.patch("/reset-password", resetPassword);
router.get("/profile", profile);
router.patch("/profile", updateProfile);

export default router;
