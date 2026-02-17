"use client"

import { useState, useMemo, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Search, Edit, Plus, Wallet, TrendingUp, Users, DollarSign } from "lucide-react"
import AdminTopNav from "../_components/AdminTopNav"
import { toast } from "sonner"

const ASSETS = {
  BTC: { name: "Bitcoin", symbol: "BTC", color: "bg-orange-500" },
  ETH: { name: "Ethereum", symbol: "ETH", color: "bg-blue-500" },
  USDT: { name: "Tether", symbol: "USDT", color: "bg-green-500" },
  BNB: { name: "Binance Coin", symbol: "BNB", color: "bg-yellow-500" },
  SOL: { name: "Solana", symbol: "SOL", color: "bg-purple-500" },
  ADA: { name: "Cardano", symbol: "ADA", color: "bg-blue-600" },
  XRP: { name: "Ripple", symbol: "XRP", color: "bg-gray-500" },
  DOGE: { name: "Dogecoin", symbol: "DOGE", color: "bg-yellow-600" },
  TRX: { name: "Tron", symbol: "TRX", color: "bg-red-500" },
  DOT: { name: "Polkadot", symbol: "DOT", color: "bg-pink-500" },
  SHIB: { name: "Shiba Inu", symbol: "SHIB", color: "bg-orange-600" },
  XLM: { name: "Stellar", symbol: "XLM", color: "bg-blue-400" }
}

// Define available networks for each coin
const COIN_NETWORKS = {
  BTC: ["Mainnet"],
  ETH: ["Mainnet"],
  USDT: ["ERC20", "TRC20", "BEP20"],
  BNB: ["BNB Smart Chain (BEP20)"],
  SOL: ["Solana"],
  ADA: ["Cardano"],
  XRP: ["Ripple"],
  DOGE: ["Dogecoin"],
  TRX: ["Tron"],
  DOT: ["Polkadot"],
  SHIB: ["Ethereum"],
  XLM: ["Stellar"]
};

