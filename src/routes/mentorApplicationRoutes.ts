import express from "express";
import {
  createMentorApplication,
  getMentorApplication,
  approveMentor,
  updateTerms,
  rejectMentor,
} from "../controllers/mentorApplicationController";
import multer from "multer";

const router = express.Router();
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // folder must exist
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

export const upload = multer({ storage });

// All routes public now
router.post("/", upload.any(), createMentorApplication);
router.get("/", getMentorApplication);
router.put("/terms/:id", updateTerms);
router.put("/approve/:id", approveMentor);
router.put("/reject/:id", rejectMentor);

export default router;
