import mongoose from "mongoose";

const UserStockSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    symbol: { type: String, required: true },
    shares: { type: Number, required: true, default: 0 },
    price: { type: Number, required: true },
  status: { type: String, default: "pending" },
  // For sell requests, how many shares the admin processed (approved as sold)
  processedShares: { type: Number, default: 0 },
    read: { type: Boolean, default: false }, // unread by default
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export default mongoose.models.UserStock || mongoose.model("UserStock", UserStockSchema);