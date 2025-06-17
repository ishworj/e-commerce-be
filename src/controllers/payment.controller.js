import Stripe from "stripe";
import { findCart } from "../models/cart/cart.model.js";
import { createOrderDB, getOrderDB } from "../models/orders/order.model.js";
import { findUserById } from "../models/users/user.model.js";
import { createOrderEmail } from "../services/email.service.js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const makePayment = async (req, res, next) => {
  try {
    // const origin = req.headers.origin;
    const user = req.userData;
    const cart = await findCart(user._id);

    if (!cart || cart.cartItems.length === 0) {
      return res
        .status(400)
        .json({ status: "error", message: "Cart is empty" });
      s;
    }
    // console.log(cart, "cart")
    // Prepare line items for Stripe
    const line_items = cart.cartItems.map((item) => ({
      price_data: {
        currency: "aud", // or your preferred currency
        product_data: {
          name: item.name,
          images: item.images,
          metadata: {
            productId: String(item._id)
          }
        },
        unit_amount: item.price * 100, // Stripe expects amount in cents
      },
      quantity: item.quantity,
    }));

    // Creates the checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items,
      customer_email: user.email,
      mode: "payment",
      success_url:
        "http://localhost:5173/payment-result?success=true&session_id={CHECKOUT_SESSION_ID}",
      cancel_url:
        "http://localhost:5173/payment-result?success=false&session_id={CHECKOUT_SESSION_ID}",

      //   success_url: `${origin}?success=true`, for production
      //   cancel_url: `${origin}?canceled=true`,
    });

    // Send the session URL
    return res.status(200).json({
      status: "success",
      message: "Checkout session created successfully",
      url: session.url,
      cart: cart,
    });
  } catch (error) {
    console.error("Error creating checkout session:", error);
    next({
      statusCode: 500,
      message: "payment failed",
      errorMessage: error?.message,
    });
  }
};


export const verifyPaymentSession = async (req, res) => {
  const { session_id } = req.query;

  try {
    const session = await stripe.checkout.sessions.retrieve(session_id);

    const cart = await stripe.checkout.sessions.listLineItems(session_id);
    const paymentIntent = session.payment_intent
    const detailedLineItems = await Promise.all(
      cart.data.map(async item => {
        const price = await stripe.prices.retrieve(item.price.id);
        const product = await stripe.products.retrieve(price.product);
        // console.log(price, "cart after verifying")

        return {
          _id: product.metadata.productId,
          quantity: item.quantity,
          amount_total: item.amount_total,
          currency: item.currency,
          price: price.unit_amount,
          name: product.name,
          productDescription: product.description,
          productImages: product.images,
          productMetadata: product.metadata,
        };
      })
    );
    const { shippingAddress, userId } = req.body

    const existingOrder = await getOrderDB({ paymentIntent })

    if (existingOrder.length <= 0) {
      // after verification, creating order
      const order = (session && cart) ?
        await createOrderDB({
          paymentIntent,
          products: detailedLineItems,
          shippingAddress,
          userId,
          status: "pending",
          totalAmount: detailedLineItems.reduce(
            (sum, item) => sum + item.amount_total,
            0
          )
        }) : ""
      const user = await findUserById(userId)
      if (order) {
        const obj = {
          userName: user.fName + ' ' + user.lName,
          email: user.email,
          order,
        }
        await createOrderEmail(obj)
        console.log("email sent")
        console.log(obj)
      }
      return res.json({
        verified: session.payment_status === "paid",
        status: session.payment_status,
        session,
        order
      });
    } else {
      const order = existingOrder[0]
      return res.json({
        verified: session.payment_status === "paid",
        status: session.payment_status,
        session,
        order
      });
    }
  } catch (err) {
    res.status(400).json({
      verified: false,
      error: err.message,
    });
  }
};