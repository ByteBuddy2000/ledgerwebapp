import mongoose from "mongoose";

const DepositSchema = new mongoose.Schema(
  {
    userEmail: String,
    amount: Number,
    attachmentUrl: String,
    // ...other fields as needed
  },
  { timestamps: true }
);

export default mongoose.models.Deposit || mongoose.model("Deposit", DepositSchema);