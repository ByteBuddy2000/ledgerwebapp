import mongoose from "mongoose";

const walletSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    walletAddress: {
      type: String,
      required: true,
    },
    network: {
      type: String,
      default: "Unknown",
    },
  },
  { timestamps: true }
);

const Wallet = mongoose.models.Wallet || mongoose.model("Wallet", walletSchema);

export default Wallet;
