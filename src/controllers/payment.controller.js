import Stripe from "stripe";
import { findCart } from "../models/cart/cart.model.js";
import { createOrderDB, getOrderDB, updateOrderDB } from "../models/orders/order.model.js";
import { findUserById } from "../models/users/user.model.js";
import { createOrderEmail } from "../services/email.service.js";
import { getSingleProduct, updateProductDB } from "../models/products/product.model.js";
import ProductSchema from "../models/products/product.schema.js";
import { generateRandomInvoiceNumber } from "./invoice.controller.js";
import { createInvoice, getInvoice } from "../models/invoices/invoices.model.js";
import { generateInvoice } from "../services/generateInvoice.js";
import { streamToBuffer } from "../utils/streamToBuffer.js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const origin = process.env.ROOT_URL + "/payment-result"

export const makePayment = async (req, res, next) => {
  try {
    // const origin = req.headers.origin;
    const user = req.userData;
    const cart = await findCart(user._id);
    console.log(cart)
    if (!cart || cart.cartItems.length === 0) {
      return res.status(400).json({ status: "error", message: "Cart is empty" });
    }
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
        unit_amount: Math.round(item.price * 100),
      },
      quantity: item.quantity,
    }));

    // Creates the checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items,
      customer_email: user.email,
      mode: "payment",
      // success_url:
      //   "http://localhost:5173/payment-result?success=true&session_id={CHECKOUT_SESSION_ID}",
      // cancel_url:
      //   "http://localhost:5173/payment-result?success=false&session_id={CHECKOUT_SESSION_ID}",

      success_url: `${origin}?success=true&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}?success=false&session_id={CHECKOUT_SESSION_ID}`,
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
  if (!session_id) {
    return res.status(400).json({
      verified: false,
      error: "No session_id",
    });
  }

  let detailedLineItems = []
  let orderVerified = false
  try {
    const session = await stripe.checkout.sessions.retrieve(session_id);

    if (session.payment_status !== "paid") {
      return res.status(400).json({
        verified: false,
        error: "Payment not completed",
      });
    }

    const cart = await stripe.checkout.sessions.listLineItems(session_id);
    if (!cart || cart.data.length === 0) {
      return res.status(400).json({
        verified: false,
        error: "No cart items found in Stripe session.",
      });
    }

    const paymentIntent = session.payment_intent
    if (!paymentIntent) {
      return res.status(400).json({
        verified: false,
        error: "Missing paymentIntent. Payment failed or incomplete.",
      });
    }

    detailedLineItems = await Promise.all(
      cart.data.map(async item => {
        const price = await stripe.prices.retrieve(item.price.id);
        const product = await stripe.products.retrieve(price.product);

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

    if (!detailedLineItems.length) {
      return res.status(400).json({
        verified: false,
        error: "No products found in Stripe line items. Cannot proceed with order.",
      });
    }

    const { shippingAddress, userId } = req.body

    // Stock update block: fail early and refund if stock issue
    for (let i of detailedLineItems) {
      const product = await getSingleProduct(i._id)

      if (!product) {
        return res.status(400).json({ status: "error", message: `Product not found in DB.` });
      }

      const updateProduct = await ProductSchema.findOneAndUpdate(
        { _id: product._id, stock: { $gte: i.quantity } },
        { $inc: { stock: -i.quantity } },
        { new: true }
      )
      console.log(updateProduct, i.quantity)

      if (!updateProduct) {
        // Safe refund in case of insufficient stock
        try {
          const refund = await stripe.refunds.create({ payment_intent: paymentIntent });
          return res.status(400).json({
            status: "error",
            message: `${product.name} is out of stock. Payment refunded.`,
            refund,
          });
        } catch (refundError) {
          return res.status(500).json({
            status: "error",
            message: `Refund failed for ${product.name}. Please contact support.`,
            error: refundError.message,
            verified: false
          });
        }
      }

      if (updateProduct.stock <= 0) {
        await updateProductDB(updateProduct._id, { status: "inactive" })
      }
    }

    // Avoid duplicate order creation
    const existingOrder = await getOrderDB({ paymentIntent })

    if (existingOrder.length > 0) {
      return res.json({
        verified: session.payment_status === "paid",
        status: session.payment_status,
        session,
        order: existingOrder[0],
      });
    }

    const order = await createOrderDB({
      paymentIntent,
      products: detailedLineItems,
      shippingAddress,
      userId,
      status: "pending",
      totalAmount: detailedLineItems.reduce(
        (sum, item) => sum + item.amount_total,
        0
      )
    })

    //  Email Confirmation
    const user = await findUserById(userId)

    //  also we are missing the invoice to send to the email to the user

    const invoiceNumber = generateRandomInvoiceNumber();
    const existingInvoice = await getInvoice({ orderId: order._id });

    let invoiceRecord = existingInvoice;

    if (!existingInvoice) {
      // Create and store the invoice in DB
      invoiceRecord = await createInvoice({
        invoiceNumber,
        orderId: order._id,
        userId,
        userName: `${user.fName} ${user.lName}`,
        totalAmount: order.totalAmount,
        shippingAddress: order.shippingAddress,
        taxAmount: 0,
        status: "paid",
        products: order.products.map(key => ({
          id: key.id,
          name: key.name,
          quantity: key.quantity,
          amount_total: key.amount_total,
          productImages: key.productImages || []
        })),
        notes: order.notes || ""
      });

      await updateOrderDB(order._id, { invoiceId: invoiceRecord._id });
    }

    // Generate the PDF stream for email
    const invoiceStream = await generateInvoice(order, invoiceRecord.invoiceNumber);
    const invoiceBuffer = await streamToBuffer(invoiceStream);

    // Send confirmation email with PDF invoice
    await createOrderEmail({
      userName: `${user.fName} ${user.lName}`,
      email: user.email,
      order,
      attachments: [
        {
          filename: `invoice_${invoiceRecord.invoiceNumber}.pdf`,
          content: invoiceBuffer,
        },
      ],
    });
    orderVerified = true
    return res.json({
      verified: true,
      status: session.payment_status,
      message: "Verified!",
      session,
      order
    });

  } catch (err) {
    console.error("Error in verifyPaymentSession:", err.message);
    return res.status(400).json({
      verified: false,
      error: err.message
    });

  } finally {
    if (!orderVerified && detailedLineItems.length) {
      (async () => {
        for (let i of detailedLineItems) {
          const product = await getSingleProduct(i._id);
          if (!product) continue;

          await ProductSchema.findOneAndUpdate(
            { _id: product._id },
            { $inc: { stock: i.quantity } },
            { new: true }
          );
        }
      })().catch(console.error);
    }
  }
}