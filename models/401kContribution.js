import mongoose from "mongoose";

const contributionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  amount: { type: Number, required: true },
  coin: { type: String, required: true },
  amountUsd: { type: Number, required: true }, // <-- Add this line!
  date: { type: Date, default: Date.now },
  source: { type: String, default: "main_balance" },
  status: { type: String, enum: ["pending", "confirmed", "failed"], default: "confirmed" },
});

const Contribution = mongoose.models.Contribution || mongoose.model("Contribution", contributionSchema);
export default Contribution;
