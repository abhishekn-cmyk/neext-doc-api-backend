import { Request, Response } from "express";
import { Product } from "../models/Product";

// ✅ Admin: Create
export const createProduct = async (
  req: Request,
  res: Response
): Promise<void> => {
  const product = await Product.create(req.body);

  res.status(201).json({ success: true, data: product });
};

// ✅ Admin: Update
export const updateProduct = async (
  req: Request,
  res: Response
): Promise<void> => {
  const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });

  if (!product) {
    res.status(404).json({ success: false, message: "Product not found" });
    return;
  }
  res.json({ success: true, data: product });
};

// ✅ Admin: Delete
export const deleteProduct = async (
  req: Request,
  res: Response
): Promise<void> => {
  const product = await Product.findByIdAndDelete(req.params.id);

  if (!product) {
    res.status(404).json({ success: false, message: "Product not found" });
    return;
  }
  res.json({ success: true, message: "Product deleted successfully" });
};

// ✅ User/Admin: Get all
export const getProducts = async (
  req: Request,
  res: Response
): Promise<void> => {
  const products = await Product.find({ isActive: true }).sort({
    createdAt: -1,
  });

  res.json({ success: true, data: products });
};

// ✅ User/Admin: Get single
export const getProductById = async (
  req: Request,
  res: Response
): Promise<void> => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    res.status(404).json({ success: false, message: "Product not found" });
    return;
  }
  res.json({ success: true, data: product });
};
