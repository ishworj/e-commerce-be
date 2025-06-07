import express from "express"
import { createHistory, getUserRecommendation } from "../controllers/history.controller.js"

const router = express.Router()

router.post("/", createHistory)
router.get("/", getUserRecommendation)

export default router