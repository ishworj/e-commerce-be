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
        console.log(req.body)
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

            const data = await updateUser(
                {
                    email: user.email
                },
                {
                    refreshJWT: refreshToken
                }
            )

            // removing the sensitive user data
            user.password = ""
            user.refreshJWT = ""

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

export const updateUserController = async (req, res, next) => {
    try {

        const id = req.params.id
        const { formObj } = req.body
        if (!id) {
            return res.status(400).json({ status: "error", message: "User ID is required" });
        }
        const updatedUser = await updateUser(id, formObj);
        updatedUser?._id
            ? res.json({
                status: "success",
                message: "User updated successfully",
            }) : next({
                status: "error",
                message: "User not found",
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
        const userId = req.params.id

        console.log(userId, 444)
        if (!userId) {
            return res.status(400).json({ status: "error", message: "User ID is required" });
        }

        const deleteUser = await deleteUserById(userId)

        deleteUser?._id ? res.json({
            status: "success",
            message: "User deleted successfully",
        }) : next({
            status: "error",
            message: "User not found",
        })



    } catch (error) {
        console.log(error)
        next({
            status: "error",
            message: "Internal server error",
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