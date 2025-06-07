
import { createUserHistory, getUserHistory, updateUserHistory } from "../models/userHistory/userHistoryModel.js"


export const getUserRecommendation = async (obj) => {

    const { userId, guestSessionId } = obj;
    // console.log(userId, guestSessionId, "getting req.body")
    const userHistory = (userId != null) ? await getUserHistory({ userId }) : await getUserHistory({ guestSessionId })
    // console.log(userHistory, "userHistoryu")
    return userHistory
}
export const createHistory = async (req, res, next) => {
    // console.log(req.body, "req")
    try {
        const { userId, guestSessionId } = req.body
        const dbData = await getUserRecommendation(req.body)
        // console.log(dbData, 9999)
        const response = (dbData) ? await updateHistory(req.body) : await createUserHistory(req.body)

        if (!userId && !guestSessionId) {
            return res.status(400).json({
                status: "error",
                message: "Missing something in req",
            })
        }
        return res.status(200).json({
            status: "success",
            message: "added",
            response
        })
    } catch (error) {
        console.log(error, 2323)
        return next({
            statusCode: 500,
            message: error?.message || "Internal error",
            errorMessage: error.message,
        });
    }
}

export const updateHistory = async (obj) => {

    const { userId, guestSessionId, productId, categoryId, action } = obj;
    const history = {
        productId,
        categoryId,
        action
    }
    const filter = userId != null ? { userId } : { guestSessionId }
    // console.log(filter, "before being passed")
    if (!userId && !guestSessionId) {
        return res.status(400).json({
            status: "error",
            message: "No filter variable available",
        })
    }
    const response = await updateUserHistory(filter, history)
    if (!response) {
        return res.status(400).json({
            status: "error",
            message: "failed in adding and updating",
        })
    }
    // console.log(response, "updated")
    return response
}