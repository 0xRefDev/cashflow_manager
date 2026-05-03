import mongoose, { Schema } from "mongoose";
import { TRANSACTION_CATEGORIES } from "@/lib/schemas";

const Movements = new Schema({
  title: { type: String, required: true },
  quantity: { type: Number, required: true },
  description: { type: String, required: false },
  category: { type: String, enum: [...TRANSACTION_CATEGORIES], required: false },
  date: { type: Date, required: true },
  type: {
    type: String,
    enum: ["income", "expense"],
    required: true
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  walletId: {
    type: Schema.Types.ObjectId,
    ref: "Wallets",
    required: true,
  }
}, { timestamps: true });

Movements.index({ userId: 1, date: -1 });
Movements.index({ userId: 1, walletId: 1 });

export default mongoose.models.Movements || mongoose.model("Movements", Movements);