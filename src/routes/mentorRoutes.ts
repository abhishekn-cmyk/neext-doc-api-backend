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
import { authorize } from "../middlewares/roleMiddleware";
import { protect } from "../middlewares/authMiddleware";

const router = express.Router();

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



router.route("/mentees").get(getMentees).post(createMentee);

router
  .route("/mentees/:id")
  .get(protect, authorize(["SuperAdmin"]), getMentee)
  .put(protect, authorize(["SuperAdmin"]), updateMentee)
  .delete(protect, authorize(["SuperAdmin"]), deleteMentee);

router.delete("/:id", protect, authorize(["SuperAdmin"]), deleteMentor);

router.post("/login", loginMentor);
router.post("/forgot-password", forgotPassword);
router.patch("/reset-password", resetPassword);
router.get("/profile", protect, profile);
router.patch("/profile", protect, updateProfile);

export default router;
