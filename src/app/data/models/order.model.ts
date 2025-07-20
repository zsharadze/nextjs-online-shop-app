import { OrderStatuses } from "@/app/shared/order-statuses";
import mongoose, { Schema } from "mongoose";

const orderSchema = new Schema({
  createdDate: {
    required: true,
    type: Date,
  },
  status: {
    required: true,
    type: String,
    enum: OrderStatuses,
    default: "Pending",
  },
  subtotal: {
    required: true,
    type: Number,
  },
  subtotalWithPromo: {
    required: false,
    type: Number,
  },
  userId: { type: Schema.Types.ObjectId, ref: "User" },
  orderItems: [
    {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "OrderItem",
    },
  ],
  promoCode: {
    type: Schema.Types.ObjectId,
    required: false,
    ref: "PromoCode",
  },
});

export const Order =
  mongoose.models?.Order ?? mongoose.model("Order", orderSchema);
