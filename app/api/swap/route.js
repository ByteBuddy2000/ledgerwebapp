import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import UserAsset from "@/models/UserAsset";
import { connectToDB } from "@/lib/connectDB";
import axios from "axios";
import Transaction from "@/models/Transaction";

const coinGeckoIds = {
  BTC: "bitcoin",
  ETH: "ethereum",
  USDT: "tether",
  BNB: "binancecoin",
  SOL: "solana",
  ADA: "cardano",
  XRP: "ripple",
  DOGE: "dogecoin",
  TRX: "tron",
  DOT: "polkadot",
  SHIB: "shiba-inu",
};

export async function POST(req) {
  await connectToDB();
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const { swapFrom, swapFromNetwork, swapTo, swapToNetwork, amount } = await req.json();
  if (!swapFrom || !swapFromNetwork || !swapTo || !swapToNetwork || !amount) {
    return Response.json({ error: "Invalid data" }, { status: 400 });
  }

  const User = (await import("@/models/User")).default;
  const user = await User.findOne({ email: session.user.email });
  if (!user) return Response.json({ error: "User not found" }, { status: 404 });

  // Get user's asset (by coin and network)
  const fromAsset = await UserAsset.findOne({
    userId: user._id,
    coin: swapFrom.toUpperCase(),
    network: swapFromNetwork,
  });
  if (!fromAsset || fromAsset.amount < amount) {
    return Response.json({ error: "Insufficient balance" }, { status: 400 });
  }

  // Use CoinGecko IDs for price fetch
  const fromId = coinGeckoIds[swapFrom.toUpperCase()];
  const toId = coinGeckoIds[swapTo.toUpperCase()];

  const res = await axios.get("https://api.coingecko.com/api/v3/simple/price", {
    params: {
      ids: `${fromId},${toId}`,
      vs_currencies: "usd",
    },
  });
  const fromPrice = res.data[fromId]?.usd;
  const toPrice = res.data[toId]?.usd;
  if (!fromPrice || !toPrice) return Response.json({ error: "Price fetch error" }, { status: 500 });

  // Calculate swap amount
  const usdValue = amount * fromPrice;
  const toAmount = usdValue / toPrice;

  // Update assets
  fromAsset.amount -= amount;
  await fromAsset.save();

  let toAsset = await UserAsset.findOne({
    userId: user._id,
    coin: swapTo.toUpperCase(),
    network: swapToNetwork,
  });
  if (!toAsset) {
    toAsset = new UserAsset({
      userId: user._id,
      coin: swapTo.toUpperCase(),
      network: swapToNetwork,
      amount: 0,
    });
  }
  toAsset.amount += toAmount;
  await toAsset.save();

  // Record transaction
  await Transaction.create({
    userId: user._id,
    type: "swap",
    amount: amount, // amount swapped from
    coin: swapFrom.toUpperCase(),
    toCoin: swapTo.toUpperCase(),
    fromNetwork: swapFromNetwork,
    toNetwork: swapToNetwork,
    timestamp: new Date(),
  });

  return Response.json({
    from: { coin: swapFrom, network: swapFromNetwork, amount: fromAsset.amount },
    to: { coin: swapTo, network: swapToNetwork, amount: toAsset.amount },
    swapped: toAmount,
  });
}