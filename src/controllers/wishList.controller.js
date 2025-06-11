import { createWishList } from "../models/wishList/wishList.model.js"

export const createWishListController = async (req, res, next) => {
    try {
        const userId = req.userData._id
        console.log(userId)

        const obj = req.body

        const data = await createWishList({ userId, ...obj })
        if (!userId) {
            return res.status(400).json({
                status: "error",
                message: "Please Log in!"
            })
        }

        return res.status(200).json({
            status: "success",
            message: "Added item in WishList",
            data
        })
    } catch (error) {
        return next({
            statusCode: 500,
            message: "Internal server error",
            errorMessage: error?.message,
        });
    }
}