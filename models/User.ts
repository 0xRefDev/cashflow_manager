import mongoose, { Schema } from "mongoose";

const User = new Schema({
  fullname: { type: String, required: true },
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  hashedPassword: { type: String, required: true },
  gender: { type: String, enum: ["male", "female", ""], default: "" },
  verified: { type: Boolean, default: false },
  completedSetup: { type: Boolean, default: false },
  status: {
    type: String,
    enum: ["active", "suspended", "deleted"],
    default: "active",
  },
  preferencesId: { type: Schema.Types.ObjectId, ref: "Preferences" },
  profileId: { type: Schema.Types.ObjectId, ref: "Profile" },
  walletId: { type: Schema.Types.ObjectId, ref: "Wallets" },
  movementsId: { type: [Schema.Types.ObjectId], ref: "Movements" },

}, { timestamps: true });

export default mongoose.models.User || mongoose.model("User", User);