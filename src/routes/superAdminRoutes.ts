import { protect } from "../middlewares/authMiddleware";
import {
  loginSuperAdmin,
  registerSuperAdmin,
  forgotPassword,
  resetPassword,
  profile,
  updateProfile,
  deleteSuperAdmin,
  getSuperAdminById,getSuperAdmin,
  updateSuperAdminById
} from "../controllers/superAdminController";
import express from "express";

const router = express.Router();

router.get("/", protect,getSuperAdmin);
router.post("/signup", registerSuperAdmin);
router.post("/login", loginSuperAdmin);
router.post("/forgot-password", forgotPassword);
router.patch("/reset-password", resetPassword);
router.get("/profile", protect, profile);
router.patch("/profile", protect, updateProfile);
router.get("/:id", protect, getSuperAdminById);
router.patch("/:id", protect, updateSuperAdminById);
router.delete("/:id", protect, deleteSuperAdmin);

export default router;
