import { createInvoice, getInvoice } from "../models/invoices/invoices.model.js";
import { getOneOrderDB, updateOrderDB } from "../models/orders/order.model.js";
import { findUserById } from "../models/users/user.model.js";
import { generateInvoice } from "../services/generateInvoice.js";

export const createInvoiceController = async (req, res, next) => {
    try {
        const id = req.params.id;
        console.log(id)
        if (!id) {
            return res.status(400).json({
                status: "error",
                message: "Missing order ID in request",
            });
        }

        const order = await getOneOrderDB(id);
        if (!order) {
            return res.status(404).json({
                status: "error",
                message: "Order not found",
            });
        }

        // check if there is already an invoice created or not 
        const invoiceExists = await getInvoice({ _id: order.invoiceId })

        // if created then return it
        if (invoiceExists) {
            // some logic 
        }

        // if not created, then create one and store it in DB
        if (!invoiceExists) {
            const generateRandomInvoiceNumber = () => {
                let invoiceNumber = "";
                const string = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
                const length = 8;
                for (let i = 0; i < length; i++) {
                    let randomIndex = Math.floor(Math.random() * string.length)
                    invoiceNumber += string[randomIndex]
                }
                return invoiceNumber;
            }
            const invoiceNumber = generateRandomInvoiceNumber()
            const user = await findUserById(order.userId)

            const invoiceObj = {
                invoiceNumber: invoiceNumber,
                orderId: order._id,
                userId: order.userId,
                userName: user.fName + user.lName || "N/A",
                totalAmount: order.totalAmount,
                shippingAddress: order.shippingAddress || "",
                taxAmount: order.taxAmount || 0,
                status: "paid",
                products: order.products.map(key => ({
                    id: key.id,
                    name: key.name,
                    quantity: key.quantity,
                    amount_total: key.amount_total,
                    productImages: key.productImages || []
                })),
                notes: order.notes || ""
            }

            // store the invoice in DB
            const invoiceDb = await createInvoice(invoiceObj)
            const updateOrder = await updateOrderDB(id, { invoiceId: invoiceDb._id })
            const invoiceStream = await generateInvoice(order, invoiceNumber);

            if (!invoiceStream || typeof invoiceStream.pipe !== "function") {
                return res.status(500).json({
                    status: "error",
                    message: "Failed to generate invoice stream",
                });
            }

            res.setHeader("Content-Type", "application/pdf");
            res.setHeader("Content-Disposition", `inline; filename=invoice_${id}.pdf`);

            invoiceStream.pipe(res); // Pipe the PDF stream to the response
        }
    } catch (error) {
        console.error("Invoice generation error:", error);
        return next({
            message: "Error while creating invoice",
            errorMessage: error.message,
        });
    }
};
