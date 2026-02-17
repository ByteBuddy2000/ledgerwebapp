import { NextResponse } from "next/server";

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

export async function GET() {
  try {
    const ids = Object.values(coinSlugMap).join(",");
    const res = await fetch(
      `https://api.coingecko.com/api/v3/simple/price?ids=${ids}&vs_currencies=usd&include_24hr_change=true`
    );

    if (!res.ok) {
      return NextResponse.json({ error: "Failed to fetch" }, { status: 500 });
    }

    const data = await res.json();
    const priceMap = {};

    for (const [coin, slug] of Object.entries(coinSlugMap)) {
      const info = data[slug];
      priceMap[coin] = {
        price: info?.usd ?? 0,
        change: info?.usd_24h_change ?? 0,
      };
    }

    return NextResponse.json(priceMap);
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}