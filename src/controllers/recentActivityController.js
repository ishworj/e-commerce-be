import { createRecentActivity, getRecentActivity, getRecentActivityForUser } from "../models/recentActivity/recentActivity.model.js"

export const createRecentActivityController = async (req, res, next) => {
    try {
        const obj = req.body
        const data = await createRecentActivity(obj)

        return res.status(200).json({
            status: "success",
            message: "Recent Activity Created!",
            data
        })
    } catch (error) {
        console.log(error?.message)
        return next({
            statusCode: 500,
            errorMessage: error?.message,
            message: "Activity Creation Failed"
        })
    }
}

// (pagination)
export const getAllRecentActivityController = async (req, res, next) => {
    try {
        const { page } = req.query

        const pageNum = parseInt(page, 10);
        const currentPage = (!isNaN(pageNum) && pageNum > 0) ? pageNum : 1;

        const data = await getRecentActivity(currentPage)

        return res.status(200).json({
            status: "success",
            message: "All Recent Activity Fetched!",
            data,
            hasMore: data.length === 20
        })
    } catch (error) {
        console.log(error?.message)
        return next({
            statusCode: 500,
            errorMessage: error?.message,
            message: "All Activity Fetching Failed"
        })
    }
}

// (pagination)
export const getUserRecentActivityController = async (req, res, next) => {
    try {
        const { page, userId } = req.query

        const pageNum = parseInt(page, 10);
        const currentPage = (!isNaN(pageNum) && pageNum > 0) ? pageNum : 1;

        const data = await getRecentActivityForUser(userId, currentPage)

        return res.status(200).json({
            status: "success",
            message: "User Recent Activity Fetched!",
            data,
            hasMore: data.length === 20
        })
    } catch (error) {
        console.log(error?.message)
        return next({
            statusCode: 500,
            errorMessage: error?.message,
            message: "User Activity Fetching Failed"
        })
    }
}
