import express from 'express'
import { createFeatureBannerController, deleteFeatureBannerController, fetchFeatureBannerController } from '../controllers/featureBanner.controller.js'
import { authenticate, isAdmin } from '../middlewares/auth.middleware.js'

const router = express.Router()

router.get("/", fetchFeatureBannerController)
router.post("/", authenticate, isAdmin, createFeatureBannerController)
router.delete("/:id", authenticate, isAdmin, deleteFeatureBannerController)

export default router