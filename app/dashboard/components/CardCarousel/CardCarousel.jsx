import axios from "axios";
import Link from "next/link";
import { BadgeCheck } from "lucide-react";
import { connectToDB } from "@/lib/connectDB";
import User from "@/models/User";
import UserAsset from "@/models/UserAsset";
import BalanceDisplay from "./BalanceDisplay";
import totalUserAssetBalance from "@/controllers/TotalUserAssetBalance";

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

export default async function CardCarousel({ userIdOrEmail, walletId = "0xABC123...DEF456" }) {
  const totalUsd = await totalUserAssetBalance(userIdOrEmail);

  const formattedBalance = Number(totalUsd).toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  const shortWallet = walletId?.slice(0, 6) + "..." + walletId?.slice(-4);

  return (
    <div className="w-full max-w-2xl mx-auto px-4 mb-12 relative">

      {/* 🌌 AURORA BACKGROUND */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute -top-24 -left-20 w-72 h-72 bg-primary/30 rounded-full blur-[120px] opacity-60 animate-pulse" />
        <div className="absolute -bottom-24 -right-20 w-72 h-72 bg-indigo-500/30 rounded-full blur-[120px] opacity-60 animate-pulse" />
      </div>

      {/* 🔥 Animated Gradient Border */}
      {/* 🔥 Gradient Border (No Rotation) */}
      <div className="relative rounded-3xl p-[1px] bg-gradient-to-r from-primary via-indigo-500 to-primary">

        <div className="rounded-3xl bg-card/80 backdrop-blur-2xl relative overflow-hidden shadow-2xl shadow-black/30 transition-all duration-500 hover:-translate-y-2 hover:shadow-primary/30">

          {/* Radial Light Highlight */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.12),transparent_40%)] pointer-events-none" />

          {/* Floating Glass Orb */}
          <div className="absolute top-10 right-10 w-32 h-32 bg-white/5 rounded-full blur-2xl" />

          {/* Verified Badge */}
          <div className="absolute top-6 right-6 flex items-center gap-2 text-xs sm:text-sm bg-white/5 text-green-500 px-4 py-1.5 rounded-full border border-primary/20 backdrop-blur-md shadow-md">
            <BadgeCheck size={16} />
            Verified Wallet
          </div>

          <div className="p-6 sm:p-8">

            {/* Wallet Info */}
            <div className="mb-6">
              <p className="text-xs uppercase tracking-widest text-muted-foreground/70">
                Wallet Address
              </p>
              <p className="mt-2 text-sm sm:text-base font-semibold text-foreground tracking-wide">
                {shortWallet}
              </p>
            </div>

            {/* 💎 Balance Section */}
            <div className="relative mb-10">
              <div className="absolute -inset-4 bg-gradient-to-r from-primary/10 via-indigo-500/10 to-primary/10 blur-xl opacity-70 rounded-2xl" />
              <div className="relative">
                <BalanceDisplay formattedBalance={formattedBalance} />
              </div>
            </div>

            {/* Divider */}
            <div className="h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent mb-8" />

            {/* CTA */}
            <div className="flex justify-center sm:justify-end">
              <Link
                href="/dashboard/transactions"
                className="group relative inline-flex items-center justify-center px-6 py-3 rounded-xl font-semibold text-sm text-white overflow-hidden transition-all duration-300 bg-gradient-to-r from-primary via-indigo-500 to-primary bg-[length:200%_200%] hover:bg-[position:100%_0%] shadow-lg shadow-primary/30"
              >
                <span className="relative z-10">View Transactions</span>
                <span className="absolute inset-0 bg-white/10 translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-500" />
              </Link>
            </div>

          </div>
        </div>
      </div>

    </div>
  );
}
