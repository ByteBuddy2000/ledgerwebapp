"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useRouter } from "next/navigation";

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
  XLM: "stellar"
};

export default function AssetSection() {
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function fetchAssets() {
      setLoading(true);
      try {
        const assetsRes = await fetch("/api/user-assets");
        const assetsData = await assetsRes.json();
        setAssets(assetsData.assets || []);
      } catch (error) {
        setAssets([]);
      } finally {
        setLoading(false);
      }
    }
    fetchAssets();
  }, []);

  const SkeletonCard = () => (
    <Card className="bg-card/50 backdrop-blur-md rounded-2xl animate-pulse border border-border p-6">
      <div className="h-5 w-24 bg-slate-300/30 rounded mb-4"></div>
      <div className="h-6 w-36 bg-slate-300/25 rounded mb-2"></div>
      <div className="h-4 w-20 bg-slate-300/20 rounded"></div>
      <div className="h-4 w-20 bg-slate-300/20 rounded"></div>
      <div className="h-4 w-20 bg-slate-300/20 rounded"></div>
      <div className="h-4 w-20 bg-slate-300/20 rounded"></div>
      <div className="h-4 w-20 bg-slate-300/20 rounded"></div>





    </Card>
  );

  const ChangeIndicator = ({ change }) => {
    if (change === undefined || change === null) return null;
    const isUp = change > 0;
    const colorClass = isUp ? "text-emerald-500" : change < 0 ? "text-red-500" : "text-muted-foreground";
    return (
      <span className={`ml-2 ${colorClass} font-semibold flex items-center gap-1`}>
        {isUp ? (
          <svg width="14" height="14" viewBox="0 0 20 20" fill="none" className="inline" aria-hidden="true">
            <path d="M10 4l5 8H5l5-8z" fill="currentColor" />
          </svg>
        ) : change < 0 ? (
          <svg width="14" height="14" viewBox="0 0 20 20" fill="none" className="inline" aria-hidden="true">
            <path d="M10 16l-5-8h10l-5 8z" fill="currentColor" />
          </svg>
        ) : (
          <span className="inline-block w-3 h-3" />
        )}
        <span>{isUp ? "+" : ""}{Math.abs(change).toFixed(2)}%</span>
      </span>
    );
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {loading ? (
        Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)
      ) : assets.length === 0 ? (
        <div className="col-span-full text-center py-8">
          <div className="bg-card border border-border rounded-2xl shadow-lg p-8 max-w-md mx-auto">
            <h3 className="text-xl font-bold text-foreground mb-2">No assets yet</h3>
            <p className="text-muted-foreground mb-4">
              Your wallet is empty. Once you deposit or receive crypto, your assets will appear here.
            </p>
            {/* <button
              className="bg-primary text-primary-foreground hover:opacity-90 font-semibold px-6 py-2 rounded transition shadow-lg shadow-primary/25"
              onClick={() => router.push("/dashboard")}
            >
              Top Up Now
            </button> */}

            <button
              className="bg-emerald-600 text-white hover:bg-emerald-700 font-semibold px-6 py-2 rounded transition shadow-md shadow-emerald-500/20"
              onClick={() => window.location.reload()}
            >
              Top Up Now
            </button>

          </div>
        </div>
      ) : (
        assets.map((asset) => {
          const coin = asset.coin;
          const baseSlug = coinSlugMap[coin.toUpperCase()];
          const priceChange = asset.priceChange24h ?? 0;

          return (
            <Card
              key={asset._id}
              className="bg-card border border-border backdrop-blur-md p-5 text-foreground rounded-2xl shadow-lg transition hover:shadow-xl hover:scale-[1.01] cursor-pointer"
              onClick={() => router.push(`/dashboard/Assets/${coin.toLowerCase()}`)}
            >
              <CardHeader className="flex items-center justify-between p-0 mb-3">
                <div className="flex items-center gap-3">
                  <img
                    src={`/cryptocoin/${baseSlug}.svg`}
                    alt={coin}
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = `/cryptocoin/${baseSlug}.png`;
                    }}
                    className="w-10 h-10 object-contain rounded-full border border-border shadow"
                  />
                  <div>
                    <h4 className="text-sm font-semibold flex items-center gap-2">
                      {coin}
                    </h4>
                    <p className="text-xs text-muted-foreground">
                      {asset.amount?.toFixed(4)} {coin}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Network: <span className="font-medium">{asset.network || "Mainnet"}</span>
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0 mt-2">
                <div className="flex items-center gap-2 mb-1">
                  <p className="text-xs text-muted-foreground">
                    1 {coin} = ${asset.price?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </p>
                  <ChangeIndicator change={priceChange} />
                </div>
                <p className="text-xl font-bold text-foreground">
                  ≈ ${asset.usdValue?.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </p>
              </CardContent>
            </Card>
          );
        })
      )}
    </div>
  );
}