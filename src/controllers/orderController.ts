import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import { Order } from "../models/Order";

export const createOrder = asyncHandler(async (req: Request, res: Response) => {
  const { itemType, itemId, name, description, price } = req.body;

  const order = await Order.create({
    itemType,
    itemId,
    name,
    description,
    price,
  });

  res.status(201).json({
    success: true,
    message: "Order fetched successfully",
    data: order,
  });
});

export const getOrders = asyncHandler(async (req: Request, res: Response) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const [orders, total] = await Promise.all([
    Order.find().skip(skip).limit(limit).sort({ createdAt: -1 }),
    Order.countDocuments(),
  ]);

  res.status(200).json({
    success: true,
    message: "Orders fetched successfully",
    data: orders,
    page,
    pages: Math.ceil(total / limit),
    total,
  });
});

export const getOrderById = asyncHandler(
  async (req: Request, res: Response) => {
    const order = await Order.findById(req.params.id)
      .populate("user", "name email")
      .lean();

    if (!order) {
      res.status(404).json({ success: false, message: "Order not found" });
      return;
    }

    res
      .status(200)
      .json({ success: true, message: "Order fetched successfully" });
  }
);

export const updateOrderStatus = asyncHandler(
  async (req: Request, res: Response) => {
    const { status } = req.body;

    const order = await Order.findById(req.params.id);

    if (!order) {
      res.status(404).json({ success: false, message: "Order not found" });
      return;
    }

    order.status = status || order.status;
    await order.save();

    res
      .status(200)
      .json({ success: true, message: "Order updated successfully" });
  }
);

export const deleteOrder = asyncHandler(async (req: Request, res: Response) => {
  const order = await Order.findByIdAndDelete(req.params.id);

  if (!order) {
    res.status(404).json({ success: false, message: "Order not found" });
    return;
  }

  res
    .status(200)
    .json({ success: true, message: "Order deleted successfully" });
});

export const getMyOrders = asyncHandler(async (req: any, res: Response) => {
  const { _id } = req.user;
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const [orders, total] = await Promise.all([
    Order.find({ user: _id })
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 })
      .lean(),
    Order.countDocuments(),
  ]);

  res.status(200).json({
    success: true,
    message: "Order fetched successfully",
    data: orders,
    page,
    pages: Math.ceil(total / limit),
    total,
  });
});
