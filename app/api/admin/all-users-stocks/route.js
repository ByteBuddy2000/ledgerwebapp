import { connectToDB } from "@/lib/connectDB";
import User from "@/models/User";
import UserStock from "@/models/UserStock";

export async function GET(req) {
  await connectToDB();

  // List of all possible stock symbols (expanded to include commodities)
  const allSymbols = [
    "AAPL",
    "GOOGL",
    "MSFT",
    "TSLA",
    "AMZN",
    "NVDA",
    "META",
    "NFLX",
    "XOM",
    "JPM",
    "XAUUSD", // Gold
    "XAGUSD", // Silver
    "XPDUSD", // Palladium
    "XCUUSD", // Copper
    "IRIDIUM", // Iridium
  ];

  // Aggregate UserStock to compute current approved holdings per user per symbol.
  // Only documents with status === 'approved' represent assets the user currently owns.
  // Ignore pending buy/sell requests and sell request documents to avoid double-counting.
  const agg = await UserStock.aggregate([
    { $match: { status: "approved" } },
    {
      $project: {
        user: 1,
        symbol: 1,
        shares: { $ifNull: ["$shares", 0] },
      },
    },
    {
      $group: {
        _id: { user: "$user", symbol: "$symbol" },
        totalShares: { $sum: "$shares" },
      },
    },
    {
      $group: {
        _id: "$_id.user",
        stocks: { $push: { symbol: "$_id.symbol", shares: "$totalShares" } },
      },
    },
  ]);

  // Build a map userId -> { symbol: shares }
  const userStocksMap = {};
  for (const entry of agg) {
    const uid = String(entry._id);
    userStocksMap[uid] = {};
    for (const s of entry.stocks) {
      userStocksMap[uid][s.symbol] = s.shares;
    }
  }

  // Get all users
  const users = await User.find({}).lean();

  // Build result: include allSymbols, fill missing with 0
  const result = users.map((user) => {
    const stocksObj = userStocksMap[String(user._id)] || {};
    const stocksList = allSymbols.map((symbol) => ({
      symbol,
      shares: Number(stocksObj[symbol] || 0),
    }));

    return {
      id: String(user._id),
      name: user.username || user.name || user.email || "Unknown",
      email: user.email,
      avatar: user.avatar || "",
      stocks: stocksList,
    };
  });

  return Response.json({ users: result });
}
