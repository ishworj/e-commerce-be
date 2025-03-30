import express from "express";
import { connectDB } from "./src/config/mongoDbConfig.js";

const app = express();
const PORT = process.env.PORT;

// Run server here

// app.use("/api/v1/auth", authRouter);

// listen the server

const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`The server is running at http://localhost:${PORT}`);
    });
  } catch (error) {
    console.log("SERVER failed to run", error);
  }
};

startServer();
