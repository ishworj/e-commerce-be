import {
    createCategoryModel,
    deleteCategoryModel,
    getCategoriesDB,
    updatingCategoryModel,
} from "../models/categories/category.model.js";

// creating the category
export const insertCategoryController = async (req, res, next) => {
    try {
        const obj = req.body;
        const categoryData = await createCategoryModel(obj);

        if (!categoryData._id) {
            next({
                statusCode: 401,
                message: "Error! Couldnot create the category.",
            });
        }
        return res.status(200).json({
            status: "success",
            message: "Successfully, created a Category",
            categoryData,
        });
    } catch (error) {
        next({
            statusCode: 500,
            message:
                error?.message || "Internal error in creating the category",
            errorMessage: error.message,
        });
    }
};



// creating the category
export const getCategoryController = async (req, res, next) => {
    try {
        const categories =  await getCategoriesDB()

        if (!categories) {
            next({
                statusCode: 401,
                message: "Error getting categories",
            });
        }
        return res.status(200).json({
            status: "success",
            message: "all categories here",
            categories,
        });
    } catch (error) {
        next({
            statusCode: 500,
            message:
                error?.message || "Internal error in fetching the category",
            errorMessage: error.message,
        });
    }
};

// updating the category
export const updateCategoryController = async (req, res, next) => {
    try {
        const { _id } = req.params;
        console.log(req.body);

        if (!_id) {
            next({
                statusCode: 400,
                message: "Category Id is required!",
                errorMessage: "Category id is not received!",
            });
        }
        const updateObj = req.body;
        const updatedCategory = await updatingCategoryModel(_id, {
            ...updateObj,
        });

        if (!updatedCategory) {
            next({
                statusCode: 404,
                message: "Couldnot update the category! Category Id wrong",
                errorMessage: "Category Not updated! Category Id Wrong",
            });
        } else {
            res.status(200).json({
                status: "success",
                message: "Successfully! Updated the name of the category.",
                updatedCategory,
            });
        }
    } catch (error) {
        next({
            statusCode: 500,
            message:
                error?.message || "Internal error in updating the category",
            errorMessage: error.message,
        });
    }
};

// deleting the category
export const deleteCategoryController = async (req, res, next) => {
    try {
        const { _id } = req.params;
        if (!_id) {
            return res.status(400).json({ message: "Category ID is required" });
        }
        console.log(_id);
        const deletedCategory = await deleteCategoryModel(_id);
        console.log(deletedCategory);
        if (!deletedCategory) {
            return res.status(404).json({ message: "Category not found" });
        }
        return res.status(200).json({
            status: "success",
            message: "Deleted Successfully!",
            deletedCategory,
        });
    } catch (error) {
        console.log(error);
        next({
            statusCode: 500,
            message:
                error?.message || "Internal error in deleting the category",
            errorMessage: error?.message,
        });
    }
};

// some commit
// some commit 2
