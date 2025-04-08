import { getActiveReview, getAllReview, insertReview } from "../models/reviews/ReviewModel.js"

export const createReview = async (req, res, next) => {
    try {
        const reviewObj = req.body
        const review = await insertReview(reviewObj);

        if (!review._id) {
            return next({
                statusCode: 404,
                message: "Couldnot post your review!",
                errorMessage: "No Review Id, Error while creating the review"
            })
        } else {
            return res.status(200).json({
                status: "success",
                message: "Successfully, posted review!",
                review
            })
        }
    } catch (error) {
        return next({
            statusCode: 500,
            message: "Internal Error while creating the review!",
            errorMessage: error?.message
        })
    }
}
export const getAllReviewsController = async (req, res, next) => {
    try {
        const reviews = await getAllReview();

        if (!reviews) {
            return next({
                statusCode: 404,
                message: "Couldnot fetch the reviews!",
                errorMessage: "No Reviews, Error while fetching the reviewas"
            })
        } else {
            return res.status(200).json({
                status: "success",
                message: "Successfully, fetched review!",
                reviews
            })
        }
    } catch (error) {
        return next({
            statusCode: 500,
            message: "Internal Error while fetching the review!",
            errorMessage: error?.message
        })
    }
}

export const getPubReviews = async (req, res, async) => {
    try {
        const reviews = await getActiveReview();

        if (!reviews) {
            return next({
                statusCode: 404,
                message: "Couldnot fetch the reviews!",
                errorMessage: "No Reviews, Error while fetching the reviewas"
            })
        } else {
            return res.status(200).json({
                status: "success",
                message: "Successfully, fetched review!",
                reviews
            })
        }
    } catch (error) {
        return next({
            statusCode: 500,
            message: "Internal Error while fetching the review!",
            errorMessage: error?.message
        })
    }
}