import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { connectToDB } from "@/lib/connectDB";
import Transaction from "@/models/Transaction";
import UserStock from "@/models/UserStock";
import User from "@/models/User";

export async function GET() {
  await connectToDB();
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ success: false, count: 0 });
  }
  const user = await User.findOne({ email: session.user.email });
  if (!user) {
    return NextResponse.json({ success: false, count: 0 });
  }
  // Count all unread transactions (received, sent, etc.) and stocks
  const unreadTxCount = await Transaction.countDocuments({ userId: user._id, read: false });
  const unreadStockCount = await UserStock.countDocuments({ user: user._id, read: false });
  const count = unreadTxCount + unreadStockCount;
  return NextResponse.json({ success: true, count });
}
