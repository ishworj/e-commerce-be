
import express from "express"
import { createWishListController } from "../controllers/wishList.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";

const router = express.Router()
router.post("/", authenticate, createWishListController)

export default router;