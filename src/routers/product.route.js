import express from "express";
import {
    createProduct,
    deleteProduct,
    getAllProducts,
    getProductById,
    getPublicProducts,
    updateProduct,
} from "../controllers/product.controller.js";
import { createProductValidator } from "../middlewares/joi.validation.js";
import { authenticate, isAdmin } from "../middlewares/auth.middleware.js";
import upload from '../config/multer.config.js'

const router = express.Router();
// creating the product // uploading array of images max 4 // under name form field images 
router.post("/", upload.array("images",4),createProductValidator, authenticate, isAdmin, createProduct);
// getting all the products --- for admin including inactive products
router.get("/", authenticate, isAdmin, getAllProducts);
// getting all active products for the customer
router.get("/active", getPublicProducts);

router.get("/:id", getProductById)
// updating the product detail
router.put("/:id", authenticate, isAdmin, updateProduct);
// deleting the product
router.delete("/:id", authenticate, isAdmin, deleteProduct);

export default router;
