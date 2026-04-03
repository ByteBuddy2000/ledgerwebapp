"use client";
import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { ArrowLeftRight, RefreshCw, ChevronLeft } from "lucide-react";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import NavHeader from "../components/NavHeader/NavHeader";
import { toast, Toaster } from "sonner";
import Link from "next/link";

// Coins and their supported networks
const coins = [
  { value: "btc", label: "Bitcoin", networks: ["Mainnet"] },
  { value: "eth", label: "Ethereum", networks: ["Mainnet"] },
  { value: "usdt", label: "USDT", networks: ["ERC20", "TRC20", "BEP20"] },
  { value: "bnb", label: "BNB", networks: ["BNB Smart Chain (BEP20)"] },
  { value: "sol", label: "Solana", networks: ["Solana"] },
  { value: "ada", label: "Cardano", networks: ["Cardano"] },
  { value: "xrp", label: "Ripple", networks: ["Ripple"] },
  { value: "doge", label: "Dogecoin", networks: ["Dogecoin"] },
  { value: "trx", label: "TRX", networks: ["Tron"] },
  { value: "dot", label: "Polkadot", networks: ["Polkadot"] },
  { value: "shib", label: "SHIB", networks: ["Ethereum"] },
];

// CoinGecko mappings
const coinGeckoIds = {
  btc: "bitcoin",
  eth: "ethereum",
  usdt: "tether",
  bnb: "binancecoin",
  sol: "solana",
  ada: "cardano",
  xrp: "ripple",
  doge: "dogecoin",
  trx: "tron",
  dot: "polkadot",
  shib: "shiba-inu",
};

