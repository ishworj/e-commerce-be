import express from "express";
import {
    // createOrder,
    deleteOrder,
    deleteOrderItem,
    getAllOrders,
    getAllOrdersTimeFrame,
    getOrder,
    updateOrder,
} from "../controllers/order.controller.js";
import { authenticate, isAdmin } from "../middlewares/auth.middleware.js";
import {
    updateOrderValidator,
} from "../middlewares/joi.validation.js";

const router = express.Router();

// with pagination 
router.get("/", authenticate, getOrder);
// with pagination 
router.get("/admin", authenticate, isAdmin, getAllOrders);

router.get("/timeFrame", authenticate, isAdmin, getAllOrdersTimeFrame)

router.put("/", authenticate, isAdmin, updateOrderValidator, updateOrder);

router.delete("/:id/delete", authenticate, deleteOrder)

router.delete("/:id/delete/:ID", authenticate, isAdmin, deleteOrderItem)

export default router;
