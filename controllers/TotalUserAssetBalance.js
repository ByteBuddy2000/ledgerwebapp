"use server"
import axios from "axios";
import { connectToDB } from "@/lib/connectDB";
import User from "@/models/User";
import UserAsset from "@/models/UserAsset";

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
};

export default async function totalUserAssetBalance(userIdOrEmail) {
  await connectToDB();

  // Find user by _id or email
  let user;
  if (typeof userIdOrEmail === "string" && userIdOrEmail.includes("@")) {
    user = await User.findOne({ email: userIdOrEmail });
  } else {
    user = await User.findById(userIdOrEmail);
  }
  if (!user) return 0;

  // Get all assets for user
  const assets = await UserAsset.find({ user: user._id });

  // Get all unique coins in uppercase
  const coins = [...new Set(assets.map(a => a.coin.toUpperCase()))];
  const ids = coins.map(c => coinSlugMap[c]).filter(Boolean).join(",");

  let prices = {};
  if (ids) {
    const res = await axios.get("https://api.coingecko.com/api/v3/simple/price", {
      params: {
        ids,
        vs_currencies: "usd",
      },
    });
    for (const coin of coins) {
      const slug = coinSlugMap[coin];
      prices[coin] = res.data[slug]?.usd ?? 0;
    }
  }

  // Calculate total USD value
  const total = assets.reduce((sum, asset) => {
    const coinUpper = asset.coin.toUpperCase();
    const price = prices[coinUpper] || 0;
    return sum + (asset.amount * price);
  }, 0);

  // Optionally update the user's balance field
  user.balance = total;
  await user.save();

  return total;
}