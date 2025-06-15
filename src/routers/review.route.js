import express from "express";
import { authenticate, isAdmin } from "../middlewares/auth.middleware.js";
import {
    createReview,
    deleteReviewController,
    getAllReviewsController,
    getPubReviews,
    updateReviewController,
} from "../controllers/reviews.controller.js";
import { createReviewValidator } from "../middlewares/joi.validation.js";

const router = express.Router();

router.get("/", getPubReviews);
router.get("/admin", authenticate, isAdmin, getAllReviewsController);
router.post("/", createReviewValidator, authenticate, createReview);
router.put("/", authenticate, updateReviewController);
router.delete("/", authenticate, deleteReviewController);

export default router;
