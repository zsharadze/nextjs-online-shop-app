import mongoose, { Schema } from "mongoose";

const promoCodeSchema = new Schema({
  promoCodeText: {
    required: true,
    unique: true,
    type: String,
  },
  isUsed: {
    required: true,
    type: Boolean,
  },
 createdDate: {
    required: true,
    type: Date,
    default: Date.now,
  },
  discount: {
    required: true,
    type: Number,
  },
  usedByUserEmail: {
    required: false,
    type: String,
  },
  usedOnOrderId: {
    type: Schema.Types.ObjectId,
    ref: "Order",
  },
});

export const PromoCode =
  mongoose.models?.PromoCode ?? mongoose.model("PromoCode", promoCodeSchema);
