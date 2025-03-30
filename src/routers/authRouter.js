import express from "express";
import { registerUserController } from "../controllers/userControllers.js";

const router = express.Router()

// routers
router.post("/register", registerUserController)

export default router