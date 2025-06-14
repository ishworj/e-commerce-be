
import { getSingleProduct, updateProductDB } from "../models/products/product.model.js";
import {
    getActiveReview,
    getAllReview,
    insertReview,
} from "../models/reviews/review.model.js";

export const createReview = async (req, res, next) => {
    try {
        const { userId, productId, rating, comment } = req.body;
        console.log(typeof (productId))
        const product = await getSingleProduct(productId)
        const { email, fName, lName } = req.userData
        if (!product) {
            return next({
                statusCode: 404,
                message: "No such Product in Db"
            });
        }
        const { images, name } = product
        const reviewObj = {
            userId,
            userName: fName + " " + lName,
            email: email,
            userImage: "/default.png",
            productId,
            productName: name,
            productImage: images[0],
            rating,
            comment
        }
        const review = await insertReview(reviewObj);

        await updateProductDB(productId, {
            $push: { reviews: review._id }
        })

        if (!review._id) {
            return next({
                statusCode: 404,
                message: "Couldnot post your review!",
                errorMessage: "No Review Id, Error while creating the review",
            });
        } else {
            return res.status(200).json({
                status: "success",
                message: "Successfully, posted review!",
                review,
            });
        }
    } catch (error) {
        return next({
            statusCode: 500,
            message: "Internal Error while creating the review!",
            errorMessage: error?.message,
        });
    }
};
export const getAllReviewsController = async (req, res, next) => {
    try {
        const reviews = await getAllReview();

        if (!reviews) {
            return next({
                statusCode: 404,
                message: "Couldnot fetch the reviews!",
                errorMessage: "No Reviews, Error while fetching the reviewas",
            });
        } else {
            return res.status(200).json({
                status: "success",
                message: "Successfully, fetched review!",
                reviews,
            });
        }
    } catch (error) {
        return next({
            statusCode: 500,
            message: "Internal Error while fetching the review!",
            errorMessage: error?.message,
        });
    }
};

export const getPubReviews = async (req, res, async) => {
    try {
        const reviews = await getActiveReview();

        if (!reviews) {
            return next({
                statusCode: 404,
                message: "Couldnot fetch the reviews!",
                errorMessage: "No Reviews, Error while fetching the reviewas",
            });
        }
        return res.status(200).json({
            status: "success",
            message: "Successfully, fetched review!",
            reviews,
        });

    } catch (error) {
        return next({
            statusCode: 500,
            message: "Internal Error while fetching the review!",
            errorMessage: error?.message,
        });
    }
};
