import { findToken } from "../models/sessions/session.model.js";
import { getUserByEmail } from "../models/users/user.model.js";
import { jwtVerify, refreshJWTVerify } from "../utils/jwt.js";

export const authenticate = async (req, res, next) => {
    try {
        // 1.get the token from the headers
        const token = req.headers.authorization;
        if (!token) {
            return res.status(401).json({
                status: "error",
                message: "Token is required",
            });
        }
        // 2.get the token from the database
        const tokenFromDb = await findToken({ token: token });
        if (!tokenFromDb) {
            return res.status(401).json({
                status: "error",
                message: "Authentication Failes",
                errorMessage: "Token not found in the database"
            });
        }

        // 3.verify the token
        const decodedData = await jwtVerify(token, tokenFromDb);

        // 4.decode the data in case of verified
        // this email is inside the decoded data because user email was used while creating the token during the sign in
        if (decodedData?.email) {
            const userData = await getUserByEmail({ email: decodedData.email });
            if (userData) {
                req.userData = userData;
                next();
            } else {
                return res.status(400).json({
                    status: "error",
                    message: "Not Authorized!!!",
                });
            }
        } else {
            next({
                statusCode: 401,
                message: "Invalid Token",
            });
        }
    } catch (error) {
        next({
            statusCode: 500,
            message: error?.message || "Internal Error",
            errorMessage: error?.message,
        });
    }
};
export const refreshAuthenticate = async (req, res, next) => {
    try {
        // take the token from the header as authorization
        const token = req.headers.authorization;
        console.log("authenticate")
        // verify the refreshtoken
        const decodedData = await refreshJWTVerify(
            token,
            process.env.JWT_REFRESH_SECRET
        );
        // checking if the token gets verified and if there is token
        if (decodedData?.email) {
            // find the user
            const userData = await getUserByEmail({ email: decodedData.email });
            console.log(userData),
                console.log(token)
            console.log(userData.refreshJWT === token)
            if (!userData || userData.refreshJWT !== token) {
                return next({
                    statusCode: 401,
                    message: "Not Authenticated !!!",
                });
            }
            req.user = userData;
            next();
        } else {
            return next({
                statusCode: 401,
                message: "Invalid Token!!!",
            });
        }
    } catch (error) {
        next({
            statusCode: 500,
            message:
                error?.message || "Internal Error in verifying the token!!!",
        });
    }
};
export const isAdmin = (req, res, next) => {
    if (req.userData?.role === "admin") {
        return next();
    } else {
        return next({
            statusCode: 500,
            message: "Not authorized!!!",
            errorMessage: "User is not an admin!",
        });
    }
};
