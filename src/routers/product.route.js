import express from "express";
import {
    createProduct,
    deleteProduct,
    getAllProducts,
    getPublicProducts,
    updateProduct,
} from "../controllers/product.controller.js";
import { createProductValidator } from "../middlewares/joi.validation.js";
import { authenticate, isAdmin } from "../middlewares/auth.middleware.js";

const router = express.Router();

// creating the product
router.post("/", createProductValidator, authenticate, isAdmin, createProduct);
// getting all the products --- for admin including inactive products
router.get("/", authenticate, isAdmin, getAllProducts);
// getting all active products for the customer
router.get("/active", getPublicProducts);
// updating the product detail
router.put("/:id", authenticate, isAdmin, updateProduct);
// deleting the product
router.delete("/:id", authenticate, isAdmin, deleteProduct);

export default router;
