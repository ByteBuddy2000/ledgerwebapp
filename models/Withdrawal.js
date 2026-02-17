import mongoose from "mongoose";

const WithdrawSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    coin: { type: String, required: true },
    network: { type: String, required: true },
    amount: { type: Number, required: true },
    walletAddress: { type: String, required: true },
    status: { type: String, default: "pending" }, // pending | approved | rejected
  },
  { timestamps: true }
);

const Withdraw = mongoose.models.Withdraw || mongoose.model("Withdraw", WithdrawSchema);
export default Withdraw;
