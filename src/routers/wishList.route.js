
import express from "express"
import { createWishListController, fetchWishList } from "../controllers/wishList.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";

const router = express.Router()
router.post("/", authenticate, createWishListController)
router.get("/", authenticate, fetchWishList)

export default router;