import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  images: { type: Array, required: true },
  category: { type: String, required: true },
  type: { type: String, required: true },
  sizes: { type: Array, required: true },
  bestseller: { type: Boolean, default: false },
  date: { type: Number, default: Date.now },
});

const productModel = mongoose.models.product || mongoose.model("product", productSchema);
export default productModel;
