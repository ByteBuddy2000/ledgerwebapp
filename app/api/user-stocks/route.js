import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { connectToDB } from "@/lib/connectDB";
import UserStock from "@/models/UserStock";
import User from "@/models/User";


// ================= GET (Fetch stocks for user or admin) ==================
export async function GET(request) {
  try {
    await connectToDB();
    const url = new URL(request.url);
    const approved = url.searchParams.get("approved");
    const all = url.searchParams.get("all");
    const search = url.searchParams.get("search");

    if (approved === "true" || all === "true") {
      // Return stocks for the logged-in user
      const session = await getServerSession(authOptions);
      if (!session?.user?.email) {
        return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
      }

      const user = await User.findOne({ email: session.user.email });
      if (!user) {
        return NextResponse.json({ success: false, error: "User not found" }, { status: 404 });
      }

      let query = { user: user._id };
      if (approved === "true") query.status = "approved";

      const stocks = await UserStock.find(query).lean();
      return NextResponse.json({ success: true, stocks });
    } else {
      // Return pending buy/sell requests for admin
      let query = { status: { $in: ["pending", "pending-sell"] } };
      if (search) {
        query.$or = [
          { symbol: { $regex: search, $options: "i" } },
          { xrpAddress: { $regex: search, $options: "i" } },
        ];
      }

      const stocks = await UserStock.find(query).populate("user", "username email").lean();
      return NextResponse.json({ success: true, stocks });
    }
  } catch (err) {
    console.error(err);
    return NextResponse.json({ success: false, error: err.message || "Server error" }, { status: 500 });
  }
}


// ================= PATCH (Approve Sell or Buy Requests) ==================
export async function PATCH(request) {
  try {
    await connectToDB();
    const { stockId, action } = await request.json();

    // Find the stock request
    const stock = await UserStock.findById(stockId).populate("user");
    if (!stock) {
      return NextResponse.json({ success: false, error: "Stock not found" }, { status: 404 });
    }

    const user = await User.findById(stock.user._id);
    if (!user) {
      return NextResponse.json({ success: false, error: "User not found" }, { status: 404 });
    }

    // ===== Handle Approvals =====
    if (action === "approve-sell") {
      // Only allow if it's a pending sell
      if (stock.status !== "pending-sell") {
        return NextResponse.json({ success: false, error: "Invalid sell request" }, { status: 400 });
      }

      // Calculate total sale value
      const saleValue = stock.shares * stock.price;

      // Update user balance (e.g., USDT or cash balance)
      if (!user.balances || user.balances.length === 0) {
        return NextResponse.json({ success: false, error: "User has no balances set up" }, { status: 400 });
      }

      // Find the fiat or USDT balance
      const usdtBalance = user.balances.find(b => b.symbol === "USDT");
      if (usdtBalance) {
        usdtBalance.amount += saleValue;
      } else {
        user.balances.push({ symbol: "USDT", amount: saleValue });
      }

      // Update stock info
      stock.status = "sold";
      stock.processedShares = stock.shares;

      await stock.save();
      await user.save();

      return NextResponse.json({ success: true, message: "Sell approved and balance updated" });
    }

    // ===== Handle Approve Buy =====
    if (action === "approve-buy") {
      if (stock.status !== "pending") {
        return NextResponse.json({ success: false, error: "Invalid buy request" }, { status: 400 });
      }

      stock.status = "approved";
      await stock.save();

      return NextResponse.json({ success: true, message: "Buy approved successfully" });
    }

    return NextResponse.json({ success: false, error: "Invalid action" }, { status: 400 });
  } catch (err) {
    console.error("Error approving stock:", err);
    return NextResponse.json({ success: false, error: err.message || "Server error" }, { status: 500 });
  }
}
