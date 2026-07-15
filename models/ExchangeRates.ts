import mongoose, { Schema } from "mongoose";

const ExchangeRates = new Schema({
  base: { type: String, required: true, default: "USD" },
  rates: { type: Schema.Types.Mixed, required: true },
  fetchedAt: { type: Date, required: true },
}, { timestamps: true });

ExchangeRates.index({ base: 1 }, { unique: true });

export default mongoose.models.ExchangeRates || mongoose.model("ExchangeRates", ExchangeRates);
