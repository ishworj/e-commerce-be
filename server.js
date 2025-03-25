import express from "express";

const app = express();
const PORT = process.env.PORT;

// Run server here 

// app.use("/api/v1/auth", authRouter);

// listen the server 
app.listen(PORT, (error) => {
    error
        ? console.log(error)
        : console.log("The Server is running at http://localhost:" + PORT);
})