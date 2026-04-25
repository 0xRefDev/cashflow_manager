import mongoose, { Schema } from "mongoose";

const OtpCode = new Schema({
  email: { type: String, required: true },
  code: { type: String, required: true },
  expiresAt: { type: Date, required: true },
  used: { type: Boolean, default: false },
}, { timestamps: true });

OtpCode.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export default mongoose.models.OtpCode || mongoose.model("OtpCode", OtpCode);
