import mongoose from 'mongoose';

const transactionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  type: { type: String, enum: ['deposit', 'withdrawal', 'stake', 'swap', 'reward'], required: true },
  amount: Number, // amount of fromCoin (for swap: amount swapped from)
  coin: String, // fromCoin (for swap)
  toCoin: String, // toCoin (for swap)
  fromNetwork: String, // added for swap
  toNetwork: String,   
  toAmount: Number,    // amount received in toCoin (for swap)
  txHash: String, // blockchain reference
  status: { type: String, enum: ['pending', 'confirmed', 'failed'], default: 'confirmed' },
  read: { type: Boolean, default: false }, // unread by default
  createdAt: { type: Date, default: Date.now }
});

const Transaction = mongoose.models.Transaction || mongoose.model('Transaction', transactionSchema);
export default Transaction;
