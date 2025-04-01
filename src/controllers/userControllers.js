import { getUserByEmail, registerUserModel } from "../models/users/UserModel.js";
import { comparePassword, encryptPassword } from "../utils/bcrypt.js";
import { jwtRefreshSign, jwtSign } from "../utils/jwt.js";

// registering the new user 
export const registerUserController = async (req, res, next) => {
    try {
        const { fName, lName, email , phone} = req.body;
        let { password } = req.body
        password = await encryptPassword(password)

        const formObj = {
            fName,
            lName,
            email,
            password,
            phone
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

// logging the user 
export const signInUserController = async (req, res, next) => {
    try {
        // taking the payload from the req.body 
        const { email, password } = req.body
        // finding the user 
        const user = await getUserByEmail({ email })
        if (user) {
            // comparing the password or say checking if the user's password matches with the password stored in database 

            console.log(user.password)
            const isLogged = await comparePassword(password, (user.password));
            console.log(isLogged, 433)
            // token data for creating accessToken and refreshToken
            const tokenData = {
                email: user.email
            }

            const token = await jwtSign(tokenData)
            const refreshToken = await jwtRefreshSign(tokenData)

            const data = {
                email: user.email,
                refreshJWT: refreshToken
            }

            if (isLogged) {
                return res.status(200).json({
                    status: "success",
                    message: "Logged in Successfully!!!",
                    accessToken: token,
                    refreshToken: refreshToken,
                    data: {
                        _id: user._id,
                        email: user.email,
                        userName: user.userName
                    }
                })
            } else {
                return res.status(400).json({
                    status: "error",
                    message: "Ceredentials not matched!!!"
                })
            }
        }

    } catch (error) {
        console.log(error)
    }
}

// TODO //edit the user

// TODO// delete the user