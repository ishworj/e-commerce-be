import { createCategoryModel, deleteCategoryModel } from "../models/categories/CategoryModel.js"

// creating the category
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

// updating the category
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

// deleting the category
export const deleteCategoryController = async (req, res, next) => {
    try {
        const { _id } = req.params;
        if (!_id) {
            return res.status(400).json({ message: "Category ID is required" });
        }
        console.log(_id)
        const deletedCategory = await deleteCategoryModel(_id)
        console.log(deletedCategory)
        if (!deletedCategory) {
            return res.status(404).json({ message: "Category not found" });
        }
        return res.status(200).json({
            status: "success",
            message: "Deleted Successfully!",
            deletedCategory
        })
    } catch (error) {
        console.log(error)
        next({
            statusCode: 500,
            message: error?.message || "Internal error in deleting the category",
            errorMessage: error?.message
        })
    }
}