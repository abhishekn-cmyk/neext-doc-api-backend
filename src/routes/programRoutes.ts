import express from "express";
import { upload } from "../middlewares/upload";
import {
  createProgram,
  getPrograms,
  getProgramById,
  updateProgram,
  deleteProgram,
  makePayment,
  bookSession,
} from "../controllers/ProgramController";
import { authorize } from "../middlewares/roleMiddleware";
import { protect } from "../middlewares/authMiddleware";

const router = express.Router();

// CRUD for Programs
router.post(
  "/",
  protect,
  authorize(["SuperAdmin"]),
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "gallery", maxCount: 5 },
  ]),
  createProgram
);

router.get("/", getPrograms);
router.get("/:id", protect, authorize(["User", "SuperAdmin"]), getProgramById);

router.put(
  "/:id",
  protect,
  authorize(["SuperAdmin"]),
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "gallery", maxCount: 5 },
  ]),
  updateProgram
);

router.delete("/:id", protect, authorize(["SuperAdmin"]), deleteProgram);

// Payments & Bookings (User only)
router.post("/:id/payment", protect, makePayment);
router.post("/:id/book", protect, bookSession);

export default router;
