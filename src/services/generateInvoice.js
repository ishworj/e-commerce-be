import React from "react"
import Invoice from "./invoiceTemplate.js"
import ReactPDF from '@react-pdf/renderer';


export const generateInvoice = async (order, invoiceNumber) => {
    console.log("order", order)
    if (!order) throw new Error("Missing order details")


    const element = React.createElement(Invoice, { order, invoiceNumber })
    try {
        const stream = await ReactPDF.renderToStream(element);
        return stream;
    } catch (error) {
        console.error("Error generating PDF stream:", error);
        throw new Error("Failed to generate PDF");
    }

}