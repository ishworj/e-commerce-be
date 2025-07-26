
import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2"

const OrderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
    products: [
      {
        _id: {
          type: mongoose.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        name: {
          type: String,
          required: true
        },
        quantity: {
          type: Number,
          required: true,
          min: 1,
        },
        price: {
          type: Number,
          min: 1
        },
        totalAmount: {
          type: Number,
          min: 1,
        },
        images: [String]

      },
    ],
    status: {
      type: String,
      enum: ["pending", "confirmed", "shipped", "delivered"],
    },
    totalAmount: {
      type: Number,
      required: true,
    },
    shippingAddress: {
      type: String,
    },
    expectedDeliveryDate: {
      type: Date
    },
    invoiceId: {
      type: mongoose.Types.ObjectId,
      ref: "Invoice"
    },
    paymentDetails: {
      id: String,
      amount: Number,
      status: String,
      client_secret: String,
      payment_method: String,
    },
  },
  { timestamps: true }
);

OrderSchema.plugin(mongoosePaginate)

OrderSchema.pre("save", function (next) {
  if (!this.expectedDeliveryDate) {
    const deliveryBufferDays = 5;
    const baseDate = this.createdAt || new Date();
    const expectedDate = new Date(baseDate);
    expectedDate.setDate(baseDate.getDate() + deliveryBufferDays)
    this.expectedDeliveryDate = expectedDate;
  }
  next()
})

export default mongoose.model("Order", OrderSchema);
