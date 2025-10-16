import { protect } from "../middlewares/authMiddleware";
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
  updateUserById,createUser,
  getUserStats
} from "../controllers/userController";
import express from "express";
import { authorize } from "../middlewares/roleMiddleware";

const router = express.Router();

router.get("/", protect, authorize(["SuperAdmin"]), getUsers);
router.post("/", protect, authorize(["SuperAdmin"]), createUser);
router.post("/signup", registerUser);
router.post("/login", loginUser);
router.post("/forgot-password", forgotPassword);
router.patch("/reset-password", resetPassword);
router.get("/profile", protect, profile);
router.patch("/profile", protect, updateProfile);
router.get("/:id", protect, authorize(["SuperAdmin"]), getUserById);
router.patch("/:id", protect, authorize(["SuperAdmin"]), updateUserById);
router.delete("/:id", protect, authorize(["SuperAdmin"]), deleteUser);
router.get("/users/:id/stats",protect,authorize(["SuperAdmin"]),getUserStats);
export default router;
