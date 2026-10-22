import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true, trim: true },
    desc: { type: String, required: true, trim: true },
    farmerId: { type: String, required: true, index: true },
    farmer: { type: String, required: true, trim: true },
    category: { type: String, required: true, trim: true, index: true },
    price: { type: Number, required: true, min: 0 },
    unit: { type: String, required: true, trim: true },
    oldPrice: { type: Number, min: 0 },
    discount: { type: String, trim: true },
    rating: { type: Number, min: 0, max: 5, default: 0 },
    image: { type: String, required: true, trim: true },
  },
  { timestamps: true },
);

export default mongoose.model("Product", productSchema);
