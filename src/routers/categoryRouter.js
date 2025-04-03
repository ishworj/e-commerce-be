import express from "express"
import { deleteCategoryController, insertCategoryController } from "../controllers/categoriesController.js";

const router = express.Router()

// these are all for the admin level


// creating a category
router.post("/", insertCategoryController)

// updating a category

// deleting a category
router.delete("/delete/:_id", deleteCategoryController)

export default router;