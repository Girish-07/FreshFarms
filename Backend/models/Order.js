import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    orderNumber: { type: String, required: true, unique: true, index: true },
    userId: { type: String, required: true, index: true },
    items: [
      {
        productId: { type: String, required: true },
        name: { type: String, required: true },
        image: { type: String, required: true },
        unitPrice: { type: Number, required: true, min: 0 },
        unit: { type: String, required: true },
        quantity: { type: Number, required: true, min: 1 },
        lineTotal: { type: Number, required: true, min: 0 },
      },
    ],
    deliveryAddress: {
      name: { type: String, required: true },
      phone: { type: String, required: true },
      address: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      pincode: { type: String, required: true },
      instructions: { type: String, default: "" },
    },
    subtotal: { type: Number, required: true, min: 0 },
    delivery: { type: Number, required: true, min: 0 },
    total: { type: Number, required: true, min: 0 },
    paymentMethod: { type: String, enum: ["cod"], default: "cod" },
    status: { type: String, enum: ["placed", "confirmed", "out-for-delivery", "delivered", "cancelled"], default: "placed" },
  },
  { timestamps: true },
);

export default mongoose.model("Order", orderSchema);
