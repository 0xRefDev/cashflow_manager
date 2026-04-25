import mongoose, { Schema } from "mongoose";

const Reputation = new Schema({
  name: { type: String, required: false },
  min_score: { type: Number, required: false },
  max_score: { type: Number, required: false },
}, { timestamps: true });

export default mongoose.models.Reputation || mongoose.model("Reputation", Reputation);