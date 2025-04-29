import CartSchema from "./cart.schema.js"

// finding if the cart exist already
export const findCart = (userId) => {
    return CartSchema.findOne({ userId })
}
// finding the product item in the existing cart
export const findProductInCart = (userId, productId) => {
    return CartSchema.findOne({ userId, "cartItems.productId": productId }, { "cartItems.$": 1 })
}
// if there is a existing cart and item, then just update the quantity that is provided or update by 1 by default
export const findProductInCartAndAdd = (userId, product) => {
    return CartSchema.findOneAndUpdate({ userId, "cartItems.productId": product.productId }, { $inc: { "cartItems.$.quantity": product.quantity || 1 } })
}

// checks if there is existing cart or not, if not creates and add the items
export const createCart = (filter, obj) => {
    return CartSchema.findOneAndUpdate(
        { userId: filter },
        {
            $push:
                { cartItems: [obj] }

        },
        {
            upsert: true,
            new: true
        }

    )
}

export const updateCartItem = (itemId, obj) => { }


export const deleteCartItems = (userId, itemIds) => {
    return CartSchema.findOneAndUpdate(
        { userId },
        {
            $pull: {
                cartItems: {
                    productId: { $in: itemIds }
                }
            }
        },
        { new: true }
    )
}