import OrderSchema from "./order.schema.js";

export const createOrderDB = (orderObj) => {
    return OrderSchema(orderObj).save();
};

export const getOrderDB = (filter) => {
    return OrderSchema.find(filter);
};

export const getAllOrderDB = () => {
    return OrderSchema.find();
};

export const getOrdersForTimeFrame = (startTime, endTime) => {
    return OrderSchema.find({ createdAt: { $gte: new Date(startTime), $lt: new Date(endTime) } });
};

export const updateOrderDB = (_id, updateObj) => {
    // console.log(updateObj, 999)
    return OrderSchema.findByIdAndUpdate(_id, { $set: updateObj }, {
        new: true,
        runValidators: true,
    });
};

export const getOneOrderDB = (id) => {
    return OrderSchema.findById(id);
};

export const deleteOrderDB = (_id) => {
    return OrderSchema.findByIdAndDelete(_id, { new: true })
}

export const deleteOrderItemDB = (_id, ID) => {
    return OrderSchema.findByIdAndUpdate(_id,
        {
            $pull: {
                products: { id: ID }
            }
        },
        { new: true })
}