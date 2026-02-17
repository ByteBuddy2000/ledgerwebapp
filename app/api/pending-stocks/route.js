import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import {connectToDB} from "@/lib/connectDB";
import User from "@/models/User";
import UserStock from "@/models/UserStock";

export async function GET() {
  await connectToDB();
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return NextResponse.json({ stocks: [], error: "Unauthorized" }, { status: 401 });
  }

  const user = await User.findOne({ email: session.user.email });
  if (!user) {
    return NextResponse.json({ stocks: [], error: "User not found" }, { status: 404 });
  }

  // Find all pending stocks for this user
  const stocks = await UserStock.find({ user: user._id, status: "pending" }).lean();

  return NextResponse.json({ stocks });
}