"use server";

import { connectToDB } from "@/lib/connectDB";
import Transaction from "@/models/Transaction";

export async function getTransactionsByUserId(userId) {
  if (!userId) return [];

  await connectToDB();

  // Fetch the latest 4 transactions for the user, selecting common fields
  const transactions = await Transaction.find({ user: userId })
    .select(
      "type amount coin toCoin fromNetwork toNetwork toAmount txHash status read createdAt userId"
    )
    .sort({ createdAt: -1 })
    .limit(4)
    .lean();

  // Safely convert ObjectIds to strings and normalize date to ISO string
  transactions.forEach((transaction) => {
    if (transaction._id) transaction._id = transaction._id.toString();
    if (transaction.userId) transaction.userId = transaction.userId.toString();

    const srcDate =
      transaction.date instanceof Date
        ? transaction.date
        : transaction.createdAt instanceof Date
        ? transaction.createdAt
        : transaction.date;

    transaction.date = srcDate instanceof Date ? srcDate.toISOString() : srcDate;
  });

  return transactions;
}