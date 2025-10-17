import express from "express";
import {
  getTools,
  getToolById,
  createTool,
  updateTool,
  deleteTool,
  initiateToolPayment,
  checkToolAccess,
  getCategory,
  getCategoriesByTool,
  addCategoryToTool,
  saveProfileForm,
  getCVByUserId,
  getProfileForm,
  downloadCVPDF,
  getCVByUser,
  updateCV,
  getSession,
  completeSession,
  saveAnswer,
  startSession,
  createCV,
  createSponsorship,
  downloadReport,
  getfullSponsorShip,
  getLatestSponsorshipByUserId,
  updateLatestSponsorshipByUserId,
} from "../controllers/toolController";
import { upload } from "../middlewares/upload";
import { matchJobsByUser } from "../controllers/sponsormatchController";

const router = express.Router();

router.get("/full/sdj", getfullSponsorShip);

// ---------------- PUBLIC TOOLS ----------------
router.get("/", getTools);
router.get("/categories", getCategory);
router.get("/:id", getToolById);
router.get("/:id/categories", getCategoriesByTool);

// ---------------- TOOL CRUD (SuperAdmin) ----------------
router.post(
  "/",
  // protect,
  // authorize(["SuperAdmin"]),
  upload.single("image"),
  createTool
);
router.put(
  "/:id",
  // protect,
  // authorize(["SuperAdmin"]),
  upload.single("image"),
  updateTool
);
router.delete("/:id", deleteTool);
router.post(
  "/:id/categories",
  // protect,
  // authorize(["SuperAdmin"]),
  addCategoryToTool
);

// ---------------- CV ROUTES ----------------
router.post("/cv", createCV);
router.get("/cv/:userId/download", downloadCVPDF);
router.get("/cv/users/:id", getCVByUserId);
router.get("/cv/:userId", getCVByUser);
router.put("/cv/:userId/update", updateCV);

// ---------------- SPONSORSHIP ----------------
router.get("/sponsorship/:userId/sponsors", getLatestSponsorshipByUserId);
router.post("/sponsor", createSponsorship);
router.get("/sponsor/job-match", matchJobsByUser);
router.get("/sponsor/:id/download", downloadReport);
router.put("/sponsor/:id/update", updateLatestSponsorshipByUserId);

// ---------------- SESSION ROUTES ----------------
router.post("/session/start", startSession);
router.post("/session/:id/answer", saveAnswer);
router.post("/session/:id/complete", completeSession);
router.get("/session/:id", getSession);

// ---------------- PROFILE / GAPMAP ----------------
router.post("/update-gapmap", saveProfileForm);
router.get("/get-form-gapmap", getProfileForm);

// ---------------- USER PAYMENT / ACCESS ----------------
router.post("/:id/payment", initiateToolPayment);
router.get("/:id/access", checkToolAccess);

export default router;
