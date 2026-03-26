import { NextResponse } from "next/server";
import { connectToDB } from "@/lib/connectDB";
import Withdraw from "@/models/Withdrawal";
import Transaction from "@/models/Transaction";
import UserAsset from "@/models/UserAsset";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";

export async function POST(req) {
  try {
    await connectToDB();

    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { coin, network, amount, walletAddress } = body;

    if (!coin || !network || !amount || !walletAddress) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const User = (await import("@/models/User")).default;
    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // 1. Find the user's asset
    const userAsset = await UserAsset.findOne({ user: user._id, coin, network });
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
      user: user._id,
      coin,
      network,
      amount,
      walletAddress,
      status: "pending",
    });

    await newWithdrawal.save();

    const newTransaction = new Transaction({
      userId: user._id,
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
