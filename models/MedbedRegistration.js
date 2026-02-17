import mongoose from "mongoose";

const MedbedRegistrationSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, required: true },
    address: { type: String, required: true },
    color: { type: String, required: true },
    feeUsd: { type: Number, required: true, default: 10000 },
    amountXrp: { type: Number, required: true },
    receiverAddress: { type: String },
    status: {
      type: String,
      enum: ["pending_payment", "paid", "cancelled"],
      default: "pending_payment",
    },
    txHash: { type: String, default: "" },
    paidAt: { type: Date },
    adminApproved: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

const MedbedRegistration =
  mongoose.models.MedbedRegistration ||
  mongoose.model("MedbedRegistration", MedbedRegistrationSchema);

export default MedbedRegistration;
