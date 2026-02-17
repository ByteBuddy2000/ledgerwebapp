import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { connectToDB } from "@/lib/connectDB";
import Transaction from "@/models/Transaction";
import UserStock from "@/models/UserStock";
import User from "@/models/User";

export async function POST() {
  await connectToDB();
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ success: false });
  }
  const user = await User.findOne({ email: session.user.email });
  if (!user) {
    return NextResponse.json({ success: false });
  }
  await Transaction.updateMany({ userId: user._id, read: false }, { $set: { read: true } });
  await UserStock.updateMany({ user: user._id, read: false }, { $set: { read: true } });
  return NextResponse.json({ success: true });
}
