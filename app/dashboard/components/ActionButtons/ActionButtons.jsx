"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowDownToLine,
  Coins,
  Send,
  WalletCards,
  Briefcase,
  ShieldAlert,
  LineChart,
  Copy,
  X,
  Download,
  Camera,
} from "lucide-react";
import { toast } from "sonner";

import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { QrCode } from "lucide-react";

// 🔧 Define action buttons (added Stocks)
const actions = [
  { label: "Deposit", modal: "deposit", icon: <Send size={20} /> },
  { label: "Withdrawal", modal: "withdrawal", icon: <ArrowDownToLine size={20} /> },
  // { label: "Medbed", modal: null, icon: <ShieldAlert size={20} /> },
  { label: "Buy", modal: null, icon: <WalletCards size={20} /> },
  { label: "Stocks", modal: null, icon: <LineChart size={20} /> },
  { label: "401k", modal: null, icon: <Briefcase size={20} /> },
  { label: "FBI", modal: null, icon: <ShieldAlert size={20} /> },
];

// Framer Motion configs
const overlayVariants = { hidden: { opacity: 0 }, visible: { opacity: 1 } };
const modalVariants = { hidden: { opacity: 0, y: 80 }, visible: { opacity: 1, y: 0 } };

// 🌟 Reusable Modal Container
function ModalTemplate({ title, onClose, children }) {
  return (
    <motion.div className="fixed inset-0 z-[9999] flex items-center justify-center" initial="hidden" animate="visible" exit="hidden" variants={overlayVariants}>
      <motion.div className="absolute inset-0 bg-black/60 backdrop-blur-lg" onClick={onClose} />
      <motion.div
        className="relative w-full max-w-md bg-card rounded-xl text-foreground p-6 z-[10000] border border-border shadow-xl"
        variants={modalVariants}
        transition={{ type: "spring", duration: 0.5 }}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold">{title}</h2>
          <button onClick={onClose} className="text-primary text-2xl font-bold hover:opacity-80 transition">&times;</button>
        </div>
        {children}
      </motion.div>
    </motion.div>
  );
}

