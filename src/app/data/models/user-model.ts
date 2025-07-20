import { findUserByEmail } from "@/app/services/auth.service";
import mongoose, { Schema } from "mongoose";

const userSchema = new Schema({
  password: {
    required: true,
    type: String,
  },
  email: {
    required: true,
    unique: true,
    type: String,
    validate: validateEmail,
  },
  role: {
    required: true,
    type: String,
  },
});

export const User = mongoose.models?.User ?? mongoose.model("User", userSchema);

async function validateEmail(email: string) {
  const user = await findUserByEmail(email);
  if (user)
    throw new Error("A user is already registered with this email address.");
}
