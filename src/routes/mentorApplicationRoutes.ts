import express from "express";
import {
  createMentorApplication,
  getMentorApplication,
  approveMentor,
  updateTerms,
  rejectMentor,
} from "../controllers/mentorApplicationController";
import { protect } from "../middlewares/authMiddleware";
import { authorize } from "../middlewares/roleMiddleware";
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

router.post("/", upload.any(), createMentorApplication);
router.get("/", protect, authorize(["SuperAdmin"]), getMentorApplication);
router.put("/terms/:id", protect, authorize(["SuperAdmin"]), updateTerms);
router.put("/approve/:id", protect, authorize(["SuperAdmin"]), approveMentor);
router.put("/reject/:id", protect, authorize(["SuperAdmin"]), rejectMentor);

export default router;
