import mongoose, { Schema } from "mongoose";

const Preferences = new Schema({
  show_alerts: { type: Boolean, required: false, default: false },
  auto_report: { type: Boolean, required: false, default: true },
  mask_balance: { type: Boolean, required: false, default: false },
  spend_limit: { type: Number, required: false, default: 0 },
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true,
  },
}, { timestamps: true });

export default mongoose.models.Preferences || mongoose.model("Preferences", Preferences);