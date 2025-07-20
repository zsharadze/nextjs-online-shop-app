import mongoose, { Schema } from "mongoose";

const productImageSchema = new Schema({
  imageName: {
    required: true,
    type: String,
  },
});

export const ProductImage =
  mongoose.models?.ProductImage ??
  mongoose.model("ProductImage", productImageSchema);
