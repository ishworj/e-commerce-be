
import { findToken } from "../models/sessions/SessionModel";
import { getUserByEmail } from "../models/users/UserModel";
import { jwtVerify } from "../utils/jwt";

export const authenticate = async (req, res, next) => {
    try {
        // 1. get the token 
        const token = req.headers.authorization;

        // 2. get the token from the database
        const tokenFromDb = await findToken(token);

        // 3.verify the token
        const decodedData = await jwtVerify(token, tokenFromDb);

        // 4. decode the data if token gets verified
        // this email comes from the userController while logging as we have used user's email to form a token 
        if (decodedData?.email) {
            // 5. now with the help of the email, lets find the user
            const userData = await getUserByEmail({ email })

            if (userData) {

                // 6. provide the userData to the req.body
                req.user = userData;
                // 7. go to next function in case of successfull getting of the data 
                next()
            } else {
                return res.status(200).json({
                    status: "error",
                    message: "Authentication Failed!"
                })
            }
        }
        else {
            const errObj = {
                statusCode: 401,
                message: "Invalid Token!!!"
            }
            next(errObj)
        }
    } catch (error) {
        const errObj = {
            statusCode: 500,
            message: error.message || "Error Validating token from the server side!"
        }
        next(errObj)
    }
}

export const isAdmin = async (req, res, next) => {
    req.userData.role === "admin" ?
        next() :
        next({
            statusCode: 401,
            message: "Not Authorized!"
        })
}