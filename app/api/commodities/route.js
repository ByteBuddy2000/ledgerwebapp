import { NextResponse } from "next/server";

export async function GET() {
  const apiKey = process.env.FINNHUB_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "Missing FINNHUB_KEY" }, { status: 500 });
  }

  const symbols = [
    "XAUUSD", // Gold
    "XAGUSD", // Silver
    "XPDUSD", // Palladium
    "XCUUSD", // Copper
    "IRIDIUM", // fallback/custom (may not be available on Finnhub)
  ];

  const names = {
    XAUUSD: "Gold (XAU/USD)",
    XAGUSD: "Silver (XAG/USD)",
    XPDUSD: "Palladium (XPD/USD)",
    XCUUSD: "Copper (XCU/USD)",
    IRIDIUM: "Iridium",
  };

  const results = await Promise.all(
    symbols.map(async (sym) => {
      // If symbol looks non-standard (like IRIDIUM), attempt fetch but tolerate failures
      try {
        const url = `https://finnhub.io/api/v1/quote?symbol=${encodeURIComponent(sym)}&token=${apiKey}`;
        const res = await fetch(url);
        if (!res.ok) {
          return { symbol: sym, name: names[sym] || sym, price: null, change: null, error: `fetch ${res.status}` };
        }
        const quote = await res.json();
        // quote.c = current price, quote.dp = percent change
        return {
          symbol: sym,
          name: names[sym] || sym,
          price: typeof quote.c === "number" ? quote.c : null,
          change: typeof quote.dp === "number" ? quote.dp : null,
        };
      } catch (err) {
        return { symbol: sym, name: names[sym] || sym, price: null, change: null, error: String(err) };
      }
    })
  );

  return NextResponse.json({ commodities: results });
}
