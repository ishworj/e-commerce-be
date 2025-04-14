import express from "express";
import { sendOTP, verifyAndUpdatePw, verifyEmail, verifyUser } from "../controllers/verifications.js";

const router = express.Router();

router.post("/", verifyAndUpdatePw);
router.post("/verifyEmail", verifyEmail, sendOTP)
// router.get("/verify-otp", verifyOTP)
router.get("/", verifyUser)


export default router;
