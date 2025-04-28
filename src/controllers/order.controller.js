import {
    createOrderDB,
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
            message: "Order created successfully",
            order,
        });
    } catch (error) {
        next({
            message: "Error while processing order",
            errorMessage: error.message,
        });
    }
};

export const getOrder = async (req, res, next) => {
    try {
        const orders = await getOrderDB({ userId: req.userData._id });

        if (orders.length === 0) {
            next({
                statusCode: 404,
                status: "fail",
                message: "No orders found",
            });
        }
        res.status(200).json({
            status: "success",
            message: "Here are your orders",
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
            message: "All orders",
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
        const id = req.params.id;

        const order = await getOneOrderDB(id);
        if (!order) {
            next({
                statusCode: 404,
                status: "fail",
                message: "Order not found",
            });
        }
        const orderUpdated = await updateOrderDB(id, req.body);
        res.status(200).json({
            status: "success",
            message: "Order updated",
            orderUpdated,
        });
    } catch (error) {
        next({
            message: "Error while updating order",
            errorMessage: error.message,
        });
    }
};
