import { createCart, findCart, findProductInCart, findProductInCartAndAdd } from "../models/cart/cart.model.js"
import { getSingleProduct } from "../models/products/product.model.js"

// creating the cart 
export const createCartController = async (req, res, next) => {
    try {
        const userId = req.userData._id
        const { productId } = req.body
        // finding the detail of the product
        const product = await getSingleProduct(productId);
        console.log(product, "product")
        // const product = {
        //     name: name,
        //     price: price,
        //     productId: productId,
        //     quantity: quantity
        // }
        console.log(userId)
        if (!userId) {
            next({
                statusCode: 404,
                message: "Sign in please first!"
            })
        }
        const existingCart = await findCart(userId)
        if (existingCart) {
            const itemExistsInCart = await findProductInCart(userId, productId)
            if (itemExistsInCart) {
                const response = await findProductInCartAndAdd(userId, product)
                return res.status(200).json({
                    status: "success",
                    "message": "Item added in Cart",
                    response
                })
            }
        }
        const response = await createCart(userId, product)
        return res.status(200).json({
            status: "success",
            "message": "Item added in Cart",
            response
        })

    } catch (error) {
        next({
            statusCode: 500,
            message: "Internal error!",
            statusMessage: error?.message,
        })
    }
}

// updating each item 
export const updateCartController = async () => {
    try {

    } catch (error) {

    }
}

// deleting the single or multiple items from the cart 
export const deleteCartItemController = async () => {
    try {

    } catch (error) {

    }
}