import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { connectToDB } from "@/lib/connectDB";
import User from "@/models/User";
import UserStock from "@/models/UserStock";

export async function POST(req) {
  await connectToDB();
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const user = await User.findOne({ email: session.user.email });
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const { symbol, shares, price } = await req.json();
  if (!symbol || !shares || !price) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  // Save purchase with pending status
  const stock = await UserStock.create({
    user: user._id,
    symbol,
    shares,
    price,
    status: "pending", // <-- Add this line
  });

  return NextResponse.json({ success: true, stock });
}