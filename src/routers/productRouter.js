import express from "express";
import { createProduct, deleteProduct, getAllProducts, updateProduct } from "../controllers/productControllers.js";
import { createProductValidator } from "../middlewares/joiValidation.js";
import { authenticate, isAdmin } from "../middlewares/authMiddleware.js";


const router = express.Router();

// creating the product
router.post("/", createProductValidator, authenticate, isAdmin, createProduct);
// getting all the products ---- it is public no need of authentication 
router.get("/", getAllProducts);
// updating the product detail
router.put("/:id", authenticate, isAdmin, updateProduct);
// deleting the product
router.delete("/:id", authenticate, isAdmin, deleteProduct);

export default router;