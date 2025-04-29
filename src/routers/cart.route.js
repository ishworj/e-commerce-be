import express from "express"
import { createCartController } from "../controllers/cartController.js";
import { authenticate } from "../middlewares/auth.middleware.js";
const router = express.Router()

router.post("/add-to-cart", authenticate, createCartController)

export default router;