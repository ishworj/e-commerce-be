import UserBehaviour from "./userHistorySchema.js";

export const createUserHistory = async (historyObj) => {
    // console.log(historyObj, "creating now")
    return UserBehaviour(historyObj).save()
};

// user history
export const getUserHistory = (filter) => {
    // console.log(filter, "getting the user")
    return UserBehaviour.find(filter).sort({ createdAt: -1 })
}

export const updateUserHistory = (filter, { productId, categoryId, action }) => {
    // console.log(filter, { productId, categoryId, action }, "updating ")
    return UserBehaviour.findOneAndUpdate(
        filter,
        {
            $push:
            {
                history:
                {
                    productId,
                    categoryId,
                    action
                }
            }
        },
        {
            upsert: true,
            new: true
        })
}