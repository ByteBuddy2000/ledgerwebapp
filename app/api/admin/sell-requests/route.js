import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { connectToDB } from "@/lib/connectDB";
import UserStock from "@/models/UserStock";
import User from "@/models/User";

export async function GET() {
  try {
    await connectToDB();
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }
    // adjust this check to match your auth schema
    if (!session.user.isAdmin && session.user.role !== "admin") {
      return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 });
    }

    const sellStatuses = ["pending-sell", "sell_pending", "pending-sell-request"];
    const sells = await UserStock.find({ status: { $in: sellStatuses } })
      .populate("user", "username email avatar")
      .lean();

    return NextResponse.json({ success: true, sells });
  } catch (err) {
    console.error("GET /api/admin/sell-requests error:", err);
    return NextResponse.json({ success: false, error: "Server error" }, { status: 500 });
  }
}



