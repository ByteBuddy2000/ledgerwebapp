"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState, use } from "react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import QRCode from "react-qr-code";
import { Copy, Check, ArrowRightLeft } from "lucide-react";

// Available coins
const SUPPORTED_COINS = ["BTC", "ETH", "USDT", "BNB", "SOL", "XRP", "DOGE"];

// Network & address maps (mock data)
const NETWORK_OPTIONS = [
  { label: "Mainnet", value: "Mainnet" },
  { label: "BNB Smart Chain (BEP20)", value: "BNB Smart Chain (BEP20)" },
  { label: "Ethereum", value: "Ethereum" },
  { label: "Polygon", value: "Polygon" },
];

const WALLET_ADDRESSES = {
  BTC: {
    Mainnet: "bc1q876w5vxqlpgzyyxzhxr24chalg5z74ztvp75dp",
  },
  ETH: {
    Mainnet: "0xfE09a5D6Cd24f4E6172627011b85866DE3fBf447",
  },
  USDT: {
    "ERC20": "0xfE09a5D6Cd24f4E6172627011b85866DE3fBf447",
    "TRC20": "TRr2kB36MdKnXanodWFyp5D9zub1tLxpCm",
  },
  // ...add other coins/networks as needed...
};

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

export default function AssetDetailPage({ params, userId }) {
  const resolvedParams = typeof params.then === "function" ? use(params) : params;
  const coin = resolvedParams.coin?.toUpperCase();

  const router = useRouter();
  const [asset, setAsset] = useState(null);
  const [loading, setLoading] = useState(true);
  const [action, setAction] = useState("send");

  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("");
  const [agree, setAgree] = useState(false);
  const [copied, setCopied] = useState(false);
  const [sending, setSending] = useState(false);

  const [swapFrom, setSwapFrom] = useState(coin);
  const [swapTo, setSwapTo] = useState("ETH");
  const [swapAmount, setSwapAmount] = useState("");
  const [estimated, setEstimated] = useState("");

  const [network, setNetwork] = useState(
    Object.keys(WALLET_ADDRESSES[coin] || {})[0] || ""
  );

  const walletAddress = WALLET_ADDRESSES[coin]?.[network] || "Not available";
  const baseSlug = coinSlugMap[coin] || coin.toLowerCase();

  useEffect(() => {
    async function fetchAsset() {
      setLoading(true);
      try {
        const res = await fetch(`/api/user-asset?coin=${coin}`);
        const data = await res.json();
        setAsset(data.asset);
      } catch {
        toast.error("Failed to load asset details.");
        setAsset(null);
      } finally {
        setLoading(false);
      }
    }

    fetchAsset();
  }, [coin]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!recipient || !amount || !agree) {
      return toast.error("Fill all send fields and the confirmation box");
    }
    if (!userId) {
      return toast.error("User not authenticated");
    }
    setSending(true);
    try {
      const res = await fetch("/api/withdraw", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          coin,
          network,
          amount: parseFloat(amount),
          walletAddress: recipient,
        }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        toast.success("Withdrawal is being processed!");
        setRecipient("");
        setAmount("");
        setAgree(false);
      } else {
        toast.error(data.error || "Withdrawal failed");
      }
    } catch (err) {
      toast.error("Something went wrong");
    } finally {
      setSending(false);
    }
  };

  const handleCopy = (address) => {
    navigator.clipboard.writeText(address);
    setCopied(true);
    toast.success("Address copied!");
    setTimeout(() => setCopied(false), 1500);
  };

  const handleSwap = (e) => {
    e.preventDefault();
    if (!swapFrom || !swapTo || !swapAmount || swapFrom === swapTo) {
      return toast.error("Invalid swap input");
    }
    toast.success(`Swapped ${swapAmount} ${swapFrom} → ${swapTo}`);
    setSwapAmount("");
    setEstimated("");
  };

  const simulateRate = () => {
    const rate = (Math.random() * 0.9 + 0.1).toFixed(4);
    const result = (parseFloat(swapAmount || 0) * rate).toFixed(4);
    setEstimated(result);
  };

  useEffect(() => {
    if (swapAmount) simulateRate();
  }, [swapAmount, swapFrom, swapTo]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-blue-400 text-lg font-mono">Loading {coin}...</p>
      </div>
    );
  }

  if (!asset) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-red-500 text-lg font-semibold">Asset not found.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-4 py-10 bg-gradient-to-br from-blue-950 via-slate-900 to-slate-950 flex justify-center">
      <div className="absolute top-4 left-4 md:top-6 md:left-6">
        <Button
          variant="ghost"
          className="text-blue-400 hover:text-white bg-slate-800 hover:bg-slate-700 border border-blue-700 rounded-full px-4 py-1 shadow-md"
          onClick={() => router.push("/dashboard")}
        >
          ← Back to Dashboard
        </Button>
      </div>

      <Card className="w-full max-w-xl bg-slate-900 border border-blue-800/30 rounded-2xl shadow-xl p-6">
        <CardHeader className="flex items-center gap-4 border-b border-blue-800/30 pb-4">
          <img
            src={`/cryptocoin/${baseSlug}.svg`}
            alt={coin}
            onError={(e) => (e.currentTarget.src = `/cryptocoin/${baseSlug}.png`)}
            className="w-14 h-14 rounded-full border border-blue-800 bg-slate-800 p-1"
          />
          <div>
            <h2 className="text-3xl font-bold text-blue-100 capitalize">{coin}</h2>
            <div className="mt-1 flex items-center gap-2">
              <Label className="text-blue-400 text-sm">Network:</Label>
              <select
                value={network}
                onChange={(e) => setNetwork(e.target.value)}
                className="bg-slate-800 text-blue-100 text-sm px-2 py-1 rounded border border-blue-800 focus:outline-none"
              >
                {NETWORK_OPTIONS.map((net) => (
                  <option key={net.value} value={net.value}>
                    {net.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </CardHeader>

        <CardContent className="mt-6 space-y-6">
          <div className="text-center">
            <p className="text-lg text-blue-200 font-medium">
              Balance:{" "}
              <span className="text-green-400 font-semibold">
                {asset.amount?.toFixed(2)} {coin}
              </span>
            </p>
            <p className="text-sm text-blue-400 mt-1">
              ≈ ${asset.usdValue?.toFixed(2).toLocaleString()}
            </p>
          </div>

          <div className="flex justify-center gap-3">
            {["send", "receive", "swap"].map((tab) => (
              <Button
                key={tab}
                onClick={() => setAction(tab)}
                className={`px-4 py-2 rounded-full shadow transition ${
                  action === tab
                    ? tab === "send"
                      ? "bg-green-600 text-white"
                      : tab === "receive"
                      ? "bg-blue-600 text-white"
                      : "bg-purple-600 text-white"
                    : "bg-slate-800 text-blue-300"
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </Button>
            ))}
          </div>

          {action === "send" && (
            <form onSubmit={handleSend} className="space-y-4">
              <div>
                <Label className="text-blue-300">Recipient Wallet</Label>
                <Input
                  value={recipient}
                  onChange={(e) => setRecipient(e.target.value)}
                  placeholder="e.g. 0xabc123..."
                  className="bg-slate-800 text-blue-100 border border-blue-700"
                />
              </div>
              <div>
                <Label className="text-blue-300">Amount ({coin})</Label>
                <Input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="e.g. 0.5"
                  className="bg-slate-800 text-blue-100 border border-blue-700"
                />
              </div>
              <div>
                <Label className="text-blue-300">Network</Label>
                <Input
                  value={network}
                  readOnly
                  className="bg-slate-800 text-blue-100 border border-blue-700"
                />
              </div>
              <div className="flex items-center gap-2">
                <Checkbox
                  id="agree"
                  checked={agree}
                  onCheckedChange={(val) => setAgree(val)}
                />
                <Label htmlFor="agree" className="text-blue-300">
                  I confirm this transfer
                </Label>
              </div>
              <Button
                type="submit"
                className="w-full bg-green-600 hover:bg-green-700 text-white rounded shadow"
                disabled={sending}
              >
                {sending ? "Sending..." : "Send Now"}
              </Button>
            </form>
          )}

          {action === "receive" && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-blue-200 mb-2">
                Deposit Addresses
              </h3>
              {WALLET_ADDRESSES[coin] ? (
                Object.entries(WALLET_ADDRESSES[coin]).map(([network, address]) => (
                  <div
                    key={network}
                    className="mb-6 bg-slate-800 border border-blue-700 px-4 py-3 rounded"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <p className="text-blue-300 text-sm mb-1">
                          {coin} <span className="text-blue-400">({network})</span>
                        </p>
                        <p className="text-blue-100 font-mono text-sm">{address}</p>
                      </div>
                      <button
                        onClick={() => handleCopy(address)}
                        className="text-blue-400 hover:text-blue-300"
                      >
                        {copied ? <Check size={20} /> : <Copy size={20} />}
                      </button>
                    </div>
                    <div className="flex justify-center">
                      <QRCode value={address} size={130} bgColor="#0f172a" fgColor="#3b82f6" />
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-red-400">No deposit address available for this coin.</div>
              )}
            </div>
          )}

          {action === "swap" && (
            <form onSubmit={handleSwap} className="space-y-4">
              <div className="flex gap-4">
                <div className="w-1/2">
                  <Label className="text-blue-300">From</Label>
                  <select
                    value={swapFrom}
                    onChange={(e) => setSwapFrom(e.target.value)}
                    className="w-full bg-slate-800 text-blue-100 border border-blue-700 rounded px-2 py-2"
                  >
                    {SUPPORTED_COINS.map((coin) => (
                      <option key={coin}>{coin}</option>
                    ))}
                  </select>
                </div>
                <div className="w-1/2">
                  <Label className="text-blue-300">To</Label>
                  <select
                    value={swapTo}
                    onChange={(e) => setSwapTo(e.target.value)}
                    className="w-full bg-slate-800 text-blue-100 border border-blue-700 rounded px-2 py-2"
                  >
                    {SUPPORTED_COINS.map((coin) =>
                      coin !== swapFrom ? <option key={coin}>{coin}</option> : null
                    )}
                  </select>
                </div>
              </div>
              <div>
                <Label className="text-blue-300">Amount ({swapFrom})</Label>
                <Input
                  value={swapAmount}
                  onChange={(e) => setSwapAmount(e.target.value)}
                  placeholder="e.g. 0.2"
                  type="number"
                  className="bg-slate-800 text-blue-100 border border-blue-700"
                />
              </div>
              {estimated && (
                <p className="text-sm text-blue-400">
                  ≈ You’ll get{" "}
                  <span className="text-purple-300 font-semibold">{estimated} {swapTo}</span>
                </p>
              )}
              <Button type="submit" className="w-full bg-purple-600 hover:bg-purple-700 text-white rounded shadow">
                Swap
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
