import express from "express";
import {
  createOrder,
  getAllOrders,
  getOrder,
  updateOrder,
} from "../controllers/orderControllers.js";
import { authenticate, isAdmin } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/", authenticate, createOrder);

router.get("/", authenticate, getOrder);

router.get("/admin", authenticate, isAdmin, getAllOrders);

router.put("/:id/status", authenticate, isAdmin, updateOrder);

export default router;
