import express from "express";
import { createProduct, deleteProduct, getAllProducts, updateProduct } from "../controllers/productControllers.js";
import { createProductValidator } from "../middlewares/joiValidation.js";


const router = express.Router();
router.post("/", createProductValidator, createProduct);
router.get("/", getAllProducts);
router.put("/:id", updateProduct);
router.delete("/:id", deleteProduct);

export default router;