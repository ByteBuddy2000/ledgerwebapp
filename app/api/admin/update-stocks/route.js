import { NextResponse } from "next/server";
import { connectToDB } from "@/lib/connectDB";
import UserStock from "@/models/UserStock";

export async function POST(req) {
  await connectToDB();
  try {
    const { userId, stocks } = await req.json();
    if (!userId || !Array.isArray(stocks)) {
      return NextResponse.json({ success: false, error: "Missing userId or stocks" }, { status: 400 });
    }
    // Remove all existing stocks for user
    await UserStock.deleteMany({ user: userId });
    // Add new stocks
    const newStocks = stocks
      .filter(s => s.shares > 0)
      .map(s => ({
        user: userId,
        symbol: s.symbol,
        shares: s.shares,
        price: s.price || 0,
  status: "approved",
      }));
    if (newStocks.length > 0) {
      await UserStock.insertMany(newStocks);
    }
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
