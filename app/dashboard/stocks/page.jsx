"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { LineChart, ArrowUpRight, ArrowDownRight, X } from "lucide-react";
import { toast } from "sonner";

export default function StockPage() {
  const [stocks, setStocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalStock, setModalStock] = useState(null);
  const [sharesInput, setSharesInput] = useState(1);
  const [paying, setPaying] = useState(false);
  const [ownedStocks, setOwnedStocks] = useState({});
  const [sellModalStock, setSellModalStock] = useState(null);
  const [sellSharesInput, setSellSharesInput] = useState(1);
  const [selling, setSelling] = useState(false);

  // --- Fetch user's approved stocks ---
  const fetchUserStocks = async () => {
    try {
      const res = await fetch("/api/user-stocks?approved=true", { cache: "no-store" });
      const data = await res.json();
      if (data.success && Array.isArray(data.stocks)) {
        const owned = {};
        data.stocks.forEach((s) => {
          const remaining = Math.max(0, (s.shares || 0) - (s.processedShares || 0));
          if (remaining > 0) owned[s.symbol] = (owned[s.symbol] || 0) + remaining;
        });
        setOwnedStocks(owned);
      } else {
        setOwnedStocks({});
      }
    } catch (err) {
      console.error("Error fetching user stocks:", err);
      setOwnedStocks({});
    }
  };

  // --- Initial fetch ---
  useEffect(() => {
    let mounted = true;
    setLoading(true);

    // Single source: /api/stocks already includes mocked commodities (copper, gold, etc.)
    // Poll every 15s so commodity mock prices appear "lowkey" real-time.
    const getAll = async () => {
      try {
        const marketRes = await fetch("/api/stocks", { cache: "no-store" }).then((r) => r.json());
        // refresh user holdings so owned balances update after admin actions
        await fetchUserStocks();

        const marketStocks = marketRes?.stocks || [];
        if (mounted) setStocks(marketStocks);
      } catch (err) {
        console.error("Error fetching stocks:", err);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    getAll();
    const interval = setInterval(getAll, 15000);

    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, []);

  // --- Handle Buy ---
  const handleBuyClick = (stock) => {
    setModalStock(stock);
    setSharesInput(1);
  };

  const handlePay = async () => {
    if (!modalStock) return;
    setPaying(true);
    try {
      const res = await fetch("/api/stocks/buy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          symbol: modalStock.symbol,
          shares: sharesInput,
          price: modalStock.price,
        }),
      });
      const data = await res.json();
      setModalStock(null);
      if (data.success) {
        toast.success(
          `Purchased ${sharesInput} shares of ${modalStock.symbol}. Awaiting admin approval.`
        );
      } else {
        toast.error(data.error || "Failed to save purchase.");
      }
    } catch (err) {
      console.error("Buy error:", err);
      toast.error("Network error during purchase.");
    } finally {
      setPaying(false);
    }
  };

  // --- Handle Sell ---
  const submitSellRequest = async () => {
    if (!sellModalStock) return;
    setSelling(true);
    try {
      const res = await fetch("/api/stocks/sell", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          symbol: sellModalStock.symbol,
          shares: sellSharesInput,
          price: sellModalStock.price,
          xrpAddress: sellModalStock.xrpAddress,
        }),
      });
      const data = await res.json();
      setSellModalStock(null);
      if (data.success) {
        toast.success(`Sell request submitted. Awaiting admin approval.`);
        await fetchUserStocks(); // Refresh holdings so deduction shows when approved
      } else {
        toast.error(data.error || "Failed to submit sell request.");
      }
    } catch (err) {
      console.error("Sell error:", err);
      toast.error("Network error during sell.");
    } finally {
      setSelling(false);
    }
  };

  // --- Compute total value of owned stocks ---
  const totalBalance = stocks.reduce((sum, stock) => {
    const shares = ownedStocks[stock.symbol] || 0;
    return sum + shares * (stock.price || 0);
  }, 0);

  // --- UI ---
  return (
    <div className="min-h-screen bg-background text-foreground py-10 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Balance Summary */}
        <div className="mb-8">
          <div className="bg-gradient-to-r from-primary via-primary/80 to-card rounded-2xl shadow-lg shadow-primary/30 p-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-primary-foreground">
            <div className="flex items-center gap-3">
              <LineChart size={32} className="text-primary-foreground/80" />
              <div>
                <h2 className="text-xl font-bold">Your Stock Balance</h2>
                <p className="text-sm text-primary-foreground/70">Live total value of all owned stocks</p>
              </div>
            </div>
            <div className="text-3xl font-extrabold text-primary-foreground">
              ${totalBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
          </div>
        </div>

        <div className="mb-8 text-center">
          <LineChart className="mx-auto mb-2 text-primary" size={40} />
          <h1 className="text-3xl font-bold text-foreground mb-2">Stocks Marketplace</h1>
          <p className="text-muted-foreground">
            Buy and track stocks alongside your crypto assets.
          </p>
        </div>
      
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {loading
            ? Array.from({ length: 4 }).map((_, i) => (
                <Card key={i} className="bg-white/5 backdrop-blur-md rounded-2xl animate-pulse border border-white/10 p-6">
                  <div className="h-5 w-24 bg-blue-700/40 rounded mb-4"></div>
                  <div className="h-6 w-36 bg-blue-800/40 rounded mb-2"></div>
                  <div className="h-4 w-20 bg-blue-600/40 rounded"></div>
                </Card>
              ))
            : stocks.map((stock) => {
                const isUp = stock.change > 0;
                const changeColor = isUp ? "text-primary" : stock.change < 0 ? "text-primary/60" : "text-muted-foreground";
                const changeIcon = isUp ? <ArrowUpRight size={16} /> : stock.change < 0 ? <ArrowDownRight size={16} /> : null;
                return (
                  <Card
                    key={stock.symbol}
                    className="bg-card border border-border backdrop-blur-md p-5 text-foreground rounded-2xl shadow-lg transition hover:shadow-xl hover:scale-[1.01] cursor-pointer"
                  >
                    <CardHeader className="flex items-center gap-3 p-0 mb-3">
                      <img
                        src={stock.logo}
                        alt={stock.symbol}
                        className="w-10 h-10 object-contain rounded-full border border-white/10 shadow"
                        onError={(e) => {
                          e.currentTarget.onerror = null;
                          e.currentTarget.src = "/stock-placeholder.png";
                        }}
                      />
                      <div>
                        <h4 className="text-lg font-semibold flex items-center gap-2">{stock.symbol}</h4>
                        <p className="text-xs text-blue-300">{stock.name}</p>
                      </div>
                    </CardHeader>
                    <CardContent className="p-0 mt-2">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="text-xs text-blue-300">
                          Price: ${stock.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </p>
                        <span className={`ml-2 ${changeColor} font-semibold flex items-center gap-1`}>
                          {changeIcon}
                          <span>{stock.change > 0 ? "+" : ""}{stock.change.toFixed(2)}%</span>
                        </span>
                      </div>
                      <div className="flex items-center justify-between mt-2 gap-2">
                        <span className="text-xs text-white/70">
                          Owned: <span className="font-bold">{ownedStocks[stock.symbol] ? ownedStocks[stock.symbol] : "-"}</span> shares
                        </span>
                        <div className="flex gap-2">
                          <button
                            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-1 rounded transition text-xs"
                            onClick={() => handleBuyClick(stock)}
                          >
                            Buy
                          </button>
                          <button
                            className="bg-red-600 hover:bg-red-700 text-white font-semibold px-4 py-1 rounded transition text-xs"
                            disabled={!ownedStocks[stock.symbol]}
                            onClick={() => {
                              setSellModalStock(stock);
                              setSellSharesInput(1);
                            }}
                          >
                            Sell
                          </button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
        </div>
      </div>

      {/* Buy Modal */}
      {modalStock && (
        <Modal
          stock={modalStock}
          type="buy"
          onClose={() => setModalStock(null)}
          onConfirm={handlePay}
          inputValue={sharesInput}
          setInputValue={setSharesInput}
          loading={paying}
        />
      )}

      {/* Sell Modal */}
      {sellModalStock && (
        <Modal
          stock={sellModalStock}
          type="sell"
          onClose={() => setSellModalStock(null)}
          onConfirm={submitSellRequest}
          inputValue={sellSharesInput}
          setInputValue={setSellSharesInput}
          loading={selling}
          maxShares={ownedStocks[sellModalStock.symbol] || 1}
        />
      )}
    </div>
  );
}

// --- Modal component (Buy/Sell shared) ---
function Modal({ stock, type, onClose, onConfirm, inputValue, setInputValue, loading, maxShares }) {
  const isBuy = type === "buy";
  const buttonColor = isBuy ? "bg-blue-600 hover:bg-blue-700" : "bg-red-600 hover:bg-red-700";
  const labelText = isBuy ? "Select shares to buy:" : "Select shares to sell:";
  const title = isBuy ? "Confirm Purchase" : "Confirm Sell";
  const total = (stock.price * inputValue).toFixed(2);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur">
      <div className="bg-slate-900 rounded-2xl border border-white/10 shadow-2xl p-6 w-full max-w-md relative">
        <button className="absolute top-4 right-4 text-gray-400 hover:text-white" onClick={onClose}>
          <X size={24} />
        </button>
        <div className="flex items-center gap-3 mb-4">
          <img
            src={stock.logo}
            alt={stock.symbol}
            className="w-10 h-10 object-contain rounded-full border border-white/10 shadow"
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = "/stock-placeholder.png";
            }}
          />
          <div>
            <h4 className="text-lg font-semibold">{stock.symbol}</h4>
            <p className="text-xs text-blue-300">{stock.name}</p>
          </div>
        </div>
        <div className="mb-4">
          <label className="block text-sm text-white mb-2">{labelText}</label>
          <input
            type="number"
            min={1}
            max={maxShares || undefined}
            value={inputValue}
            onChange={(e) => setInputValue(Number(e.target.value))}
            className="w-24 px-2 py-1 rounded bg-slate-800 border border-white/20 text-xs text-white"
          />
        </div>
        {isBuy ? (
          <>
            <label className="block text-sm text-white mb-2">Send payment to XRP address:</label>
            <div className="bg-slate-800 text-blue-300 px-3 py-2 rounded font-mono text-xs select-all">
              rp5PMThCE9FtANy7ULtN4X43fNf7oXW6mtmt
            </div>
            <p className="text-xs text-gray-400 mt-2">After payment, click "{title}".</p>
          </>
        ) : (
          <>
            <label className="block text-sm text-white mb-2">Withdraw to XRP address:</label>
            <input
              type="text"
              placeholder="Enter your XRP wallet address"
              value={stock.xrpAddress || ""}
              onChange={(e) => (stock.xrpAddress = e.target.value)}
              className="w-full px-3 py-2 rounded bg-slate-800 border border-white/20 text-xs text-blue-300 font-mono"
            />
          </>
        )}
        <button
          className={`w-full ${buttonColor} text-white font-semibold px-4 py-2 rounded transition text-base mt-4`}
          disabled={loading}
          onClick={onConfirm}
        >
          {loading ? "Processing..." : `${title} ($${total})`}
        </button>
      </div>
    </div>
  );
}