// QR display modal — clean, centered, with copy/download/close actions
function QRModal({ address, coinLabel, onClose }) {
  if (!address) return null;
  return (
    <motion.div className="fixed inset-0 z-[11000] flex items-center justify-center" initial="hidden" animate="visible" exit="hidden" variants={overlayVariants}>
      <motion.div className="absolute inset-0 bg-black/70 backdrop-blur-lg" onClick={onClose} />
      <motion.div className="relative w-full max-w-sm bg-card rounded-xl text-foreground p-6 z-[11001] border border-border shadow-2xl" variants={modalVariants} transition={{ type: "spring", duration: 0.4 }}>
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold">{coinLabel || "Wallet"} QR</h3>
            <p className="text-xs text-muted-foreground">Scan to pay or copy the wallet address</p>
          </div>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
            <X size={18} />
          </button>
        </div>

        <div className="flex flex-col items-center gap-4">
          <img
            src={`https://api.qrserver.com/v1/create-qr-code/?size=360x360&data=${encodeURIComponent(address)}`}
            alt="QR Code"
            className="w-56 h-56 bg-white p-2 rounded-lg shadow"
          />

          <div className="w-full break-words font-mono text-sm bg-card/50 p-2 rounded border border-border text-foreground text-center">{address}</div>

          <div className="flex w-full gap-3">
            <button
              onClick={() => navigator.clipboard.writeText(address)}
              className="flex-1 inline-flex items-center justify-center gap-2 bg-emerald-600 text-white px-4 py-2 rounded hover:bg-emerald-700 transition shadow-md"
            >
              <Copy size={14} /> Copy
            </button>
            <a
              href={`https://api.qrserver.com/v1/create-qr-code/?size=1024x1024&data=${encodeURIComponent(address)}`}
              download={`qr-${(coinLabel || 'address').toLowerCase()}.png`}
              className="inline-flex items-center justify-center gap-2 bg-slate-700 text-white px-4 py-2 rounded hover:opacity-90 transition shadow-md"
            >
              <Download size={14} /> Download
            </a>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}


function DepositModal({ onClose }) {
  const [coin, setCoin] = useState("");
  const [copied, setCopied] = useState(false);
  const [showQr, setShowQr] = useState(false);

  const walletAddresses = {
    btc: "bc1q876w5vxqlpgzyyxzhxr24chalg5z74ztvp75dp",
    eth: "0x31BE775B5d5a50cD5CD836259d01e24B49Ffba59",
    sol: "GEFptDeX4rQ8VQnu81SYo9WNzRy1eW9QGVdrUFRuUFaU",
    usdt: "TYmXXdWdQRzWTgPXekEm39dn4JYPF17YsQ",
    usdterc20: "0xfE09a5D6Cd24f4E6172627011b85866DE3fBf447",
    dogecoin: "DKiWstDHyr6TwESum3CDH4Fv32ofcrG47f",
    xrp: "rNHfEgGojzE3PgVAVyXtKqhqnQAZFm4LUF",
    xlm: "GCWUIWLUNNIFPQIVW2D52LOUAN46Y55SSHL24XJJQHC5QMWXL2GJHDR6",
    bnb: "0x31BE775B5d5a50cD5CD836259d01e24B49Ffba59",
    ton: "UQC1djCVIwrMWMh842RolJcOHw9l6xsBylvnQQNTepjucMrf",
    ada: "addr1qyz8t6r4vws3qewwnh2jvzptzgg8mdsed45pgjqayuh29h378hfut3gqyrul8uccr3z76mk097hqktewsvds7jr8j2pqv2yg4z",
    tron: "TYmXXdWdQRzWTgPXekEm39dn4JYPF17YsQ"
  };

  const cryptoOptions = [
    { value: "btc", label: "Bitcoin" },
    { value: "eth", label: "Ethereum" },
    { value: "sol", label: "Solana" },
    { value: "usdt", label: "USDT (TRC20)" },
    { value: "usdterc20", label: "USDT (ERC20)" },
    { value: "dogecoin", label: "Dogecoin" },
    { value: "xrp", label: "XRP" },
    { value: "xlm", label: "Stellar" },
    { value: "bnb", label: "Binance Coin" },
    { value: "ton", label: "Ton Coin" },
    { value: "ada", label: "Cardano" },
    { value: "tron", label: "Tron" }
  ];

  const address = walletAddresses[coin];

  // ✅ COPY FUNCTION (bulletproof)
  const handleCopy = async (text) => {
    if (!text) return;

    try {
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(text);
      } else {
        const textarea = document.createElement("textarea");
        textarea.value = text;
        textarea.style.position = "fixed";
        document.body.appendChild(textarea);
        textarea.focus();
        textarea.select();
        document.execCommand("copy");
        document.body.removeChild(textarea);
      }

      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Copy failed:", err);
    }
  };

  return (
    <>
      <ModalTemplate title="Deposit Funds" onClose={onClose}>
        <div className="space-y-6 text-sm">

          {/* Select Coin */}
          <div>
            <label className="block mb-2 text-xs uppercase tracking-wider text-muted-foreground">
              Choose Crypto
            </label>

            <select
              onChange={(e) => setCoin(e.target.value)}
              className="w-full bg-card/70 backdrop-blur-md border border-border rounded-xl px-3 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-primary transition"
            >
              <option value="">Select coin</option>
              {cryptoOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          {/* Address Section */}
          {coin && address && (
            <div className="relative p-5 rounded-2xl border border-border bg-card/60 backdrop-blur-xl shadow-lg transition-all duration-300 animate-in fade-in slide-in-from-bottom-3">

              {/* Soft Glow */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/10 to-indigo-500/10 blur-xl opacity-40 pointer-events-none" />

              <div className="relative space-y-4">
                <p className="font-medium text-foreground">
                  Send{" "}
                  <strong>
                    {cryptoOptions.find(o => o.value === coin)?.label}
                  </strong>{" "}
                  to this address:
                </p>

                {/* Address Box */}
                <div className="bg-background/50 border border-border rounded-xl p-3 font-mono text-xs break-all">
                  {address}
                </div>

                {/* Buttons */}
                <div className="flex gap-3 flex-wrap">

                  <button
                    onClick={() => handleCopy(address)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-medium transition-all shadow ${copied
                        ? "bg-emerald-600 text-white scale-105"
                        : "bg-primary text-primary-foreground hover:opacity-90"
                      }`}
                  >
                    <Copy size={14} />
                    {copied ? "Copied ✓" : "Copy"}
                  </button>

                  <button
                    onClick={() => setShowQr(true)}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-medium bg-slate-700 text-white hover:opacity-90 transition shadow"
                  >
                    <QrCode size={14} />
                    Show QR
                  </button>
                </div>

                <p className="text-xs text-muted-foreground">
                  Only send this coin on its supported network. Wrong deposits
                  cannot be recovered.
                </p>
              </div>
            </div>
          )}

          {/* Done */}
          <button
            onClick={onClose}
            className="w-full bg-gradient-to-r from-primary via-indigo-500 to-primary text-white py-2.5 rounded-xl font-semibold shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all duration-300"
          >
            Done
          </button>
        </div>
      </ModalTemplate>

      {/* ✅ QR MODAL CONNECTED PROPERLY */}
      {showQr && address && (
        <QRModal
          address={address}
          coinLabel={cryptoOptions.find(o => o.value === coin)?.label}
          onClose={() => setShowQr(false)}
        />
      )}
    </>
  );
}

function WithdrawalModal({ userId, onClose }) {
  const [assets, setAssets] = useState([]);
  const [selectedAsset, setSelectedAsset] = useState("");
  const [amount, setAmount] = useState("");
  const [wallet, setWallet] = useState("");
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    const fetchAssets = async () => {
      try {
        const res = await fetch(`/api/assets`);
        const data = await res.json();
        console.log("Fetched assets:", data.assets); // Add this line
        if (res.ok) setAssets(data.assets || []);
        else console.error("Failed to fetch assets:", data.error || res.statusText);
      } catch (err) {
        console.error("Server error while fetching assets", err);
      }
    };

    fetchAssets();
  }, []);

  const handleWithdraw = async (e) => {
    e.preventDefault();

    if (!selectedAsset || !amount || !wallet) {
      toast.error("Please fill in all fields");
      return;
    }

    const parts = selectedAsset.split(":");
    if (parts.length !== 2) {
      toast.error("Invalid asset selection");
      return;
    }

    const [coin, network] = parts;

    setProcessing(true);
    console.log({ userId, coin, network, amount, walletAddress: wallet });

    try {
      const res = await fetch("/api/withdraw", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          coin,
          network,
          amount: parseFloat(amount),
          walletAddress: wallet,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success("Transaction is being Processed!");
        onClose();
      } else {
        console.error("Withdrawal API error:", data.error || data);
        toast.error(data.error || "Withdrawal failed");
      }
    } catch (err) {
      console.error("Withdrawal request failed:", err);
      toast.error("Something went wrong");
    } finally {
      setProcessing(false);
    }
  };

  const uniqueAssets = Array.from(
    new Map(assets.map((a) => [`${a.coin}:${a.network}`, a])).values()
  );

  return (
    <ModalTemplate title="Withdraw Funds" onClose={onClose}>
      {processing ? (
        <p className="text-primary text-center">Processing withdrawal...</p>
      ) : (
        <form onSubmit={handleWithdraw} className="space-y-4 text-sm">
          <div>
            <label className="block mb-1">Choose Asset</label>
            <Select onValueChange={setSelectedAsset}>
              <SelectTrigger className="w-full bg-card/50 text-foreground border border-border">
                <SelectValue placeholder="Select coin & network" />
              </SelectTrigger>
              <SelectContent>
                {uniqueAssets.map((asset) => (
                  <SelectItem
                    key={`${asset.coin}:${asset.network}`}
                    value={`${asset.coin}:${asset.network}`}
                  >
                    {asset.coin.toUpperCase()} ({asset.network})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block mb-1 text-foreground">Amount</label>
            <input
              type="number"
              min="0"
              step="any"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full bg-card/50 border border-border px-3 py-2 rounded text-foreground placeholder-muted-foreground"
              placeholder="e.g. 100"
              required
            />
          </div>

          <div>
            <label className="block mb-1 text-foreground">Wallet Address</label>
            <input
              type="text"
              value={wallet}
              onChange={(e) => setWallet(e.target.value)}
              className="w-full bg-card/50 border border-border px-3 py-2 rounded text-foreground placeholder-muted-foreground"
              placeholder="e.g. bc1qxyz..."
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-primary text-primary-foreground hover:opacity-90 rounded py-2 font-semibold transition shadow-lg shadow-primary/25 disabled:opacity-50"
            disabled={processing}
          >
            {processing ? "Submitting..." : "Submit Withdrawal"}
          </button>
        </form>
      )}
    </ModalTemplate>
  );
}
// 📦 ActionButtons Main Component
const ActionButtons = ({ userId }) => {
  const [modal, setModal] = useState(null);
  const [qrData, setQrData] = useState(null);

  /*
    Wrap the button group in the same decorative container used by CardCarousel
    so the action section has an aurora background, gradient border, and a
    frosted-glass card look. This also ensures the modal overlay sits on top
    of everything and the rest of the dashboard is blurred when visible.
  */
  return (
    <>
      <div className="w-full max-w-2xl mx-auto px-4 mb-12 relative">
        {/* aurora background */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute -top-24 -left-20 w-72 h-72 bg-primary/30 rounded-full blur-[120px] opacity-60 animate-pulse" />
          <div className="absolute -bottom-24 -right-20 w-72 h-72 bg-indigo-500/30 rounded-full blur-[120px] opacity-60 animate-pulse" />
        </div>

        <div className="relative rounded-3xl p-[1px] bg-gradient-to-r from-primary via-indigo-500 to-primary">
          <div className="rounded-3xl bg-card/80 backdrop-blur-2xl relative overflow-hidden shadow-2xl shadow-black/30 transition-all duration-500 hover:-translate-y-1 hover:shadow-primary/30">
            <div className="flex flex-wrap justify-center gap-4 sm:gap-6 py-6 px-2 sm:px-4">
              {actions.map(({ label, modal: modalType, icon }) => {
                const buttonClass =
                  "w-[80px] h-[80px] bg-card hover:bg-card/80 border border-border text-foreground rounded-xl flex flex-col items-center justify-center gap-1 transition hover:shadow-lg shadow-primary/10";
                if (label === "FBI") {
                  return (
                    <Link key={label} href="/dashboard/fbi" className={buttonClass} title="Submit Complaint">
                      <div className="text-primary">{icon}</div>
                      <span className="text-xs">{label}</span>
                    </Link>
                  );
                }
                if (label === "Stocks") {
                  return (
                    <Link key={label} href="/dashboard/stocks" className={buttonClass} title="View Stocks">
                      <div className="text-primary">{icon}</div>
                      <span className="text-xs">{label}</span>
                    </Link>
                  );
                }
                return modalType ? (
                  <button key={label} onClick={() => setModal(modalType)} className={buttonClass}>
                    <div className="text-primary">{icon}</div>
                    <span className="text-xs">{label}</span>
                  </button>
                ) : (
                  <Link key={label} href={`/dashboard/${label.toLowerCase()}`} className={buttonClass}>
                    <div className="text-primary">{icon}</div>
                    <span className="text-xs">{label}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {modal === "deposit" && (
          <DepositModal
            onClose={() => setModal(null)}
            showQRAndClose={({ address, coinLabel }) => {
              // close deposit modal and open single QR modal
              setModal(null);
              setQrData({ address, coinLabel });
            }}
          />
        )}
        {modal === "withdrawal" && (
          <WithdrawalModal userId={userId} onClose={() => setModal(null)} />
        )}
      </AnimatePresence>

      {/* Global QR Modal controlled by parent — ensures only one modal at a time */}
      {qrData && (
        <QRModal
          address={qrData.address}
          coinLabel={qrData.coinLabel}
          onClose={() => setQrData(null)}
        />
      )}
    </>
  );
};

export default ActionButtons;
