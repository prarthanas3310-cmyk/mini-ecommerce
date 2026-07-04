import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    items: [
      {
        product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
        name: String,
        quantity: Number,
        price: Number,
      },
    ],
    totalAmount: { type: Number, required: true },
    couponCode: { type: String },
    discountAmount: { type: Number, default: 0 },
    status: {
      type: String,
      enum: ["pending", "processing", "shipped", "delivered", "cancelled"],
      default: "pending",
    },
    shippingAddress: {
      address: String,
      city: String,
      postalCode: String,
      country: String,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Order", orderSchema);
