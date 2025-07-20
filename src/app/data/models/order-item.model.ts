import mongoose, { Schema } from "mongoose";

const orderItemSchema = new Schema({
  quantity: {
    required: true,
    type: Number,
  },
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
  },
});

export const OrderItem =
  mongoose.models?.OrderItem ?? mongoose.model("OrderItem", orderItemSchema);
