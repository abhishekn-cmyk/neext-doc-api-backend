// import express from "express";
// import {
//   createOrder,
//   getOrders,
//   getOrderById,
//   updateOrderStatus,
//   deleteOrder,getMyOrders
// } from "../controllers/orderController";
// import { protect } from "../middlewares/authMiddleware";
// import { authorize } from "../middlewares/roleMiddleware";

// const router = express.Router();

// router.get("/user", protect, getMyOrders);
// router.get("/", protect, authorize(["SuperAdmin"]), getOrders);
// router.get("/:id", protect, getOrderById);
// router.post("/", protect, createOrder);
// router.patch("/", protect, authorize(["SuperAdmin"]), updateOrderStatus);
// router.delete("/:id", protect, authorize(["SuperAdmin"]), deleteOrder);

// export default router;
import express from "express";
import {
  createOrder,
  getOrders,
  getOrderById,
  updateOrderStatus,
  deleteOrder,
  getMyOrders,
} from "../controllers/orderController";

const router = express.Router();

// Public routes
router.get("/user", getMyOrders);
router.get("/", getOrders);
router.get("/:id", getOrderById);
router.post("/", createOrder);
router.patch("/", updateOrderStatus);
router.delete("/:id", deleteOrder);

export default router;
