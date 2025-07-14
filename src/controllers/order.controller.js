import {
    createOrderDB,
    deleteOrderDB,
    deleteOrderItemDB,
    getAllOrderDB,
    getOneOrderDB,
    getOrderDB,
    getOrdersForTimeFrame,
    updateOrderDB,
} from "../models/orders/order.model.js";
import Order from "../models/orders/order.schema.js";

import { findUserById } from "../models/users/user.model.js";
import { deliveredOrderEmail, shipOrderEmail } from "../services/email.service.js";
import { getPaginatedData, getPaginatedDataFilter } from "../utils/Pagination.js";

// with pagination 
export const getOrder = async (req, res, next) => {
    try {
        const orders = await getPaginatedDataFilter(Order, req, { userId: req.userData._id })
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
// with pagination 
export const getAllOrders = async (req, res, next) => {
    try {
        const orders = await getPaginatedData(Order, req)
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
// with out pagination and collecting orders acc to the time Frame
export const getAllOrdersTimeFrame = async (req, res, next) => {
    try {
        console.log(req.query)
        const orders = await getOrdersForTimeFrame(req.query.startTime, req.query.endTime)

        console.log(orders)
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
        const { _id, status } = data;
        const order = await getOneOrderDB(_id);
        const user = await findUserById(order.userId)
        if (!order) {
            return next({
                statusCode: 404,
                status: "fail",
                message: "Order not found",
            });
        }
        const orderUpdated = await updateOrderDB(_id, { status });

        // send the mail for the order status
        const obj = {
            userName: user.fName + " " + user.lName,
            email: user.email,
            order
        }
        if (status === "shipped") {
            await shipOrderEmail(obj)
        } else if (status === "delivered") {
            await deliveredOrderEmail(obj)
        }
        // userName, email, order
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

// export const createOrder = async (req, res, next) => {
//     try {
//         req.body.userId = req.userData._id;
//         console.log(req.userData)
//         req.body.status = "pending";
//         const order = await createOrderDB(req.body)

//         res.status(201).json({
//             status: "success",
//             message: "Finalised your order successfully...",
//             order,
//         });
//     } catch (error) {
//         return next({
//             message: "Error while creating order",
//             errorMessage: error.message,
//         });
//     }
// };