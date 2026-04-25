import mongoose, { Schema } from "mongoose";

const Currencies = new Schema({
  name: { type: String, required: true },
  symbol: { type: String, required: true },
}, { timestamps: true });

export default mongoose.models.Currencies || mongoose.model("Currencies", Currencies);