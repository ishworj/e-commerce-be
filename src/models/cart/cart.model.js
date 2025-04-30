
import CartSchema from "./cart.schema.js"

// finding if the cart exist already
export const findCart = (userId) => {
    return CartSchema.findOne({ userId })
}

// finding the product item in the existing cart
export const findProductInCart = (userId, _id) => {
    return CartSchema.findOne(
        {
            userId,
            cartItems: {
                $elemMatch: {
                    _id: _id
                }
            }
        })
}
// if there is a existing cart and item, then just update the quantity that is provided or update by 1 by default
export const findProductInCartAndAdd = (userId, product) => {
    return CartSchema.findOneAndUpdate({ userId, "cartItems._id": product._id }, { $inc: { "cartItems.$.quantity": product.quantity || 1 } }, { new: true })
}
// if there is a existing cart but not the product then simply add it 
export const findCartAndAdd = (filter, obj) => {
    return CartSchema.findOneAndUpdate({ userId: filter },
        {
            $push:
                { cartItems: [obj] }
        },
        {
            new: true
        })
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

export const updateCartItemQuantity = (userId, _id, change) => {
    return CartSchema.findOneAndUpdate({ userId, "cartItems._id": _id }, { $inc: { "cartItems.$.quantity": change } }, { new: true })
}


export const deleteCartItems = (userId, _id) => {
    return CartSchema.findOneAndUpdate(
        { userId },
        {
            $pull: {
                cartItems: {
                    _id: { $in: _id }
                }
            }
        },
        { new: true }
    )
}

export const getCartItemByProductId = (_id) => {
    return CartSchema.findOne({
        cartItems: {
            $elemMatch: { _id }
        }
    })
}