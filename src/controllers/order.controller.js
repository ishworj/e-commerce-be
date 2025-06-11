import {
    createOrderDB,
    deleteOrderDB,
    deleteOrderItemDB,
    getAllOrderDB,
    getOneOrderDB,
    getOrderDB,
    updateOrderDB,
} from "../models/orders/order.model.js";

export const createOrder = async (req, res, next) => {
    try {
        req.body.userId = req.userData._id;
        req.body.status = "pending";
        const order = await createOrderDB(req.body);
        res.status(201).json({
            status: "success",
            message: "Finalised your order successfully...",
            order,
        });
    } catch (error) {
        next({
            message: "Error while creating order",
            errorMessage: error.message,
        });
    }
};

export const getOrder = async (req, res, next) => {
    try {
        const orders = await getOrderDB({ userId: req.userData._id });

        res.status(200).json({
            status: "success",
            message: "Here are your orders...",
            orders,
        });
    } catch (error) {
        next({
            message: "Error while listing order",
            errorMessage: error.message,
        });
    }
};

export const getAllOrders = async (req, res, next) => {
    try {
        const orders = await getAllOrderDB();
        res.status(200).json({
            status: "success",
            message: "All orders are here!",
            orders,
        });
    } catch (error) {
        next({
            message: "Error while listing  All orders",
            errorMessage: error.message,
        });
    }
};

export const updateOrder = async (req, res, next) => {
    try {
        const data = req.body;
        const { _id, ...rest } = data;

        const order = await getOneOrderDB(_id);
        if (!order) {
            return next({
                statusCode: 404,
                status: "fail",
                message: "Order not found",
            });
        }
        const orderUpdated = await updateOrderDB(_id, rest);
        res.status(200).json({
            status: "success",
            message: "Order updated!",
            orderUpdated,
        });
    } catch (error) {
        console.log(error?.message)
        return next({
            message: "Error while updating order!",
            errorMessage: error.message,
        });
    }
};

export const deleteOrder = async (req, res, next) => {
    try {
        const { id } = req.params;
        const response = await deleteOrderDB(id);
        if (!id) {
            return res.status(404).json({
                status: "error",
                message: "Order Not Found!"
            })
        }
        return res.status(200).json({
            status: "success",
            message: "Order Cancelled!",
            response
        })
    } catch (error) {
        next({
            message: "Error while deleting the order!",
            errorMessage: error.message,
        });
    }
}

export const deleteOrderItem = async (req, res, next) => {
    try {
        const { id, ID } = req.params;
        const response = await deleteOrderItemDB(id, ID);
        if (!response) {
            return res.status(404).json({
                status: "error",
                message: "Item Not Found!"
            })
        }
        const order = await getOneOrderDB(id)
        if (order.products.length <= 0) {
            await deleteOrderDB(id)
        }
        return res.status(200).json({
            status: "success",
            message: "Item Deleted Successfully!",
            response
        })
    } catch (error) {
        next({
            message: "Error while deleting the order!",
            errorMessage: error.message,
        });
    }
}