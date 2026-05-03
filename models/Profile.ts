import mongoose, { Schema } from "mongoose";

const Profile = new Schema({
  profile_photo: { type: String, required: false, default: "default_preset" },
  occupation: { type: String, required: false, default: "" },
  description: { type: String, required: false, default: "" },
  country: { type: String, required: false, default: "" },
  birthday: { type: Date, required: false, default: "" },
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true,
  },
  reputationId: {
    type: Schema.Types.ObjectId,
    ref: "Reputation",
    default: "",
  },
}, { timestamps: true });

export default mongoose.models.Profile || mongoose.model("Profile", Profile);