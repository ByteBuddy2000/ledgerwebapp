import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import UserAsset from "@/models/UserAsset";
import { connectToDB } from "@/lib/connectDB";
import axios from "axios";
import Transaction from "@/models/Transaction";
import mongoose from "mongoose";

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

const DECIMAL_PRECISION = 8;

function round(value, decimals = DECIMAL_PRECISION) {
  return parseFloat(Number(value).toFixed(decimals));
}

export async function POST(req) {
  await connectToDB();

  // 1. Auth check
  const session = await getServerSession(authOptions);
  if (!session?.user?.email)
    return Response.json({ error: "Unauthorized" }, { status: 401 });

  // 2. Parse & validate body
  let body;
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "Invalid request body" }, { status: 400 });
  }

  const { swapFrom, swapFromNetwork, swapTo, swapToNetwork } = body;
  const amount = Number(body.amount); // explicit cast

  if (
    !swapFrom ||
    !swapFromNetwork ||
    !swapTo ||
    !swapToNetwork ||
    isNaN(amount) ||
    amount <= 0
  ) {
    return Response.json({ error: "Invalid data" }, { status: 400 });
  }

  // 3. Prevent swapping to the same coin
  if (swapFrom.toUpperCase() === swapTo.toUpperCase()) {
    return Response.json({ error: "Cannot swap a coin with itself" }, { status: 400 });
  }

  const dbSession = await mongoose.startSession();
  dbSession.startTransaction();

  try {
    const User = (await import("@/models/User")).default;
    const user = await User.findOne({ email: session.user.email }).session(dbSession);
    if (!user) {
      await dbSession.abortTransaction();
      return Response.json({ error: "User not found" }, { status: 404 });
    }

    // 4. Check source asset & balance
    const fromAsset = await UserAsset.findOne({
      user: user._id,
      coin: swapFrom.toUpperCase(),
      network: swapFromNetwork,
    }).session(dbSession);

    if (!fromAsset || fromAsset.amount < amount) {
      await dbSession.abortTransaction();
      return Response.json({ error: "Insufficient balance" }, { status: 400 });
    }

    // 5. Fetch prices from CoinGecko
    const fromId = coinGeckoIds[swapFrom.toUpperCase()];
    const toId = coinGeckoIds[swapTo.toUpperCase()];

    if (!fromId || !toId) {
      await dbSession.abortTransaction();
      return Response.json({ error: "Unsupported coin" }, { status: 400 });
    }

    let fromPrice, toPrice;
    try {
      const priceRes = await axios.get(
        "https://api.coingecko.com/api/v3/simple/price",
        { params: { ids: `${fromId},${toId}`, vs_currencies: "usd" } }
      );
      fromPrice = priceRes.data[fromId]?.usd;
      toPrice = priceRes.data[toId]?.usd;
    } catch {
      await dbSession.abortTransaction();
      return Response.json({ error: "Failed to fetch prices. Try again." }, { status: 503 });
    }

    if (!fromPrice || !toPrice) {
      await dbSession.abortTransaction();
      return Response.json({ error: "Price data unavailable" }, { status: 500 });
    }

    // 6. Calculate swap with precision
    const usdValue = amount * fromPrice;
    const toAmount = round(usdValue / toPrice);

    // 7. Atomic asset updates
    fromAsset.amount = round(fromAsset.amount - amount);
    await fromAsset.save({ session: dbSession });

    let toAsset = await UserAsset.findOne({
      user: user._id,
      coin: swapTo.toUpperCase(),
      network: swapToNetwork,
    }).session(dbSession);

    if (!toAsset) {
      toAsset = new UserAsset({
        user: user._id,
        coin: swapTo.toUpperCase(),
        network: swapToNetwork,
        amount: 0,
      });
    }
    toAsset.amount = round(toAsset.amount + toAmount);
    await toAsset.save({ session: dbSession });

    // 8. Record transaction inside same session
    await Transaction.create(
      [
        {
          userId: user._id,
          type: "swap",
          amount,
          coin: swapFrom.toUpperCase(),
          toCoin: swapTo.toUpperCase(),
          fromNetwork: swapFromNetwork,
          toNetwork: swapToNetwork,
          toAmount,
          timestamp: new Date(),
        },
      ],
      { session: dbSession }
    );

    await dbSession.commitTransaction();

    return Response.json({
      from: { coin: swapFrom, network: swapFromNetwork, amount: fromAsset.amount },
      to: { coin: swapTo, network: swapToNetwork, amount: toAsset.amount },
      swapped: toAmount,
    });
  } catch (err) {
    await dbSession.abortTransaction();
    console.error("[SWAP ERROR]", err);
    return Response.json({ error: "Something went wrong" }, { status: 500 });
  } finally {
    dbSession.endSession();
  }
}
