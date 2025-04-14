import {
    findAuthSessionById,
    findAuthSessionByIdandDelete,
    findOTP,
    findOTPAndDelete,
    insertOTP,
} from "../models/sessions/auth.session.model.js";
import { getUserByEmail, updateUser } from "../models/users/user.model.js";
import { OTPemail } from "../services/email.service.js";

export const verifyAndUpdatePw = async (req, res, next) => {
    try {
        const sessionId = req.query.sessionId;
        const token = req.query.t;

        if (!sessionId || !token) {
            return next({
                statusCode: 404,
                message: "Invalid verification Link !!!",
                errorMessage: "No Session Id or No token",
            });
        }

        const session = await findAuthSessionById(sessionId);

        if (!session || session.token !== token) {
            return next({
                statusCode: 404,
                message: "Invalid or expired session !!!",
                errorMessage: "Invalid or expired session !!!",
            });
        }

        const now = new Date()
        if (new Date(session.expiresAt) < now) {
            return next({
                statusCode: 403,
                message: "Session has expired",
                errorMessage: "The verification link has expired.",
            });
        }

        // marking the user as verified
        const userEmail = session.associate;
        // find the user
        const verifiedUser = await getUserByEmail(userEmail);
        const updatedStatus = await updateUser(verifiedUser._id, {
            verified: true,
        });
        if (!updatedStatus._id) {
            return next({
                statusCode: 404,
                message: "Verification Process failed!!!",
                errorMessage: "Could not complete the verification!",
            });
        }

        // after verification deleting the session
        await findAuthSessionByIdandDelete(sessionId);

        return res.status(200).json({
            status: "success",
            message: "Your account has been verified!",
        });
    } catch (error) {
        next({
            statusCode: 500,
            message: "Verification failed",
            errorMessage: error.message,
        });
    }
};

export const verifyEmail = async (req, res, next) => {
    try {
        const user = await getUserByEmail(req.body)
        req.userData = req.body
        if (!user) {
            return res.status(400).json({
                status: "error",
                message: "User is not Found!"
            })
        }

        next()
    } catch (error) {
        next({
            statusCode: 500,
            message: "User not Found!",
            errorMessage: error.message,
        });
    }
}

export const sendOTP = async (req, res, next) => {
    try {
        const generateRandomNumber = () => {
            const string = "1234567890"
            const len = 6;
            let Otp = ""
            for (let i = 1; i <= len; i++) {
                const randomIndex = Math.floor(Math.random() * string.length)
                Otp += string[randomIndex]
            }
            return Otp;
        }

        const OTP = generateRandomNumber();
        const email = req.userData.email;
        const user = await getUserByEmail({ email: email })
        const userName = user.fName;
        await insertOTP({ Otp: OTP });
        const obj = {
            OTP,
            email,
            userName
        }
        const data = await OTPemail(obj)
        return res.status(200).json({
            status: "success",
            message: "OTP has been sent successfully to your email!"
        })
    } catch (error) {
        next({
            statusCode: 500,
            errorMessage: error.message,
            message: "OTP could not be sent!"
        })
    }
}
// verifying the OTP 
export const verifyOTP = async (req, res, next) => {
    try {
        const foundOtp = await findOTP(req.body)
        if (!foundOtp) {
            next({
                statusCode: 400,
                message: "Invalid OTP!"
            })
        }
        await findOTPAndDelete(req.body)
        return res.status(200).json({
            status: "success",
            message: "OTP verified!"
        })
    } catch (error) {
        next({
            statusCode: 500,
            message: "Verification failed",
            errorMessage: error.message,
        });
    }
}
export const verifyUser = async (req, res, next) => {
    try {
        const sessionId = req.query.sessionId;
        const token = req.query.t;
        if (!sessionId || !token) {
            return next({
                statusCode: 404,
                message: "Invalid verification Link !!!",
                errorMessage: "No Session Id or No token",
            });
        }

        const session = await findAuthSessionById(sessionId);

        if (!session || session.token !== token) {
            return next({
                statusCode: 404,
                message: "Invalid or expired session !!!",
                errorMessage: "Invalid or expired session !!!",
            });
        }
        const now = new Date()
        console.log(session.expiresAt, now)
        if (new Date(session.expiresAt) < now) {
            return next({
                statusCode: 403,
                message: "Session has expired",
                errorMessage: "The verification link has expired.",
            });
        }
        // marking the user as verified
        const userEmail = session.associate;
        // find the user
        const user = await getUserByEmail({ email: userEmail });
        if (!user) {
            return next({
                statusCode: 404,
                message: "Verification failed!!!",
                errorMessage: "Missing User with the given email!",
            });
        }
        await updateUser({ email: userEmail }, { verified: true })
        return res.status(200).json({
            status: "success",
            message: "Verification Successful!"
        })
    } catch (error) {
        next({
            statusCode: 500,
            message: "Verification failed",
            errorMessage: error.message,
        });
    }
}