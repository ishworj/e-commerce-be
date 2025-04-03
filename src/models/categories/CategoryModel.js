import CategorySchema from "./CategorySchema.js"

// create a category
export const createCategoryModel = (obj) => {
    return CategorySchema(obj).save();
}

// updating a category 
export const updatingCategoryModel = (filter, obj) => {
    return CategorySchema.findByIdAndUpdate(filter, obj, { new: true })
}

// deleting a category
export const deleteCategoryModel = (_id) => {
    return CategorySchema.findByIdAndDelete(_id, { new: true })
}