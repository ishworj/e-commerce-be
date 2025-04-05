import express from "express";
import {
  createOrder,
  getAllOrders,
  getOrder,
  updateOrder,
} from "../controllers/orderControllers.js";
import { authenticate, isAdmin } from "../middlewares/authMiddleware.js";
import {
  createOrderValidator,
  updateOrderValidator,
} from "../middlewares/joiValidation.js";

const router = express.Router();

router.post("/", authenticate, createOrderValidator, createOrder);

router.get("/", authenticate, getOrder);

router.get("/admin", authenticate, isAdmin, getAllOrders);

router.put(
  "/:id/status",
  authenticate,
  isAdmin,
  updateOrderValidator,
  updateOrder
);

export default router;
