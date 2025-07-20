import mongoose, { Schema } from "mongoose";

const productSchema = new Schema({
  name: {
    required: true,
    type: String,
  },
  category: { type: Schema.Types.ObjectId, ref: "Category" },
  description: {
    required: true,
    type: String,
  },
  price: {
    required: true,
    type: Number,
  },
  imageName: {
    required: true,
    type: String,
  },
  createdDate: {
    required: true,
    type: Date,
    default: Date.now,
  },
  images: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "ProductImage",
      },
    ],
});

export const Product =
  mongoose.models?.Product ?? mongoose.model("Product", productSchema);
