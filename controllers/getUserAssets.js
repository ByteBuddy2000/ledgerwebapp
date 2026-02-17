"use server";

import axios from "axios";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import UserAsset from "@/models/UserAsset";
import { connectToDB } from "@/lib/connectDB";

// Coin slug map
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
  XLM: "stellar",
};

export default async function getUserAssets() {
  await connectToDB();

  const session = await getServerSession(authOptions);

  // Always return consistent structure
  if (!session?.user?.email) {
    return { totalUsd: 0, assets: [] };
  }

  const User = (await import("@/models/User")).default;

  const user = await User.findOne({ email: session.user.email });

  if (!user) {
    return { totalUsd: 0, assets: [] };
  }

  // Correct field: user (NOT userId)
  const rawAssets = await UserAsset.find({
    user: user._id,
  }).lean();

  if (!rawAssets.length) {
    return { totalUsd: 0, assets: [] };
  }

  // Get unique coins
  const coins = [...new Set(rawAssets.map(a => a.coin.toUpperCase()))];

  const ids = coins
    .map(c => coinSlugMap[c])
    .filter(Boolean)
    .join(",");

  let prices = {};

  if (ids) {
    const res = await axios.get(
      "https://api.coingecko.com/api/v3/simple/price",
      {
        params: {
          ids,
          vs_currencies: "usd",
          include_24hr_change: "true",
        },
      }
    );

    for (const coin of coins) {
      const slug = coinSlugMap[coin];
      prices[coin] = {
        usd: res.data[slug]?.usd ?? 0,
        change: res.data[slug]?.usd_24h_change ?? 0,
      };
    }
  }

  let totalUsd = 0;

  const assets = rawAssets.map(asset => {
    const coinUpper = asset.coin.toUpperCase();
    const price = prices[coinUpper]?.usd || 0;
    const priceChange24h = prices[coinUpper]?.change || 0;
    const usdValue = asset.amount * price;

    totalUsd += usdValue;

    return {
      _id: asset._id.toString(),
      userId: asset.user.toString(), // clean + correct
      coin: asset.coin,
      network: asset.network,
      amount: asset.amount,
      price,
      priceChange24h,
      usdValue,
      createdAt: asset.createdAt?.toISOString(),
      updatedAt: asset.updatedAt?.toISOString(),
    };
  });

  return {
    totalUsd,
    assets,
  };
}
