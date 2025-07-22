import express from "express"
import { createRecentActivityController, getAllRecentActivityController, getUserRecentActivityController } from "../controllers/recentActivityController.js"
import { authenticate, isAdmin } from "../middlewares/auth.middleware.js"

const router = express.Router()

router.post("/", authenticate, createRecentActivityController)

router.get("/", authenticate, isAdmin, getAllRecentActivityController)

router.get("/user", authenticate, getUserRecentActivityController)


export default router;