export default function Page() {
  const [swapFrom, setSwapFrom] = useState("");
  const [swapFromNetwork, setSwapFromNetwork] = useState("");
  const [swapTo, setSwapTo] = useState("");
  const [swapToNetwork, setSwapToNetwork] = useState("");
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [equivalent, setEquivalent] = useState("");
  const [priceLoading, setPriceLoading] = useState(false);

  const getNetworks = (coinValue) =>
    coins.find((c) => c.value === coinValue)?.networks || [];

  async function fetchEquivalentAmount(amount, from, to) {
    if (!amount || !from || !to) return setEquivalent("");
    setPriceLoading(true);
    try {
      const res = await fetch(
        `https://api.coingecko.com/api/v3/simple/price?ids=${coinGeckoIds[from]},${coinGeckoIds[to]}&vs_currencies=usd`
      );
      const data = await res.json();
      const fromPrice = data[coinGeckoIds[from]]?.usd;
      const toPrice = data[coinGeckoIds[to]]?.usd;
      if (fromPrice && toPrice) {
        const usdValue = parseFloat(amount) * fromPrice;
        const toAmount = usdValue / toPrice;
        setEquivalent(toAmount.toFixed(8));
      } else {
        setEquivalent("");
      }
    } catch {
      setEquivalent("");
    } finally {
      setPriceLoading(false);
    }
  }

  const handleAmountChange = (e) => {
    setAmount(e.target.value);
    fetchEquivalentAmount(e.target.value, swapFrom, swapTo);
  };

  const handleSwapFrom = (val) => {
    setSwapFrom(val);
    setSwapFromNetwork("");
    if (swapTo === val) {
      setSwapTo("");
      setSwapToNetwork("");
      setEquivalent("");
    } else {
      fetchEquivalentAmount(amount, val, swapTo);
    }
  };

  const handleSwapTo = (val) => {
    setSwapTo(val);
    setSwapToNetwork("");
    fetchEquivalentAmount(amount, swapFrom, val);
  };

  const handleSwapCoins = () => {
    const tempFrom = swapFrom;
    const tempFromNet = swapFromNetwork;
    setSwapFrom(swapTo);
    setSwapFromNetwork(swapToNetwork);
    setSwapTo(tempFrom);
    setSwapToNetwork(tempFromNet);
    fetchEquivalentAmount(amount, swapTo, tempFrom);
  };

  async function handleSwap(e) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setResult(null);

    try {
      const res = await fetch("/api/swap", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          swapFrom,
          swapFromNetwork,
          swapTo,
          swapToNetwork,
          amount: Number(amount),
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Swap failed");
      setResult(data);
      toast.success("✅ Swap successful!");
      // Reset form after success
      setAmount("");
      setEquivalent("");
    } catch (err) {
      setError(err.message);
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (amount && swapFrom && swapTo) {
      fetchEquivalentAmount(amount, swapFrom, swapTo);
    }
  }, [swapFrom, swapTo]);

  const toCoins = coins.filter((coin) => coin.value !== swapFrom);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black text-white pb-8">
      <Toaster richColors position="top-center" />
      <div className="max-w-2xl mx-auto py-10 px-4 sm:px-8">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md px-4 py-4 sm:px-6 sm:py-5 shadow-lg">

            {/* Top Row */}
            <div className="flex items-center justify-between gap-3">
              {/* Back */}
              <Link href="/dashboard">
                <Button
                  variant="ghost"
                  className="h-10 w-10 rounded-xl p-0 text-white hover:bg-white/10"
                >
                  <ChevronLeft className="h-5 w-5" />
                </Button>
              </Link>

              {/* Title */}
              <div className="flex-1 text-center">
                <h2 className="text-lg sm:text-xl md:text-2xl font-bold tracking-tight text-white">
                  Swap Crypto Assets
                </h2>
                <p className="text-xs sm:text-sm text-white/60">
                  Exchange tokens instantly
                </p>
              </div>

              {/* Buy CTA */}
              <Link href="/dashboard/buy">
                <div className="rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 px-4 py-2 text-sm font-semibold text-white shadow-md hover:scale-105 transition-transform">
                  Buy
                </div>
              </Link>
            </div>
          </div>
        </div>

        {/* Swap Form Card */}
        <Card className="bg-slate-900 border border-slate-800 shadow-xl rounded-2xl">
          <CardHeader>
            <CardTitle className="text-blue-400 text-lg">Instantly Exchange Your Cryptocurrencies</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSwap} className="space-y-6">
              {/* Swap From */}
              <div className="space-y-2">
                <Label className="font-medium text-blue-300 text-lg">From</Label>
                <Select value={swapFrom} onValueChange={handleSwapFrom} required>
                  <SelectTrigger className="bg-slate-800 text-white border border-slate-700 rounded-lg h-12 hover:bg-slate-700 transition-colors">
                    <SelectValue placeholder="Select coin" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 text-white border border-slate-700">
                    {coins.map((coin) => (
                      <SelectItem key={coin.value} value={coin.value} className="hover:bg-slate-700">
                        {coin.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select
                  value={swapFromNetwork}
                  onValueChange={setSwapFromNetwork}
                  disabled={!swapFrom}
                  required
                >
                  <SelectTrigger className="bg-slate-800 text-white border border-slate-700 rounded-lg h-10 hover:bg-slate-700 transition-colors">
                    <SelectValue placeholder="Select network" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 text-white border border-slate-700">
                    {getNetworks(swapFrom).map((net) => (
                      <SelectItem key={net} value={net} className="hover:bg-slate-700">
                        {net}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Swap Icon */}
              <div className="flex justify-center">
                <button
                  type="button"
                  onClick={handleSwapCoins}
                  className="p-3 bg-gradient-to-r from-blue-600 to-violet-600 rounded-full shadow-lg hover:from-blue-700 hover:to-violet-700 transition-all duration-300 transform hover:scale-110"
                  disabled={!swapFrom || !swapTo}
                >
                  <ArrowLeftRight className="w-6 h-6 text-white" />
                </button>
              </div>

              {/* Swap To */}
              <div className="space-y-2">
                <Label className="font-medium text-blue-300 text-lg">To</Label>
                <Select value={swapTo} onValueChange={handleSwapTo} required>
                  <SelectTrigger className="bg-slate-800 text-white border border-slate-700 rounded-lg h-12 hover:bg-slate-700 transition-colors">
                    <SelectValue placeholder="Select coin" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 text-white border border-slate-700">
                    {toCoins.map((coin) => (
                      <SelectItem key={coin.value} value={coin.value} className="hover:bg-slate-700">
                        {coin.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select
                  value={swapToNetwork}
                  onValueChange={setSwapToNetwork}
                  disabled={!swapTo}
                  required
                >
                  <SelectTrigger className="bg-slate-800 text-white border border-slate-700 rounded-lg h-10 hover:bg-slate-700 transition-colors">
                    <SelectValue placeholder="Select network" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 text-white border border-slate-700">
                    {getNetworks(swapTo).map((net) => (
                      <SelectItem key={net} value={net} className="hover:bg-slate-700">
                        {net}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Amount */}
              <div className="space-y-2">
                <Label className="font-medium text-blue-300 text-lg">
                  Amount ({swapFrom ? coins.find(c => c.value === swapFrom)?.label : "Coin"})
                </Label>
                <Input
                  type="number"
                  value={amount}
                  onChange={handleAmountChange}
                  placeholder="Enter amount"
                  min="0"
                  step="any"
                  className="bg-slate-800 text-white border border-slate-700 rounded-lg h-12 placeholder-gray-400 focus:border-blue-400 transition-colors"
                  required
                />
                <div className="text-center text-sm text-gray-300">
                  {priceLoading ? (
                    <RefreshCw className="w-4 h-4 animate-spin mx-auto" />
                  ) : equivalent && swapTo ? (
                    `≈ ${equivalent} ${coins.find(c => c.value === swapTo)?.label}`
                  ) : (
                    ""
                  )}
                </div>
              </div>

              {/* Submit */}
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-700 hover:to-violet-700 text-white font-semibold py-3 rounded-lg shadow transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={loading || !swapFrom || !swapTo || !amount}
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <RefreshCw className="w-5 h-5 animate-spin mr-2" />
                    Swapping...
                  </div>
                ) : (
                  "Swap Now"
                )}
              </Button>
            </form>

            {result && (
              <div className="mt-6 p-4 bg-green-500/20 border border-green-500/30 rounded-xl">
                <h3 className="text-green-300 font-semibold mb-2">Swap Successful!</h3>
                <p className="text-gray-300 text-sm">
                  Swapped {result.swapped.toFixed(8)} {result.to.coin} on {result.to.network}
                </p>
                <p className="text-gray-300 text-sm">
                  Remaining {result.from.coin}: {result.from.amount.toFixed(8)}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
