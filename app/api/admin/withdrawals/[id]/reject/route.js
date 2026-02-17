import { NextResponse } from "next/server";
import { connectToDB } from "@/lib/connectDB";
import Withdraw from "@/models/Withdrawal";
import Transaction from "@/models/Transaction";
import UserAsset from "@/models/UserAsset";

export async function POST(req, { params }) {
  try {
    await connectToDB();
    const { id } = params;

    // Update withdrawal status
    const withdrawal = await Withdraw.findByIdAndUpdate(
      id,
      { status: "rejected" },
      { new: true }
    );

    if (!withdrawal) {
      return NextResponse.json({ success: false, error: "Withdrawal not found" }, { status: 404 });
    }

    // Refund the amount to the user's asset balance
    await UserAsset.findOneAndUpdate(
      {
        user: withdrawal.user,
        coin: withdrawal.coin,
        network: withdrawal.network,
      },
      { $inc: { amount: withdrawal.amount } }
    );

    // Optionally, update related transaction status
    await Transaction.findOneAndUpdate(
      {
        userId: withdrawal.user,
        type: "withdrawal",
        coin: withdrawal.coin,
        fromNetwork: withdrawal.network,
        amount: withdrawal.amount,
        status: "pending",
      },
      { status: "failed" }
    );

    return NextResponse.json({ success: true, withdrawal });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}