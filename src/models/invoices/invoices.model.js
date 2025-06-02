import invoicesSchema from "./invoices.schema.js"

export const createInvoice = (invoiceObj) => {
    return invoicesSchema(invoiceObj).save()
}