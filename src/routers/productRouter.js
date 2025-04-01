import express from "express";
import { createProduct, getAllProducts } from "../controllers/productControllers.js";
const router = express.Router();
router.post("/", createProduct);
router.get("/",getAllProducts);
router.put("/:id");
router.delete("/:id");

export default router;