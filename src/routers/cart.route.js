import express from "express"
import { createCartController, deleteCartItemController, fetchCart } from "../controllers/cartController.js";
import { authenticate } from "../middlewares/auth.middleware.js";
const router = express.Router()

router.post("/add-to-cart", authenticate, createCartController)
router.delete("/remove-item", authenticate, deleteCartItemController)
router.get("/", authenticate, fetchCart)

export default router;