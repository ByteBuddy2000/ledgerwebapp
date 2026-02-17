import mongoose from "mongoose";

const PasswordResetSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    email: { type: String, required: true },
    token: { type: String, required: true, unique: true },
    expiresAt: { type: Date, required: true },
    used: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const PasswordReset =
  mongoose.models.PasswordReset || mongoose.model("PasswordReset", PasswordResetSchema);

export default PasswordReset;

