import express from "express";
import {
  createProduct,
  updateProduct,
  deleteProduct,
  getProducts,
  getProductById,
} from "../controllers/productController";

const router = express.Router();

// 🟢 Public (Users & Admin)
router.get("/", getProducts);
router.get("/:id", getProductById);

// 🔴 Admin routes now public
router.post("/", createProduct);
router.put("/:id", updateProduct);
router.delete("/:id", deleteProduct);

export default router;

