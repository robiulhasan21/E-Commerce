import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    // 🔹 User
    userId: { type: String, required: true },

    // 🔹 Order Info
    items: { type: Array, required: true },
    amount: { type: Number, required: true },
    address: { type: Object, required: true },

    // 🔹 Order Status
    status: {
      type: String,
      default: "Order Placed", // UI / Admin purpose
    },

    // 🔹 Payment
    payment: {
      type: Boolean,
      default: false, // true হলে paid
    },

    paymentMethod: {
      type: String,
      default: "COD", // COD / SSLCOMMERZ / BKASH
    },

    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed"],
      default: "pending",
    },

    transactionId: {
      type: String,
      unique: true,
      sparse: true, // COD order এ null allow করবে
    },

    // 🔹 Customer Info (SSLCommerz এর জন্য দরকার)
    customer: {
      name: String,
      email: String,
      phone: String,
    },

    // 🔹 Date
    date: {
      type: Date,
      default: Date.now,
    },
  },
  { minimize: false }
);

const orderModel =
  mongoose.models.order || mongoose.model("order", orderSchema);

export default orderModel;
