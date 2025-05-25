import express from "express";
import {
  makePayment,
  verifyPaymentSession,
} from "../controllers/payment.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/checkout", authenticate, makePayment);

router.get("/verify-session", verifyPaymentSession);

export default router;