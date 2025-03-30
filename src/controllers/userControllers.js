import { registerUserModel } from "../models/users/UserModel.js";

export const registerUserController = async (req, res, next) => {
    try {
        const formObj = req.body;
        const data = await registerUserModel(formObj);
        console.log(data, 333)
        if (data) {
            return res.status(200).json({
                status: "success",
                message: "Registered Successfully!",
                data
            })
        }
    } catch (error) {
        console.log(error)
    }
}