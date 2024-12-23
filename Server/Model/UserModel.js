import mongoose from "mongoose";
import { dateAndTimeGenerate } from "../Helpers/generateDateAndTime.js";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  password: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  username: { type: String, required: true, unique: true },

  isAccountVerified: { type: Boolean, default: false },
  accountVerificationOTP: { type: String, default: "" },
  accountVerificationOTPExpireAt: { type: Number, default: 0 },
  passwordResetOTP: { type: String, default: "" },
  passwordResetOTPExpireAt: { type: Number, default: 0 },

  accountCreatedAt: { type: String, default: dateAndTimeGenerate() },
  accountLastLogin: { type: String, default: "" },
  accountUpdatedAt: { type: String, default: "" },
});

const User = new mongoose.model("User", userSchema);
export default User;
