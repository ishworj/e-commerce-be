import express from "express";
import morgan from "morgan";
import cors from "cors";
import { connectDB } from "./src/config/mongo.db.config.js";
import authRouter from "./src/routers/auth.route.js";
import productRouter from "./src/routers/product.route.js";
import categoryRouter from "./src/routers/category.route.js";
import reviewRouter from "./src/routers/review.route.js";
import orderRouter from "./src/routers/order.route.js";
import verifyEmailRouter from "./src/routers/verify.route.js";
import { errorHandler } from "./src/middlewares/error.handler.js";

const app = express();
const PORT = process.env.PORT;

// log middleware
if (process.env.NODE_ENV !== "production") {
  app.use(morgan("dev"));
} else {
  app.use(morgan("combined"));
}

//  hello this is the example
// Run server here
app.use(express.json());

app.use(cors());
// routers
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/products", productRouter);
app.use("/api/v1/category", categoryRouter);
app.use("/api/v1/review", reviewRouter);
app.use("/api/v1/orders", orderRouter);

// verifying error
app.use("/verify-user", verifyEmailRouter);

// error handler
app.use(errorHandler);

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
