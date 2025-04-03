import express from "express"
import { insertCategoryController } from "../controllers/categoriesController.js";

const router = express.Router()

// these are all for the admin level


// creating a category
router.post("/", insertCategoryController)

// updating a category

// deleting a category

export default router;