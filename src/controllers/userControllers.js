import { startSession } from "mongoose";
import { insertSession } from "../models/sessions/SessionModel.js";
import { deleteUserById, getUserByEmail, registerUserModel, updateUser } from "../models/users/UserModel.js";
import { userActivatedEmail } from "../services/emailServices.js";
import { comparePassword, encryptPassword } from "../utils/bcrypt.js";
import { jwtRefreshSign, jwtSign } from "../utils/jwt.js";
import { v4 as uuidv4 } from "uuid";

// registering the new user 
export const registerUserController = async (req, res, next) => {
    try {
        const { fName, lName, email, phone } = req.body;
        let { password } = req.body
        password = await encryptPassword(password)

        const formObj = {
            fName,
            lName,
            email,
            phone,
            password
        }
        const user = await registerUserModel(formObj);

        console.log(user, 333)
        if (!user?._id) {
            return res.status(401).json({
                status: "error",
                message: "User Registration Failed!!!"
            })
        }

        const session = await insertSession({
            token: uuidv4(),
            association: user.email
        })
        if (!session._id) {
            return res.status(400).json({
                status: "error",
                message: "Email sending failed! Registration aborted!"
            });
        }
        const url = `${process.env.ROOT_URL}/verify-user?sessionId=${session._id}&t=${session.token}`;

        const activationEmail = await userActivatedEmail({
            email: user.email,
            userName: user.fName,
            url
        })

        return res.status(200).json({
            status: "success",
            message: "Your account has been created successfully. Please check your email to activate your account!",
            user
        });


    } catch (error) {
        console.log(error)
        next({
            statusCode: 500,
            message: "Error in regestiration",
            errorMessage: error?.message
        })
    }
}

// logging the user 
export const signInUserController = async (req, res, next) => {
    try {
        // taking the payload from the req.body 
        const { email, password } = req.body
        // finding the user 
        const user = await getUserByEmail({ email })
        if (!user) {
            return res.status(404).json({
                status: "error",
                message: "Couldnot find the user!",
            })
        } else {
            // comparing the password or say checking if the user's password matches with the password stored in database 
            const isLogged = await comparePassword(password, (user.password));
            console.log(isLogged, 433)
            // token data for creating accessToken and refreshToken
            const tokenData = {
                email: user.email
            }

            const token = await jwtSign(tokenData)
            const refreshToken = await jwtRefreshSign(tokenData)

            const data = await updateUser(
                {
                    _id: user._id
                },
                {
                    refreshJWT: refreshToken
                }
            )

            // removing the sensitive user data
            user.password = ""
            user.refreshJWT = ""

            if (isLogged) {

                req.userData = user;
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
        next({
            statusCode: 500,
            message: "Internal error!",
            statusMessage: error.message
        })
    }
}

// TODO //edit the user

export const updateUserController = async (req, res, next) => {
    try {

        // const { _id } = req.params
        const { _id, ...formObj } = req.body
        if (!_id) {
            return res.status(400).json({
                status: "error",
                message: "User not found"
            }
            );
        }
        const updatedUser = await updateUser(_id, formObj);
        updatedUser?._id
            ? res.json({
                status: "success",
                message: "User updated successfully",
                updatedUser
            }) : next({
                status: "error",
                message: "Couldnot Update the user",
            })


    } catch (error) {
        console.log(error)
        next({
            status: "error",
            message: "Internal server error",
        })
    }
}




// TODO// delete the user
export const deleteUserController = async (req, res, next) => {
    try {
        const { _id } = req.params

        if (!_id) {
            return res.status(400).json({ status: "error", message: "User ID is required" });
        }

        const deletedUser = await deleteUserById(_id)

        deletedUser?._id ? res.json({
            status: "success",
            message: "User deleted successfully",
            deletedUser
        }) : next({
            status: "error",
            message: "User not found",
        })
    } catch (error) {
        console.log(error)
        next({
            statusCode: 500,
            message: "Internal server error",
            errorMessage: error?.message
        })
    }
}


// //get user detail
// export const getUserDetailController = async (req, res, next) => {
//     //removing sensitive data
//     req.userData.password= ""
//     req.userData.refreshJWT=""

//     return res.json({
//         status: "success",
//         message: "User details",
//         data: req.userData
//     })
// }