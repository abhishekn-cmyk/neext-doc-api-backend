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

const router = express.Router();

// CRUD for Programs
router.post(
  "/",
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "gallery", maxCount: 5 },
  ]),
  createProgram
);

router.get("/", getPrograms);
router.get("/:id", getProgramById);

router.put(
  "/:id",
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "gallery", maxCount: 5 },
  ]),
  updateProgram
);

router.delete("/:id", deleteProgram);

// Payments & Bookings (previously user-only)
router.post("/:id/payment", makePayment);
router.post("/:id/book", bookSession);

export default router;
