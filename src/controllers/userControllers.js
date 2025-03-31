import { registerUserModel } from "../models/users/UserModel.js";
import { encryptPassword } from "../utils/bcrypt.js";

export const registerUserController = async (req, res, next) => {
    try {
        const { fName, lName, email } = req.body;
        let { password } = req.body
        let { confirmPassword } = req.body
        password = await encryptPassword(password)
        confirmPassword = await encryptPassword(confirmPassword)

        const formObj = {
            fName,
            lName,
            email,
            password,
            confirmPassword
        }
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