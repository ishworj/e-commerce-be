import express from "express"
import { createRecentActivityController, getAllRecentActivityController, getUserRecentActivityController } from "../controllers/recentActivityController.js"
import { authenticate, isAdmin } from "../middlewares/auth.middleware.js"

const router = express.Router()

router.post("/", createRecentActivityController)

router.get("/", authenticate, isAdmin, getAllRecentActivityController)

router.post("/user", authenticate, getUserRecentActivityController)


export default router;