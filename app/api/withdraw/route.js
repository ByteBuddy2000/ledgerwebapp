import { NextResponse } from "next/server";
import { connectToDB } from "@/lib/connectDB";
import Withdraw from "@/models/Withdrawal";
import Transaction from "@/models/Transaction";
import UserAsset from "@/models/UserAsset"; // <-- Import UserAsset

export async function POST(req) {
  try {
    await connectToDB();

    const body = await req.json();
    const { userId, coin, network, amount, walletAddress } = body;

    if (!userId || !coin || !network || !amount || !walletAddress) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    // 1. Find the user's asset
    const userAsset = await UserAsset.findOne({ user: userId, coin, network });
    if (!userAsset) {
      return NextResponse.json({ error: "Asset not found" }, { status: 404 });
    }

    // 2. Check if user has enough balance
    if (userAsset.amount < amount) {
      return NextResponse.json({ error: "Insufficient balance" }, { status: 400 });
    }

    // 3. Deduct the amount
    userAsset.amount -= amount;
    await userAsset.save();

    // 4. Proceed with withdrawal and transaction creation
    const newWithdrawal = new Withdraw({
      user: userId,
      coin,
      network,
      amount,
      walletAddress,
      status: "pending",
    });

    await newWithdrawal.save();

    const newTransaction = new Transaction({
      userId,
      type: "withdrawal",
      amount,
      coin,
      fromNetwork: network,
      status: "pending",
    });
    await newTransaction.save();

    return NextResponse.json({ success: true, withdrawal: newWithdrawal });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
