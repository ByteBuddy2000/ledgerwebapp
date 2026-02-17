import { NextResponse } from "next/server";

export async function GET() {
  const symbols = [
    "AAPL", // Apple
    "TSLA", // Tesla
    "GOOGL", // Alphabet (Google)
    "AMZN", // Amazon
    "MSFT", // Microsoft
    "META", // Meta Platforms (Facebook)
    "NVDA", // Nvidia
    "WMT", // Walmart
    "V", // Visa
    "MA", // Mastercard
    "BAC", // Bank of America
    "JPM", // JPMorgan Chase
    "DIS", // Disney
    "KO", // Coca-Cola
    "PEP", // PepsiCo
    "MCD", // McDonald's
    "SBUX" // Starbucks
  ];
  // add metals/commodities (common FX/commodity tickers)
  // Gold (XAUUSD), Silver (XAGUSD), Palladium (XPDUSD), Iridium (no standard ticker on Finnhub), Copper (XCUUSD)
  symbols.push("XAUUSD", "XAGUSD", "XPDUSD", "XCUUSD", "IRIDIUM");
  const symbolNames = {
    XAUUSD: "Gold (XAU/USD)",
    XAGUSD: "Silver (XAG/USD)",
    XPDUSD: "Palladium (XPD/USD)",
    XCUUSD: "Copper (XCU/USD)",
    IRIDIUM: "Iridium"
  };
  const commodityLogos = {
    XAUUSD: "/commodities/gold.svg",
    XAGUSD: "/commodities/silver.svg",
    XPDUSD: "/commodities/palladium.svg",
    XCUUSD: "/commodities/copper.svg",
    IRIDIUM: "/commodities/iridium.svg",
  };
  const apiKey = process.env.FINNHUB_KEY;
  const results = [];

  // commodity symbols we will mock with a light "real-time" fluctuation
  const commoditySet = new Set(["XAUUSD", "XAGUSD", "XPDUSD", "XCUUSD", "IRIDIUM"]);
  const basePrices = {
    XAUUSD: 1950.0,   // gold ~$1950/oz
    XAGUSD: 52.63,     // silver ~$24.5/oz
    XPDUSD: 1589.0,    // palladium ~$900/oz
    XCUUSD: 4.25,     // copper ~$4.25/lb (mock)
    IRIDIUM: 19.03,  // iridium (mock)
  };
  const vol = {
    XAUUSD: 6.0,
    XAGUSD: 0.6,
    XPDUSD: 15.0,
    XCUUSD: 0.08,
    IRIDIUM: 30.0,
  };

  for (const symbol of symbols) {
    // If this is a commodity we simulate a light real-time price instead of hitting external API
    if (commoditySet.has(symbol)) {
      // create a time-varying but deterministic-ish fluctuation
      const now = Date.now();
      // period controls speed of oscillation (ms)
      const period = 1000 * (30 + (symbol.length * 7)); // slightly different period per symbol
      const phase = Math.sin(now / period + symbol.length);
      // small random jitter (non-cryptographic)
      const jitter = (Math.sin(now / (period / 2) + symbol.charCodeAt(0)) + Math.cos(now / (period / 3))) * 0.5;
      const base = basePrices[symbol] || 100;
      const amplitude = vol[symbol] || 1;
      const price = Number((base + phase * amplitude + jitter * (amplitude * 0.08)).toFixed(4));
      // approximate previous price 1 minute ago for percent change
      const prevPhase = Math.sin((now - 60_000) / period + symbol.length);
      const prevJitter = (Math.sin((now - 60_000) / (period / 2) + symbol.charCodeAt(0)) + Math.cos((now - 60_000) / (period / 3))) * 0.5;
      const prevPrice = Number((base + prevPhase * amplitude + prevJitter * (amplitude * 0.08)).toFixed(4));
      const changePct = prevPrice > 0 ? Number((((price - prevPrice) / prevPrice) * 100).toFixed(2)) : 0;

      results.push({
        symbol,
        name: symbolNames[symbol] || symbol,
        price,
        change: changePct,
        logo: commodityLogos[symbol] || `/commodities/${symbol.toLowerCase()}.svg`,
      });

      continue;
    }

    // existing behavior for equities / non-mocked symbols
    try {
      const url = `https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${apiKey}`;
      const profileUrl = `https://finnhub.io/api/v1/stock/profile2?symbol=${symbol}&token=${apiKey}`;
      const [quoteRes, profileRes] = await Promise.all([
        fetch(url),
        fetch(profileUrl),
      ]);
      const quote = await quoteRes.json();
      const profile = await profileRes.json();

      results.push({
        symbol,
        name: profile.name || symbolNames[symbol] || symbol,
        price: quote?.c || 0,
        change: quote?.dp || 0,
        logo: profile?.logo || "",
      });
    } catch (err) {
      // on error, push a safe default
      results.push({
        symbol,
        name: symbolNames[symbol] || symbol,
        price: 0,
        change: 0,
        logo: commodityLogos[symbol] || "",
      });
    }
  }

  return NextResponse.json({ stocks: results });
}