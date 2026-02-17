"use client";
import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { ArrowLeftRight } from "lucide-react";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import NavHeader from "../components/NavHeader/NavHeader";
import { toast, Toaster } from "sonner";

// Coins and their supported networks
const coins = [
  { value: "btc", label: "Bitcoin", networks: ["Bitcoin"] },
  { value: "eth", label: "Ethereum", networks: ["Ethereum"] },
  { value: "usdt", label: "USDT", networks: ["Ethereum (ERC20)", "Tron (TRC20)", "Tron (BEP20)"] },
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
        const usdValue = amount * fromPrice;
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
    } catch (err) {
      setError(err.message);
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  }

  const toCoins = coins.filter((coin) => coin.value !== swapFrom);

  return (
    <div className="relative min-h-screen w-full">
      <Toaster richColors position="top-center" />
      {/* Gradient background covers the whole page */}
      <div className="fixed inset-0 bg-background" />
      <div className="relative z-10 min-h-screen flex flex-col overflow-auto">
        <NavHeader className="text-foreground" />
        <div className="flex flex-1 items-center justify-center px-2 sm:px-0">
          {/* Glow Effects */}
          <div className="absolute top-10 left-1/2 transform -translate-x-1/2 w-60 h-60 sm:w-[300px] sm:h-[300px] bg-primary/20 rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-4 sm:right-20 w-36 h-36 sm:w-[200px] sm:h-[200px] bg-primary/10 rounded-full blur-2xl" />

          <Card className="w-full max-w-xl sm:max-w-xl bg-card border border-border backdrop-blur-xl rounded-2xl shadow-xl shadow-primary/20 z-10 px-2 py-4 sm:px-8 sm:py-8">
            <CardHeader>
              <CardTitle className="text-center text-foreground text-xl sm:text-2xl font-bold tracking-tight">
                <span className="text-primary">
                  Swap Crypto Assets
                </span>
              </CardTitle>
            </CardHeader>

            <CardContent>
              <form onSubmit={handleSwap} className="space-y-6">
                {/* Swap From/To */}
                <div className="flex flex-col sm:flex-row gap-4 items-stretch">
                  <div className="flex-1">
                    <Label className="text-muted-foreground mb-1 block">From</Label>
                    <Select value={swapFrom} onValueChange={handleSwapFrom} required>
                      <SelectTrigger className="bg-card/50 text-foreground border border-border h-10 rounded-lg">
                        <SelectValue placeholder="Select coin" />
                      </SelectTrigger>
                      <SelectContent className="bg-black text-white border border-white/10">
                        {coins.map((coin) => (
                          <SelectItem key={coin.value} value={coin.value}>
                            {coin.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <Label className="text-xs text-muted-foreground mt-2 block">Network</Label>
                    <Select
                      value={swapFromNetwork}
                      onValueChange={setSwapFromNetwork}
                      disabled={!swapFrom}
                      required
                    >
                      <SelectTrigger className="bg-card/50 text-foreground border border-border mt-1 h-9 rounded-lg">
                        <SelectValue placeholder="Select network" />
                      </SelectTrigger>
                      <SelectContent className="bg-card text-foreground border border-border">
                        {getNetworks(swapFrom).map((net) => (
                          <SelectItem key={net} value={net}>
                            {net}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center justify-center py-2">
                    <div className="p-2 bg-primary text-primary-foreground rounded-full shadow-lg shadow-primary/25">
                      <ArrowLeftRight className="w-5 h-5" />
                    </div>
                  </div>

                  <div className="flex-1">
                    <Label className="text-muted-foreground mb-1 block">To</Label>
                    <Select value={swapTo} onValueChange={handleSwapTo} required>
                      <SelectTrigger className="bg-card/50 text-foreground border border-border h-10 rounded-lg">
                        <SelectValue placeholder="Select coin" />
                      </SelectTrigger>
                      <SelectContent className="bg-black text-white border border-white/10">
                        {toCoins.map((coin) => (
                          <SelectItem key={coin.value} value={coin.value}>
                            {coin.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <Label className="text-xs text-muted-foreground mt-2 block">Network</Label>
                    <Select
                      value={swapToNetwork}
                      onValueChange={setSwapToNetwork}
                      disabled={!swapTo}
                      required
                    >
                      <SelectTrigger className="bg-card/50 text-foreground border border-border mt-1 h-9 rounded-lg">
                        <SelectValue placeholder="Select network" />
                      </SelectTrigger>
                      <SelectContent className="bg-card text-foreground border border-border">
                        {getNetworks(swapTo).map((net) => (
                          <SelectItem key={net} value={net}>
                            {net}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Amount */}
                <div>
                  <Label className="text-sm text-muted-foreground mb-1 block">
                    Amount ({swapFrom ? coins.find(c => c.value === swapFrom)?.label : "Coin"})
                  </Label>
                  <Input
                    type="number"
                    value={amount}
                    onChange={handleAmountChange}
                    placeholder="Enter amount"
                    min="0"
                    step="any"
                    className="bg-card/50 text-foreground border border-border h-10 rounded-lg placeholder-muted-foreground"
                    required
                  />
                  <div className="w-full text-center mt-2 text-xs text-muted-foreground">
                    {priceLoading
                      ? "Loading..."
                      : equivalent && swapTo
                      ? `≈ ${equivalent} ${coins.find(c => c.value === swapTo)?.label}`
                      : ""}
                  </div>
                </div>

                {/* Submit */}
                <Button
                  type="submit"
                  className="w-full bg-primary text-primary-foreground font-semibold py-2 rounded-lg shadow-lg shadow-primary/25 hover:opacity-90 transition text-base disabled:opacity-50"
                  disabled={loading}
                >
                  {loading ? "Swapping..." : "Swap Coin"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
