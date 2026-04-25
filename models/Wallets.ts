import mongoose, { Schema } from "mongoose";

const Wallets = new Schema ({
  name: { type: String, required: true},
  balance: { type: Number, required: true, default: 0 },
  description: { type: String, required: false },
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  currencyId: {
    type: Schema.Types.ObjectId,
    ref: "Currencies",
    required: true
  }
}, { timestamps: true });

export default mongoose.models.Wallets || mongoose.model("Wallets", Wallets);