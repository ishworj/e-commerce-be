import { response } from "express"
import { createCart, deleteCartItems, findCart, findCartAndAdd, findProductInCart, findProductInCartAndAdd, getCartItemByProductId, updateCartItemQuantity } from "../models/cart/cart.model.js"
import { getSingleProduct } from "../models/products/product.model.js"

// creating the cart 
export const createCartController = async (req, res, next) => {
    try {
        const userId = req.userData._id
        // here _id is the productId
        const { _id, quantity } = req.body
        // checking if the user is signed in or not
        if (!userId) {
            return next({
                statusCode: 404,
                message: "Sign in please first!"
            })
        }
        // finding the detail of the product
        const productResponse = await getSingleProduct(_id);
        const product = { quantity: quantity ?? 1, ...productResponse._doc }
        console.log(product, "product")

        const existingCart = await findCart(userId)
        if (!existingCart) {
            const response = await createCart(userId, product)
            return res.status(200).json({
                status: "success",
                message: "Item added in Cart",
                response
            })

        }
        const itemExistsInCart = await findProductInCart(userId, _id)
        if (itemExistsInCart) {
            const response = await findProductInCartAndAdd(userId, product)
            return res.status(200).json({
                status: "success",
                message: "Items added in Cart",
                response
            })
        }
        const response = await findCartAndAdd(userId, product)
        return res.status(200).json({
            status: "message",
            message: "Item added successfully!",
            response
        })
    } catch (error) {
        next({
            statusCode: 500,
            message: error.message,
        })
    }
}

// deleting the single or multiple items from the cart 
export const deleteCartItemController = async (req, res, next) => {
    try {
        const userId = req.userData._id;
        const { _id } = req.body
        // finding the detail of the product
        const product = await getCartItemByProductId(_id)
        if (!product) {
            return next({
                statusCode: 404,
                message: "Item not found in the cart"
            })
        }

        // finding the particular item in the cart with id
        const { quantity } = product.cartItems.find((item) => item._id);
        let response;
        if (quantity > 1) {
            response = await updateCartItemQuantity(userId, _id, -1)
            console.log(response)
        } else if (quantity === 1) {
            // find the cart and delete the selected item
            const response = await deleteCartItems(userId, _id)
            if (!response) {
                return next({
                    statusCode: 404,
                    message: "Couldnot remove the item from the cart!"
                })
            }
        }
        return res.status(200).json({
            status: "success",
            message: "Item removed from the cart",
            response
        })
    } catch (error) {
        next({
            statusCode: 500,
            message: error?.message,
        })
    }
}

//getting all the items in the cart 
export const fetchCart = async (req, res, next) => {
    try {
        const userId = req.userData._id
        const cart = await findCart(userId)
        return res.status(200).json({
            status: "success",
            message: "Cart fetched Successfully",
            cart
        })
    } catch (error) {
        next({
            statusCode: 500,
            message: error?.message,
        })
    }
}