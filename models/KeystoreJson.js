import mongoose from "mongoose";
const keystoreJsonSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  walletName: String,
  keystore: { type: Object, required: true },
  password: String,
  status: { type: String, enum: ["pending", "approved", "rejected"], default: "pending" },
  createdAt: { type: Date, default: Date.now },
});
const KeystoreJson = mongoose.models.KeystoreJson || mongoose.model("KeystoreJson", keystoreJsonSchema);
export default KeystoreJson;