import express from "express";
import {
    deleteUserController,
    getUserDetailController,
    registerUserController,
    renewJwt,
    signInUserController,
    updateUserController,
} from "../controllers/user.controller.js";
import { authenticate, isAdmin } from "../middlewares/auth.middleware.js";
import {
    createUserValidator,
    singinUserValidator,
} from "../middlewares/joi.validation.js";
import { refreshJWTVerify } from "../utils/jwt.js";

const router = express.Router();

// routers

// registering the user
router.post("/register", createUserValidator, registerUserController);

// signing the user
router.post("/signin", singinUserValidator, signInUserController);

// get user detail
router.get("/", authenticate, getUserDetailController);

//update user
router.put("/", authenticate, updateUserController);

//delete user
router.delete("/:_id", authenticate, isAdmin, deleteUserController);

// renew-jwt
router.get("/renew-jwt", refreshJWTVerify, renewJwt)

export default router;
