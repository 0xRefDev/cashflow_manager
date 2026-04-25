import mongoose, { Schema } from "mongoose";

const Profile = new Schema({
  profile_photo: { type: String, required: false },
  occupation: { type: String, required: false },
  description: { type: String, required: false },
  country: { type: String, required: false },
  birthday: { type: Date, required: false },
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true,
  },
  reputationId: {
    type: Schema.Types.ObjectId,
    ref: "Reputation",
    default: null,
  },
}, { timestamps: true });

export default mongoose.models.Profile || mongoose.model("Profile", Profile);