import express from "express"
import { createCartController, deleteCartItemController, fetchCart, updateCartItems } from "../controllers/cartController.js";
import { authenticate } from "../middlewares/auth.middleware.js";
const router = express.Router()

router.post("/add-to-cart", authenticate, createCartController)
router.delete("/remove-item", authenticate, deleteCartItemController)
router.get("/", authenticate, fetchCart)
router.put("/", authenticate, updateCartItems)

export default router;