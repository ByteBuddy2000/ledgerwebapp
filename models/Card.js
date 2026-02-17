import mongoose from "mongoose";

const CardSchema = new mongoose.Schema({
  userID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  cardNumber: {
    type: String,
    required: true,
  },
  cardType: {
    type: String,
    enum: ["Mastercard", "Visa", "Verve"],
    required: true,
  },
  bankName: {
    type: String,
    required: true,
  },
  cardHolderName: {
    type: String,
    required: true,
  },
  expiryDate: {
    type: String,
    required: true,
  },
  cvv: {
    type: String,
    required: true,
  },
});

const Card = mongoose.models?.Card || mongoose.model("Card", CardSchema);
export default Card;