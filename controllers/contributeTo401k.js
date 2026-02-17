'use server';

import User from "@/models/User";
import UserAsset from "@/models/UserAsset";
import Contribution from "@/models/401kContribution"; // <-- Fix import name
import { connectToDB } from "@/lib/connectDB";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import axios from "axios";

export async function contributeTo401k({ amount, coin }) {
  await connectToDB();
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return { success: false, error: "Unauthorized" };
  }

  if (!amount || amount <= 0 || !coin) {
    return { success: false, error: "Invalid data" };
  }

  const user = await User.findOne({ email: session.user.email });
  if (!user) {
    return { success: false, error: "User not found" };
  }

  const asset = await UserAsset.findOne({ user: user._id, coin: coin.toUpperCase() });
  if (!asset || asset.amount < amount) {
    return { success: false, error: "Insufficient asset balance" };
  }

  // Fetch USD price for the coin
  const coinSlugMap = {
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
  const slug = coinSlugMap[coin.toUpperCase()];
  let priceUsd = 0;
  if (slug) {
    const res = await axios.get("https://api.coingecko.com/api/v3/simple/price", {
      params: { ids: slug, vs_currencies: "usd" },
    });
    priceUsd = res.data[slug]?.usd ?? 0;
  }
  const amountUsd = priceUsd * amount;

  asset.amount -= amount;
  await asset.save();

  user._401kBalance = (user._401kBalance || 0) + amount;
  await user.save();

  await Contribution.create({
    userId: user._id,
    amount,
    coin: coin.toUpperCase(),
    amountUsd, // store USD value
    status: "confirmed",
    source: coin.toUpperCase(),
    date: new Date(),
  });

  return {
    success: true,
    newAssetBalance: asset.amount,
    new401kBalance: user._401kBalance,
  };
}