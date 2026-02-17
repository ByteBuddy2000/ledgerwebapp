"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Search, Edit } from "lucide-react";
import { toast } from "sonner";

export default function ViewUserStocksPage() {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [editingStocks, setEditingStocks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newStockSymbol, setNewStockSymbol] = useState("");
  const [newStockShares, setNewStockShares] = useState("");
  const [livePrices, setLivePrices] = useState({});

  const allSymbols = [
    "AAPL",
    "GOOGL",
    "MSFT",
    "TSLA",
    "AMZN",
    "NVDA",
    "META",
    "NFLX",
    "XOM",
    "JPM",
    // Commodities
    "XAUUSD", // Gold
    "XAGUSD", // Silver
    "XPDUSD", // Palladium
    "XCUUSD", // Copper
    "IRIDIUM", // Iridium
  ];

  useEffect(() => {
    async function fetchStockPrices() {
      try {
        const res = await fetch("/api/stocks");
        const data = await res.json();
        const prices = {};
        if (Array.isArray(data.stocks)) {
          for (const stock of data.stocks) {
            prices[stock.symbol] = stock.price;
          }
        }
        setLivePrices(prices);
      } catch (err) {
        setLivePrices({});
      }
    }
    fetchStockPrices();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await fetch(
        `/api/admin/all-users-stocks${
          searchTerm ? `?search=${encodeURIComponent(searchTerm)}` : ""
        }`
      )
      const data = await res.json();
      setUsers(data.users || []);
    } catch (err) {
      toast.error("Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [searchTerm]);

  const handleEditUser = (user) => {
    // Ensure all stocks (including commodities) are present in editingStocks
    const stocksMap = {};
    if (Array.isArray(user.stocks)) {
      user.stocks.forEach(s => { stocksMap[s.symbol] = { ...s }; });
    }
    const fullStocks = allSymbols.map(symbol => {
      return stocksMap[symbol] ? { ...stocksMap[symbol] } : { symbol, shares: 0 };
    });
    setSelectedUser(user);
    setEditingStocks(fullStocks);
    setNewStockSymbol("");
    setNewStockShares("");
  };

  const updateStockShares = (index, value) => {
    setEditingStocks((prev) =>
      prev.map((stock, i) =>
        i === index
          ? {
              ...stock,
              shares: Math.max(0, Number.parseFloat(value) || 0),
            }
          : stock
      )
    );
  };

  const addNewStock = () => {
    if (!newStockSymbol || !newStockShares) return;
    setEditingStocks(prev => {
      return prev.map(s =>
        s.symbol === newStockSymbol
          ? { ...s, shares: Math.max(0, Number.parseFloat(newStockShares) || 0) }
          : s
      );
    });
    setNewStockSymbol("");
    setNewStockShares("");
  };

  const removeStock = (index) => {
    setEditingStocks(prev =>
      prev.map((stock, i) =>
        i === index ? { ...stock, shares: 0 } : stock
      )
    );
  };

  const handleSaveStocks = async () => {
    if (!selectedUser) return;
    setLoading(true);
    try {
      const stocksToSend = editingStocks
        .map(stock => ({
          symbol: stock.symbol,
          shares: stock.shares,
          price: livePrices[stock.symbol] || 0,
        }))
        .filter(s => s.shares > 0);
      const res = await fetch("/api/admin/update-stocks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: selectedUser.id,
          stocks: stocksToSend,
        }),
      });
      const result = await res.json();
      if (result.success) {
        toast.success("Stocks updated successfully");
        setSelectedUser(null);
        setEditingStocks([]);
        await fetchUsers();
      } else {
        toast.error("Failed to update stocks");
      }
    } catch (err) {
      toast.error("Error saving stocks");
    } finally {
      setLoading(false);
    }
  };

  return (
  <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-[#1a012b] via-black to-[#001933] text-white">
    
      {/* Back Button */}
      <div className="mb-4 sm:mb-6">
        <Link href="/admin/stocks">
          <Button variant="outline" className="bg-gray-800 text-white border-gray-700 hover:bg-gray-700 w-full sm:w-auto">
            ← Back to Stocks Admin
          </Button>
        </Link>
      </div>

      {/* Search Section */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 mb-6 w-full">
        <Input
          type="text"
          placeholder="Search user by name or email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="bg-gray-800 border-gray-700 text-white w-full sm:max-w-sm"
        />
        <Button onClick={fetchUsers} disabled={loading} className="w-full sm:w-auto">
          <Search className="mr-2 h-4 w-4" /> Search
        </Button>
      </div>

      {loading && <p className="text-gray-400 text-center sm:text-left">Loading users...</p>}

      {/* User Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
        {users.map((user) => (
          <Card key={user.id} className="bg-gradient-to-br from-gray-950 via-gray-900 to-black border-gray-800 rounded-xl shadow-md">
            <CardHeader className="pb-3">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarImage src={user.avatar || "/placeholder.svg"} />
                    <AvatarFallback className="bg-gray-700">
                      {user?.name
                        ? user.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")
                            .toUpperCase()
                        : user?.email
                        ? user.email[0].toUpperCase()
                        : "U"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="truncate">
                    <p className="font-medium truncate max-w-[160px] sm:max-w-[200px]">{user.name || "Unnamed User"}</p>
                    <p className="text-sm text-gray-400 truncate max-w-[180px]">{user.email}</p>
                  </div>
                </div>

                <Dialog
                  open={selectedUser?.id === user.id}
                  onOpenChange={(open) => !open && setSelectedUser(null)}
                >
                  <DialogTrigger asChild>
                    <Button
                      variant="ghost"
                      onClick={() => handleEditUser(user)}
                      className="text-white hover:text-blue-400 w-full sm:w-auto justify-center"
                    >
                      <Edit className="mr-1 h-4 w-4 text-white" /> Edit
                    </Button>
                  </DialogTrigger>

                  <DialogContent className="max-w-full sm:max-w-2xl bg-gradient-to-br from-gray-950 via-gray-900 to-black text-white border-gray-800 rounded-lg p-4 sm:p-6 overflow-y-auto max-h-[85vh]">
                    <div className="space-y-6">
                      <h2 className="text-xl sm:text-2xl font-semibold text-center sm:text-left">
                        Edit {user.name || user.email}'s Stocks
                      </h2>

                      <div className="space-y-4">
                        {allSymbols.map((symbol, index) => {
                          const stock = editingStocks.find(s => s.symbol === symbol);
                          const shares = stock ? stock.shares : 0;
                          return (
                            <div
                              key={symbol}
                              className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-gray-800 p-3 rounded-lg"
                            >
                              <div className="flex-1">
                                <p className="text-white font-medium">{symbol}</p>
                                <p className="text-gray-400 text-sm">Shares</p>
                              </div>
                              <input
                                type="number"
                                step="any"
                                value={shares}
                                onChange={e => {
                                  const value = Number.parseFloat(e.target.value) || 0;
                                  setEditingStocks(prev => {
                                    const exists = prev.find(s => s.symbol === symbol);
                                    if (exists) {
                                      return prev.map(s =>
                                        s.symbol === symbol ? { ...s, shares: value } : s
                                      );
                                    } else {
                                      return [...prev, { symbol, shares: value }];
                                    }
                                  });
                                }}
                                className="bg-gray-700 border border-gray-600 rounded px-3 py-2 text-base text-white w-full sm:w-24"
                              />
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => {
                                  setEditingStocks(prev => prev.map(s => s.symbol === symbol ? { ...s, shares: 0 } : s));
                                }}
                                className="w-full sm:w-auto"
                              >
                                Remove
                              </Button>
                            </div>
                          );
                        })}
                      </div>

                      {/* Add New Stock */}
                      <div>
                        <h3 className="text-lg sm:text-xl font-semibold mb-3 text-center sm:text-left">
                          Add New Stock
                        </h3>
                        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-stretch sm:items-center">
                          <select
                            value={newStockSymbol}
                            onChange={(e) => setNewStockSymbol(e.target.value)}
                            className="bg-gray-700 border border-gray-600 rounded px-4 py-2 text-base text-white w-full sm:w-auto"
                          >
                            <option value="">Select Stock</option>
                            {allSymbols.map((symbol) => (
                              <option key={symbol} value={symbol}>
                                {symbol}
                              </option>
                            ))}
                          </select>

                          <input
                            type="number"
                            placeholder="Shares"
                            value={newStockShares}
                            onChange={(e) => setNewStockShares(e.target.value)}
                            className="bg-gray-700 border border-gray-600 rounded px-4 py-2 text-base text-white w-full sm:w-auto"
                          />

                          <Button
                            onClick={addNewStock}
                            disabled={!newStockSymbol || !newStockShares}
                            className="w-full sm:w-auto"
                          >
                            + Add Stock
                          </Button>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex flex-col sm:flex-row justify-end gap-3 pt-6">
                        <Button
                          variant="destructive"
                          onClick={() => setSelectedUser(null)}
                          className="w-full sm:w-auto"
                        >
                          Cancel
                        </Button>
                        <Button
                          onClick={handleSaveStocks}
                          disabled={loading}
                          className="w-full sm:w-auto"
                        >
                          {loading ? "Saving..." : "Save Changes"}
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>

            <CardContent className="space-y-3">
              <div className="flex flex-wrap justify-between items-center gap-2 text-sm sm:text-base">
                <div className="flex flex-col">
                  <span className="text-gray-400">Total Shares</span>
                  <span className="font-bold text-green-400 text-lg sm:text-xl">
                    {Array.isArray(user.stocks)
                      ? user.stocks.reduce((sum, s) => sum + (s.shares || 0), 0)
                      : 0}
                  </span>
                </div>

                <div className="flex flex-col text-right">
                  <span className="text-gray-400">Total Value</span>
                  <span className="font-bold text-blue-400 text-lg sm:text-xl">
                    $
                    {Array.isArray(user.stocks)
                      ? user.stocks
                          .reduce(
                            (sum, s) =>
                              sum +
                              (s.shares || 0) * (livePrices[s.symbol] || 0),
                            0
                          )
                          .toLocaleString()
                      : "0"}
                  </span>
                </div>
              </div>

              <div>
                <p className="text-sm text-gray-400 mb-2">
                  Stocks ({allSymbols.length})
                </p>
                <div className="flex flex-wrap gap-1">
                  {allSymbols.map((symbol, idx) => {
                    const stock = Array.isArray(user.stocks) ? user.stocks.find(s => s.symbol === symbol) : null;
                    const shares = stock ? stock.shares : 0;
                    return (
                      <Badge
                        key={symbol}
                        variant="secondary"
                        className="bg-gray-700 text-white text-xs px-2 py-1"
                      >
                        {symbol}: {shares?.toLocaleString()} shares
                      </Badge>
                    );
                  })}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {users.length === 0 && !loading && (
          <div className="text-center py-12">
            <p className="text-gray-400 text-lg">
              No users found matching your search.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
