import express from "express";
import {
    createOrder,
    getAllOrders,
    getOrder,
    updateOrder,
} from "../controllers/order.controller.js";
import { authenticate, isAdmin } from "../middlewares/auth.middleware.js";
import {
    createOrderValidator,
    updateOrderValidator,
} from "../middlewares/joi.validation.js";

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
