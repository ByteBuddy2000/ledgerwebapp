import { NextResponse } from "next/server";
import { connectToDB } from "@/lib/connectDB";
import Withdraw from "@/models/Withdrawal";
import User from "@/models/User";

export async function GET() {
  try {
    await connectToDB();

    // Find all pending withdrawals and populate user info
    const withdrawals = await Withdraw.find({ status: "pending" })
      .populate("user", "username email avatar")
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({ success: true, withdrawals });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}