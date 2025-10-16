import express from "express";
import {
  createProduct,
  updateProduct,
  deleteProduct,
  getProducts,
  getProductById,
} from "../controllers/productController";
import { protect } from "../middlewares/authMiddleware";
import { authorize } from "../middlewares/roleMiddleware";

const router = express.Router();

// 🟢 Public (Users & Admin)
router.get("/", getProducts);
router.get("/:id", getProductById);

// 🔴 Admin only
router.post("/", protect, authorize(["SuperAdmin"]), createProduct);
router.put("/:id", protect, authorize(["SuperAdmin"]), updateProduct);
router.delete("/:id", protect, authorize(["SuperAdmin"]), deleteProduct);

export default router;
