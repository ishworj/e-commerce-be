import React from "react";
import { Document, Page, StyleSheet, Text, View } from "@react-pdf/renderer";

// Styles
const styles = StyleSheet.create({
    page: { padding: 30, fontSize: 12, fontFamily: "Helvetica" },
    header: { fontSize: 20, marginBottom: 10, textAlign: "right" },
    subHeader: { fontSize: 10, textAlign: "right", marginBottom: 20 },
    section: { marginBottom: 10 },
    bold: { fontWeight: "bold" },
    row: { flexDirection: "row", justifyContent: "space-between", marginVertical: 4 },
    tableHeader: {
        flexDirection: "row",
        borderBottom: "1pt solid black",
        paddingBottom: 4,
        marginTop: 10,
        fontWeight: "bold",
    },
    tableRow: { flexDirection: "row", justifyContent: "space-between", paddingVertical: 2 },
    footer: { marginTop: 20, fontSize: 10 },
});


// Component
const Invoice = ({ order, invoiceNumber }) => {
    const productRows = order.products.map((product, index) => {
        const rate = product.amount_total / product.quantity;

        return React.createElement(
            View,
            { key: index, style: styles.tableRow },
            React.createElement(Text, { style: { width: "40%" } }, product.name),
            React.createElement(Text, { style: { width: "20%", textAlign: "right" } }, product.quantity),
            React.createElement(Text, { style: { width: "20%", textAlign: "right" } }, `$${rate}`),
            React.createElement(Text, { style: { width: "20%", textAlign: "right" } }, `$${product.amount_total}`)
        );
    });

    return React.createElement(
        Document,
        null,
        React.createElement(
            Page,
            { style: styles.page },

            // Header
            React.createElement(
                View,
                { invoiceNumber },
                React.createElement(Text, { style: styles.header }, "Delivery Report"),
                React.createElement(Text, { style: styles.subHeader }, `#INV-${invoiceNumber}`)
            ),

            // Order info
            React.createElement(
                View,
                { style: styles.section },
                React.createElement(Text, null, `Date: ${new Date(order.createdAt).toDateString()}`),
                React.createElement(Text, null, "Payment Terms: Invoice"),
                React.createElement(Text, { style: styles.bold }, "Balance Due: $0.00")
            ),

            // Billing info
            React.createElement(
                View,
                { style: styles.section },
                React.createElement(Text, { style: styles.bold }, "Bill To:"),
                React.createElement(Text, null, "Sai Sandeep")
            ),

            // Table headers
            React.createElement(
                View,
                { style: styles.tableHeader },
                React.createElement(Text, { style: { width: "40%" } }, "Item"),
                React.createElement(Text, { style: { width: "20%", textAlign: "right" } }, "Qty"),
                React.createElement(Text, { style: { width: "20%", textAlign: "right" } }, "Rate"),
                React.createElement(Text, { style: { width: "20%", textAlign: "right" } }, "Amount")
            ),

            // Product rows
            ...productRows,

            // Total row
            React.createElement(
                View,
                { style: { ...styles.row, marginTop: 10 } },
                React.createElement(Text, null, "Total:"),
                React.createElement(Text, { style: styles.bold }, `$${order.totalAmount}`)
            ),

            // Footer
            React.createElement(
                View,
                { style: styles.footer },
                React.createElement(Text, null, "Thanks for being an awesome customer!"),
                React.createElement(
                    Text,
                    null,
                    "This invoice is auto generated at the time of delivery. If there is any issue, contact provider."
                )
            )
        )
    );
};

export default Invoice;
