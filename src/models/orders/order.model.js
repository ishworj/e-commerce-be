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

export const updateOrderDB = (id, updateObj) => {
    return OrderSchema.findByIdAndUpdate(id, updateObj, {
        new: true,
        runValidators: true,
    });
};

export const getOneOrderDB = (id) => {
    return OrderSchema.findById(id);
};
