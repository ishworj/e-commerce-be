import express from "express";
import {
    deleteCategoryController,
    insertCategoryController,
    updateCategoryController,
} from "../controllers/catrgories.controller.js";
import { authenticate, isAdmin } from "../middlewares/auth.middleware.js";

const router = express.Router();

// these are all for the admin level

// creating a category
router.post("/", authenticate, isAdmin, insertCategoryController);

// updating a category
router.put("/:_id", authenticate, isAdmin, updateCategoryController);

// deleting a category
router.delete("/delete/:_id", authenticate, isAdmin, deleteCategoryController);

export default router;
