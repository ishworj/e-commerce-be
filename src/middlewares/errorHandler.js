export const errorHandler = (err, req, res, next) => {
    let statusCode = err.statusCode || 500;
    let message = err.message || "Internal Server Error!!!"

    if (message.includes("E11000")) {
        statusCode = 400,
            message = "DUPLICATE USER !"
    }

    return res.status(statusCode).send({
        message: message,
        status: "error"
    })
}