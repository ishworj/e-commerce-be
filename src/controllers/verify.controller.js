import {
    findAuthSessionById,
    findAuthSessionByIdandDelete,
} from "../models/sessions/auth.session.model.js";
import { getUserByEmail, updateUser } from "../models/users/user.model.js";

export const verifyEmail = async (req, res, next) => {
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

        // marking the user as verified
        const userEmail = session.associate;
        // find the user
        const unverifiedUser = await getUserByEmail(userEmail);
        const updatedStatus = await updateUser(unverifiedUser._id, {
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
