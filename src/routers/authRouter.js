import express from "express";
import { deleteUserController, registerUserController, signInUserController, updateUserController } from "../controllers/userControllers.js";

const router = express.Router()

// routers
router.post("/register", registerUserController)
router.post("/signin", signInUserController)



// // get user detail
// router.get("/", getUserDetail);



//update user
router.put("/:id", updateUserController)

//delete user
router.delete("/:id", deleteUserController)

export default router