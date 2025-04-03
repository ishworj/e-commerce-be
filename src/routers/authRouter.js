import express from "express";
import { deleteUserController, registerUserController, signInUserController, updateUserController } from "../controllers/userControllers.js";
import { authenticate, isAdmin } from "../middlewares/authMiddleware.js";

const router = express.Router()

// routers
router.post("/register", registerUserController)
router.post("/signin", signInUserController)



// // get user detail
// router.get("/", getUserDetail);


//update user
router.put("/", authenticate, updateUserController)

//delete user
router.delete("/:_id", authenticate, isAdmin, deleteUserController)

export default router