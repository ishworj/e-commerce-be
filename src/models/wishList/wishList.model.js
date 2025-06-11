import wishListSchema from "./wishList.schema.js"

export const createWishList = (obj) => {
    return wishListSchema(obj).save()
}

export const getWishList = (filter) => {
    return wishListSchema.find(filter);
}

export const deleteWishList = (filter) => {
    return wishListSchema.findOneAndDelete(filter, { new: true })
}

export const deleteWholeWishList = (userId) => {
    return wishListSchema.deleteMany(userId)
}