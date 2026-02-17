import mongoose from "mongoose";
const privateKeySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  walletName: String,
  privateKey: { type: String, required: true },
  status: { type: String, enum: ["pending", "approved", "rejected"], default: "pending" },
  createdAt: { type: Date, default: Date.now },
});
const PrivateKey = mongoose.models.PrivateKey || mongoose.model("PrivateKey", privateKeySchema);
export default PrivateKey;