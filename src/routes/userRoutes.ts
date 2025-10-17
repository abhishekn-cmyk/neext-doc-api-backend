import express from "express";
import {
  loginUser,
  registerUser,
  forgotPassword,
  resetPassword,
  profile,
  updateProfile,
  deleteUser,
  getUserById,
  getUsers,
  updateUserById,
  createUser,
  getUserStats
} from "../controllers/userController";

const router = express.Router();

// Public routes
router.post("/signup", registerUser);
router.post("/login", loginUser);
router.post("/forgot-password", forgotPassword);
router.patch("/reset-password", resetPassword);

// Users routes (previously protected/admin)
router.get("/", getUsers);
router.post("/", createUser);
router.get("/:id", getUserById);
router.patch("/:id", updateUserById);
router.delete("/:id", deleteUser);
router.get("/users/:id/stats", getUserStats);

// Profile routes (previously protected)
router.get("/profile", profile);
router.patch("/profile", updateProfile);

export default router;
