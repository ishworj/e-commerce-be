import { createCategoryModel } from "../models/categories/CategoryModel.js"

export const insertCategoryController = async (req, res, next) => {
    try {
        const obj = req.body;
        const categoryData = await createCategoryModel(obj)

        if (!categoryData._id) {
            next({
                statusCode: 401,
                message: "Error! Couldnot create the category."
            })
        }
        return res.status(200).json({
            status: "success",
            message: "Successfully, created a Category",
            categoryData
        })
    } catch (error) {
        next({
            statusCode: 500,
            message: error?.message || "Internal error in creating the category",
            errorMessage: error.message
        })
    }
}

export const updateCategoryController = async (req, res, next) => {
    try {

    } catch (error) {
        next({
            statusCode: 500,
            message: error?.message || "Internal error in updating the category",
            errorMessage: error.message
        })
    }
}

export const deleteCategoryController = async (req, res, next) => {
    try {

    } catch (error) {
        next({
            statusCode: 500,
            message: error?.message || "Internal error in deleting the category",
            errorMessage: error.message
        })
    }
}