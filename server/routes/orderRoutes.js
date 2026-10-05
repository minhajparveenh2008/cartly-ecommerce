import express from "express";
import {
  createOrder,
  getMyOrders,
  getOrderById,
  getAllOrders,
  updateOrderStatus,
} from "../controllers/orderController.js";
import { protect } from "../middleware/authMiddleware.js";
import { adminOnly, userOnly } from "../middleware/adminMiddleware.js";

const router = express.Router();

router
  .route("/")
  .post(protect, userOnly, createOrder)
  .get(protect, adminOnly, getAllOrders);

router.get("/my", protect, getMyOrders);
router.get("/:id", protect, getOrderById);
router.put("/:id/status", protect, adminOnly, updateOrderStatus);

export default router;
