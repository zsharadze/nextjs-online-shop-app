import mongoose, { Schema } from "mongoose";

const categorySchema = new Schema({
  name: {
    required: true,
    type: String,
  },
  imageName: {
    required: true,
    type: String,
  },
});

export const Category =
  mongoose.models?.Category ?? mongoose.model("Category", categorySchema);
