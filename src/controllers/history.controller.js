import { createUserHistory, getUserHistory } from "../models/userHistory/userHistoryModel.js"

export const createHistory = async (req, res, next) => {
    try {
        const data = await createUserHistory(req.body)
        console.log(data, "created History")
        if (!data) {
            return res.status(400).json({
                status: "error",
                message: "Missing something in req",
            })
        }
        return res.status(200).json({
            status: "success",
            message: data,
        })
    } catch (error) {
        return next({
            statusCode: 500,
            message: error?.message || "Internal error",
            errorMessage: error.message,
        });
    }
}

export const getHistory = async (req, res, next) => {
    try {
        // the payload shoyuld be handled as object while sending from FE
        const data = req.body;
        const response = await getUserHistory(data)
        if (!response) {
            return res.status(400).json({
                status: "error",
                message: "Missing something in req",
            })
        }
        return res.status(200).json({
            status: "success",
            message: response,
        })
    } catch (error) {
        return next({
            statusCode: 500,
            message: error?.message || "Internal error",
            errorMessage: error.message,
        });
    }
}