export default function WalletPage({ users: initialUsers }) {
  const [users, setUsers] = useState(initialUsers)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedUser, setSelectedUser] = useState(null)
  const [editingAssets, setEditingAssets] = useState([]);
  const [loading, setLoading] = useState(false)
  const [livePrices, setLivePrices] = useState({})
  const [newAssetCoin, setNewAssetCoin] = useState("");
  const [newAssetNetwork, setNewAssetNetwork] = useState("");

  // Fetch users from API (like in page.jsx)
  const fetchUsers = async () => {
    try {
      const res = await fetch("/api/admin/customers");
      const data = await res.json();
      setUsers(data.customers || []);
    } catch (err) {
      toast.error("Failed to fetch users");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    async function fetchPrices() {
      try {
        const res = await fetch(
          "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,tether,binancecoin,solana,cardano,ripple,dogecoin,tron,polkadot,shiba-inu,stellar&vs_currencies=usd"
        );
        const data = await res.json();
        setLivePrices({
          BTC: data.bitcoin.usd,
          ETH: data.ethereum.usd,
          USDT: data.tether.usd,
          BNB: data.binancecoin.usd,
          SOL: data.solana.usd,
          ADA: data.cardano.usd,
          XRP: data.ripple.usd,
          DOGE: data.dogecoin.usd,
          TRX: data.tron.usd,
          DOT: data.polkadot.usd,
          SHIB: data["shiba-inu"].usd,
          XLM: data.stellar.usd,
        });
      } catch (error) {
        console.error("Failed to fetch live prices:", error);
      }
    }
    fetchPrices();
  }, []);


  const calculateTotalValue = (assets) => {
    if (!Array.isArray(assets)) return 0;
    return assets.reduce((total, asset) => {
      const price = livePrices[asset.coin] || 0;
      return total + (asset.amount || 0) * price;
    }, 0);
  }

  const filteredUsers = useMemo(() => {
    if (!searchTerm) return users
    return users.filter(
      user =>
        (user.name?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
        (user.email?.toLowerCase() || "").includes(searchTerm.toLowerCase())
    )
  }, [users, searchTerm])
  const totalUsers = filteredUsers.length
  const totalValue = filteredUsers.reduce((sum, user) => sum + calculateTotalValue(user.assets), 0)
  const totalAssets = filteredUsers.reduce((sum, user) => sum + (Array.isArray(user.assets) ? user.assets.length : 0), 0)

  const handleEditUser = (user) => {
    setSelectedUser(user);
    setEditingAssets(Array.isArray(user.assets) ? user.assets : []);
    setNewAssetCoin("");
    setNewAssetNetwork("");
  };

  const updateAssetAmount = (index, value) => {
    setEditingAssets((prev) =>
      prev.map((asset, i) =>
        i === index ? { ...asset, amount: Math.max(0, Number.parseFloat(value) || 0) } : asset
      )
    );
  };

  const updateAssetNetwork = (index, network) => {
    setEditingAssets((prev) =>
      prev.map((asset, i) =>
        i === index ? { ...asset, network } : asset
      )
    );
  };

  const addNewAsset = () => {
    if (
      !newAssetCoin ||
      !newAssetNetwork ||
      editingAssets.some(a => a.coin === newAssetCoin && a.network === newAssetNetwork)
    ) return;
    setEditingAssets(prev => [
      ...prev,
      { coin: newAssetCoin, network: newAssetNetwork, amount: 0 },
    ]);
    setNewAssetCoin("");
    setNewAssetNetwork("");
  };

  const removeAsset = (index) => {
    setEditingAssets((prev) => prev.filter((_, i) => i !== index));
  };

  // Save assets: send as array of {coin, network, amount}
  const handleSaveAssets = async () => {
    if (!selectedUser) return;
    setLoading(true);
    const res = await fetch("/api/admin/update-assets", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId: selectedUser.id,
        assets: editingAssets,
      }),
    });
    const result = await res.json();
    if (result.success) {
      toast("Assets updated successfully");
      setSelectedUser(null);
      setEditingAssets([]);
      // Fetch fresh users/assets after top-up
      await fetchUsers();
    } else {
      toast.error("Failed to update assets: " + (result.error || "Unknown error"));
    }
    setLoading(false);
  };

  return (
  <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-[#1a012b] via-black to-[#001933] text-white">

    {/* Ambient Glows */}
    <div className="absolute top-32 left-10 w-80 h-80 bg-purple-600/20 rounded-full blur-3xl opacity-20 animate-pulse" />
    <div className="absolute bottom-24 right-10 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl opacity-10" />

    {/* Container including TopNav */}
    <div className="relative z-10 max-w-7xl mx-auto px-6 py-8 pb-16">

      {/* Admin Top Navigation */}
      <div className="mb-8">
        <AdminTopNav />
      </div>

      {/* Top Stats + Search */}
      <div className="mb-10">

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl shadow-xl hover:border-primary/40 transition-all duration-300">
            <CardContent className="p-5">
              <div className="flex items-center gap-4">
                <Users className="h-8 w-8 text-primary" />
                <div>
                  <p className="text-xs uppercase tracking-wider text-gray-400">Total Users</p>
                  <p className="text-2xl text-white font-bold">{totalUsers}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl shadow-xl hover:border-primary/40 transition-all duration-300">
            <CardContent className="p-5">
              <div className="flex items-center gap-4">
                <TrendingUp className="h-8 w-8 text-primary" />
                <div>
                  <p className="text-xs uppercase tracking-wider text-gray-400">Total Value</p>
                  <p className="text-2xl text-white font-bold">${totalValue.toLocaleString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl shadow-xl hover:border-primary/40 transition-all duration-300">
            <CardContent className="p-5">
              <div className="flex items-center gap-4">
                <Wallet className="h-8 w-8 text-primary" />
                <div>
                  <p className="text-xs uppercase tracking-wider text-gray-400">Total Assets</p>
                  <p className="text-2xl text-white font-bold">{totalAssets}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search Bar */}
        <div className="relative max-w-md">
          <div className="absolute inset-0 bg-white/5 rounded-xl blur-xl opacity-40"></div>
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 z-10" />
          <Input
            placeholder="Search users by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="relative z-20 pl-10 bg-white/5 backdrop-blur-md border border-white/10 text-white placeholder:text-gray-400 rounded-xl focus:border-primary focus:ring-0"
          />
        </div>
      </div>

      {/* Users Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredUsers.map((user) => (
          <Card
            key={user.id}
            className="group bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl shadow-xl hover:border-primary/40 hover:shadow-primary/20 transition-all duration-300"
          >
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
                    <AvatarFallback className="bg-primary/20 text-primary">
                      {user?.name
                        ? user.name.split(" ").map((n) => n[0]).join("").toUpperCase()
                        : user?.email
                          ? user.email[0].toUpperCase()
                          : "U"}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-lg text-white">{user.name}</CardTitle>
                    <p className="text-sm text-gray-400">{user.email}</p>
                  </div>
                </div>

                <Dialog open={selectedUser?.id === user.id} onOpenChange={(open) => !open && setSelectedUser(null)}>
                  <DialogTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEditUser(user)}
                      className="text-primary hover:text-white hover:bg-primary/20 rounded-lg transition"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                  </DialogTrigger>

                  <DialogContent className="bg-gradient-to-bl from-[#350661] via-black to-[#001F3F] border border-white/10 shadow-2xl max-w-4xl w-full rounded-3xl overflow-hidden">
                    <div className="space-y-12 px-12 py-10 max-h-[75vh] overflow-y-auto scrollbar-thin scrollbar-thumb-white/20">
                      {/* Current Assets */}
                      <div>
                        <h3 className="text-xl md:text-2xl font-semibold mb-6 text-white">Current Assets</h3>

                        {editingAssets.length === 0 ? (
                          <p className="text-gray-400 text-lg">No assets added yet. Use the form below to add one.</p>
                        ) : (
                          <div className="space-y-6">
                            {editingAssets.map((asset, index) => (
                              <div
                                key={index}
                                className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-6 space-y-5 hover:border-primary/40 transition"
                              >
                                <div className="flex items-center gap-4">
                                  <div
                                    className={`w-14 h-14 rounded-2xl ${ASSETS[asset.coin]?.color} flex items-center justify-center text-lg font-bold text-white shadow-lg`}
                                  >
                                    {asset.coin}
                                  </div>
                                  <div>
                                    <label className="text-white text-base">{ASSETS[asset.coin]?.name}</label>
                                    <p className="text-gray-400 text-sm">{asset.network}</p>
                                  </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                  <div>
                                    <label htmlFor={`network-${index}`} className="text-white text-sm">Network</label>
                                    <select
                                      id={`network-${index}`}
                                      value={asset.network}
                                      onChange={(e) => updateAssetNetwork(index, e.target.value)}
                                      className="w-full bg-black/40 backdrop-blur-md text-white px-4 py-3 rounded-xl border border-white/10 focus:border-primary outline-none"
                                    >
                                      {COIN_NETWORKS[asset.coin]?.map((net) => (
                                        <option key={net} value={net}>{net}</option>
                                      ))}
                                    </select>
                                  </div>

                                  <div>
                                    <label htmlFor={`amount-${index}`} className="text-white text-sm">Amount</label>
                                    <input
                                      id={`amount-${index}`}
                                      type="number"
                                      step="any"
                                      value={asset.amount}
                                      onChange={(e) => updateAssetAmount(index, e.target.value)}
                                      className="w-full bg-black/40 backdrop-blur-md text-white px-4 py-3 rounded-xl border border-white/10 focus:border-primary outline-none"
                                    />
                                  </div>

                                  <div className="flex items-end">
                                    <button
                                      type="button"
                                      onClick={() => removeAsset(index)}
                                      className="text-red-400 hover:text-red-300 text-sm font-medium transition"
                                    >
                                      Remove
                                    </button>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Add New Asset */}
                      <div>
                        <h3 className="text-xl md:text-2xl font-semibold mb-5 text-white">Add New Asset</h3>
                        <div className="flex flex-col md:flex-row gap-4 items-center">
                          <select
                            value={newAssetCoin}
                            onChange={e => {
                              setNewAssetCoin(e.target.value);
                              setNewAssetNetwork("");
                            }}
                            className="bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-base text-white focus:border-primary outline-none min-w-[160px] w-full md:w-auto"
                          >
                            <option value="">Select Coin</option>
                            {Object.entries(ASSETS).map(([symbol, asset]) => (
                              <option key={symbol} value={symbol}>{asset.name} ({symbol})</option>
                            ))}
                          </select>

                          {newAssetCoin && (
                            <select
                              value={newAssetNetwork}
                              onChange={e => setNewAssetNetwork(e.target.value)}
                              className="bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-base text-white focus:border-primary outline-none min-w-[160px] w-full md:w-auto"
                            >
                              <option value="">Select Network</option>
                              {COIN_NETWORKS[newAssetCoin]
                                .filter(network =>
                                  !editingAssets.some(a => a.coin === newAssetCoin && a.network === network)
                                )
                                .map(network => (
                                  <option key={network} value={network}>{network}</option>
                                ))}
                            </select>
                          )}

                          <button
                            type="button"
                            onClick={addNewAsset}
                            disabled={!newAssetCoin || !newAssetNetwork}
                            className="bg-primary hover:bg-primary/80 text-white px-6 py-3 rounded-xl text-sm font-medium transition disabled:opacity-50"
                          >
                            + Add Asset
                          </button>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex justify-end gap-6 pt-8">
                        <button
                          type="button"
                          onClick={() => setSelectedUser(null)}
                          className="bg-white/10 hover:bg-white/20 px-8 py-3 text-sm rounded-xl transition"
                        >
                          Cancel
                        </button>
                        <button
                          type="button"
                          onClick={handleSaveAssets}
                          disabled={loading}
                          className="bg-primary hover:bg-primary/80 px-8 py-3 text-sm rounded-xl text-white transition disabled:opacity-50"
                        >
                          {loading ? "Saving..." : "Save Changes"}
                        </button>
                      </div>

                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>

            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-400">Total Value</span>
                  <span className="text-lg font-bold text-primary">${calculateTotalValue(user.assets).toLocaleString()}</span>
                </div>

                <div className="hidden flex justify-between items-center">
                  <span className="text-sm text-gray-400">Last Active</span>
                  <span className="text-sm">{user.lastActive}</span>
                </div>

                <div>
                  <p className="text-sm text-gray-400 mb-2">Assets ({Array.isArray(user.assets) ? user.assets.length : 0})</p>
                  <div className="flex flex-wrap gap-1">
                    {Array.isArray(user.assets) && user.assets.map((asset, idx) => (
                      <Badge
                        key={idx}
                        variant="secondary"
                        className="bg-white/10 backdrop-blur-md border border-white/10 text-white text-xs rounded-full px-3 py-1"
                      >
                        {asset.coin} ({asset.network}): {asset.amount?.toLocaleString()}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredUsers.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-400 text-lg">No users found matching your search.</p>
        </div>
      )}

    </div>
  </div>
)




}