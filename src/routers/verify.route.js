import express from "express";
import { verifyAndUpdatePw, verifyEmail } from "../controllers/verify.controller.js";

const router = express.Router();

router.get("/", verifyAndUpdatePw);
router.get("/verify", verifyEmail)

export default router;
