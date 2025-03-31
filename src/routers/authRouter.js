import express from "express";
import { registerUserController, signInUserController } from "../controllers/userControllers.js";

const router = express.Router()

// routers
router.post("/register", registerUserController)
router.post("/signin", signInUserController)

export default router