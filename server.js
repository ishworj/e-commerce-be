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
import cartRouter from "./src/routers/cart.route.js";
import paymentRouter from "./src/routers/payment.route.js";
import chatRouter from "./src/routers/chat.route.js";
import invoiceRouter from "./src/routers/invoice.route.js";
import historyRouter from "./src/routers/history.route.js";
import wishListRouter from "./src/routers/wishList.route.js";
import featureBannerRouter from "./src/routers/featureBanner.route.js";

import { errorHandler } from "./src/middlewares/error.handler.js";

const app = express();
const PORT = process.env.PORT;

// log middleware
if (process.env.NODE_ENV !== "production") {
  app.use(morgan("dev"));
} else {
  app.use(morgan("combined"));
}

// Run server here
app.use(express.json());

const allowedOrigins = ["http://localhost:5173", "https://e-commerce-fe-ram-cpu-coders-projects.vercel.app"];
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin.replace(/\/$/, ""))) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: "include",
  })
);

// routers
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/products", productRouter);
app.use("/api/v1/category", categoryRouter);
app.use("/api/v1/review", reviewRouter);
app.use("/api/v1/orders", orderRouter);
app.use("/api/v1/cart", cartRouter);
app.use("/api/v1/payment", paymentRouter);
app.use("/api/v1/chat", chatRouter);
app.use("/api/v1/invoice", invoiceRouter);
app.use("/api/v1/history", historyRouter);
app.use("/api/v1/wishlist", wishListRouter);
app.use("/api/v1/featureBanner", featureBannerRouter);

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
