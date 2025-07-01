import invoiceModel from "./invoices.schema.js"

export const createInvoice = (invoiceObj) => {
    return new invoiceModel(invoiceObj).save()
}

export const getInvoice = (filter) => {
    return invoiceModel.findOne(filter)
}