import { findToken } from "../models/sessions/SessionModel";
import { getUserByEmail } from "../models/users/UserModel";
import { jwtVerify } from "../utils/jwt";

export const authenticate = async (req, res, next) => {

    try {
        // 1.get the token from the headers 
        const token = req.headers.authorization;

        // 2.get the token from the database
        const tokenFroomDb = await findToken(token)

        // 3.verify the token
        const decodedData = await jwtVerify(token, tokenFroomDb)

        // 4.decode the data in case of verified
        // this email is inside the decoded data because user email was used while creating the token during the sign in
        if (decodedData?.email) {
            const userData = await getUserByEmail({ email });
            if (userData) {
                next()
            } else {
                return res.status(400).json({
                    status: "error",
                    message: "Not Authorized!!!"
                })

            }
        } else {
            next({
                statusCode: 401,
                message: "Invalid Token"
            })
        }
    } catch (error) {
        next({
            statusCode: 401,
            message: error?.message || "Internal Error"
        })
    }
}
export const isAdmin = () => {
    if (req.userData.role === "admin") {
        next()
    } else {
        next({
            statusCode: 500,
            message: "Not authorized!!!"
        })
    }
}