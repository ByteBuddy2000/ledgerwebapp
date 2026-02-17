"use client";

import { useEffect, useState, useMemo } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, X, RefreshCw } from "lucide-react";
import Link from "next/link";
import AdminTopNav from "@/app/admin/_components/AdminTopNav";

export default function AdminStocksPage() {
  const [rawPurchases, setRawPurchases] = useState([]);
  const [rawSells, setRawSells] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [processingId, setProcessingId] = useState(null);
  const [confirmAction, setConfirmAction] = useState({ id: null, action: null });
  const [approvedSharesMap, setApprovedSharesMap] = useState({});
  const [buySearch, setBuySearch] = useState("");
  const [buyStatus, setBuyStatus] = useState("all");
  const [sellSearch, setSellSearch] = useState("");
  const [sellStatus, setSellStatus] = useState("all");

  useEffect(() => {
    let mounted = true;
    async function fetchAll() {
      setLoading(true);
      setError(null);
      try {
        const [pRes, sRes] = await Promise.all([
          fetch("/api/user-stocks"),
          fetch("/api/admin/sell-requests"),
        ]);
        const pData = await pRes.json();
        const sData = await sRes.json();
        if (mounted) {
          setRawPurchases(pData.stocks || []);
          setRawSells(sData.sells || []);
        }
      } catch (err) {
        console.error(err);
        if (mounted) setError(err.message || "Failed to fetch data");
      } finally {
        if (mounted) setLoading(false);
      }
    }
    fetchAll();
    return () => (mounted = false);
  }, []);

  const refresh = async () => {
    setLoading(true);
    setError(null);
    try {
      const [pRes, sRes] = await Promise.all([
        fetch("/api/user-stocks"),
        fetch("/api/admin/sell-requests"),
      ]);
      const pData = await pRes.json();
      const sData = await sRes.json();
      setRawPurchases(pData.stocks || []);
      setRawSells(sData.sells || []);
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to refresh");
    }
    setLoading(false);
  };

  const buys = useMemo(() => rawPurchases.filter((r) => !/sell/i.test(String(r.status || ""))), [rawPurchases]);
  const sells = useMemo(() => rawSells.filter((r) => /sell/i.test(String(r.status || ""))), [rawSells]);

  const filteredBuys = useMemo(() => {
    return buys.filter((b) => {
      const q = buySearch.trim().toLowerCase();
      if (q) {
        const matches = (b.symbol || "").toLowerCase().includes(q) ||
          (b.user?.username || "").toLowerCase().includes(q) ||
          (b.user?.email || "").toLowerCase().includes(q);
        if (!matches) return false;
      }
      if (buyStatus !== "all" && String(b.status || "").toLowerCase() !== buyStatus) return false;
      return true;
    });
  }, [buys, buySearch, buyStatus]);

  const filteredSells = useMemo(() => {
    return sells.filter((s) => {
      const q = sellSearch.trim().toLowerCase();
      if (q) {
        const matches = (s.symbol || "").toLowerCase().includes(q) ||
          (s.user?.username || "").toLowerCase().includes(q) ||
          (s.user?.email || "").toLowerCase().includes(q);
        if (!matches) return false;
      }
      if (sellStatus !== "all" && String(s.status || "").toLowerCase() !== sellStatus) return false;
      return true;
    });
  }, [sells, sellSearch, sellStatus]);

  const twoStepConfirm = (id, action, handler) => {
    if (confirmAction.id !== id || confirmAction.action !== action) {
      setConfirmAction({ id, action });
      setTimeout(() => setConfirmAction({ id: null, action: null }), 4000);
      return;
    }
    handler();
  };

  const handlePurchaseAction = async (id, action) => {
    twoStepConfirm(id, action, async () => {
      setProcessingId(id);
      try {
        const res = await fetch("/api/stocks/approve", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id, action }),
        });
        const data = await res.json();
        if (!data.success) throw new Error(data.error || "Action failed");
        setRawPurchases((prev) => prev.filter((p) => p._id !== id));
      } catch (err) {
        console.error(err);
        setError(err.message || "Failed to perform action");
      } finally {
        setProcessingId(null);
        setConfirmAction({ id: null, action: null });
      }
    });
  };

  const handleSellAction = async (id, action) => {
    twoStepConfirm(id, action, async () => {
      setProcessingId(id);
      try {
        const body = { id, action };
        if (action === "approve") {
          const approved = Number(approvedSharesMap[id]);
          if (approved > 0) body.approvedShares = approved;
        }
        const res = await fetch("/api/admin/process-sell", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
        const data = await res.json();
        if (!data.success) throw new Error(data.error || "Sell action failed");

        const updated = data.stock;
        setRawSells((prev) => {
          if (!updated) return prev.filter((p) => p._id !== id);
          if (updated.status === "sold" || String(updated.status).toLowerCase().includes("reject")) {
            return prev.filter((p) => p._id !== id);
          }
          return prev.map((p) => (p._id === id ? updated : p));
        });

        setApprovedSharesMap((m) => {
          const copy = { ...m };
          delete copy[id];
          return copy;
        });
      } catch (err) {
        console.error(err);
        setError(err.message || "Failed to process sell");
      } finally {
        setProcessingId(null);
        setConfirmAction({ id: null, action: null });
      }
    });
  };

  return (
  <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-[#1a012b] via-black to-[#001933] text-white">
      <div className="max-w-6xl mx-auto px-4 space-y-8">
        <AdminTopNav />
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 py-8">
          <h1 className="text-2xl font-bold">Admin — Stocks</h1>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button onClick={refresh} className="flex items-center gap-2 text-sm bg-white/5 border border-white/10 px-3 py-1 rounded hover:bg-white/6">
              <RefreshCw size={16} /> Refresh
            </button>
            <Link href="/admin/stocks/view">
              <Button variant="secondary" size="sm">View Users Stocks</Button>
            </Link>
            <Link href="/admin">
              <Button variant="ghost" size="sm">Back</Button>
            </Link>
          </div>
        </div>

        {/* Purchases Table */}
        <Card className="bg-gray-800 border border-gray-700 rounded-lg">
          <CardHeader>
            <CardTitle className="text-white">Pending Stock Buys</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-4">
              <input
                type="search"
                placeholder="Search symbol or user..."
                value={buySearch}
                onChange={(e) => setBuySearch(e.target.value)}
                className="bg-gray-800 border border-gray-700 rounded px-3 py-2 text-sm text-white w-full sm:w-64"
              />
              <select value={buyStatus} onChange={(e) => setBuyStatus(e.target.value)} className="bg-gray-800 border border-gray-700 rounded px-3 py-2 text-sm text-white">
                <option value="all">All statuses</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left table-auto">
                <thead>
                  <tr className="text-sm text-gray-300 border-b border-white/6">
                    <th className="py-2 px-3">User</th>
                    <th className="py-2 px-3">Symbol</th>
                    <th className="py-2 px-3">Shares</th>
                    <th className="py-2 px-3">Price</th>
                    <th className="py-2 px-3">Status</th>
                    <th className="py-2 px-3">Requested</th>
                    <th className="py-2 px-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {loading && <tr><td colSpan={7} className="py-6 text-center text-gray-400">Loading...</td></tr>}
                  {!loading && filteredBuys.length === 0 && <tr><td colSpan={7} className="py-6 text-center text-gray-400">No pending buy requests.</td></tr>}
                  {filteredBuys.map((s) => (
                    <tr key={s._id} className="border-b border-white/4">
                      <td className="py-3 px-3 min-w-0">
                        <div className="text-sm font-medium">{s.user?.username || s.user?.email || "Unknown"}</div>
                        <div className="text-xs text-gray-400">{s.user?.email}</div>
                      </td>
                      <td className="py-3 px-3">{s.symbol}</td>
                      <td className="py-3 px-3">{s.shares}</td>
                      <td className="py-3 px-3">${s.price}</td>
                      <td className="py-3 px-3">
                        <span className={`px-2 py-1 rounded text-xs ${s.status === 'pending' ? 'bg-yellow-500 text-black' : s.status === 'approved' ? 'bg-green-600' : 'bg-red-600'}`}>
                          {s.status}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-xs text-gray-400">{new Date(s.createdAt).toLocaleString()}</td>
                      <td className="py-3 px-3">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handlePurchaseAction(s._id, "approve")}
                            disabled={processingId === s._id}
                            className={`px-3 py-1 rounded text-sm font-semibold ${confirmAction.id === s._id && confirmAction.action === 'approve' ? 'bg-green-700' : 'bg-green-600 hover:bg-green-700'}`}
                          >
                            {processingId === s._id ? 'Processing...' : (confirmAction.id === s._id && confirmAction.action === 'approve' ? 'Confirm' : 'Approve')}
                          </button>
                          <button
                            onClick={() => handlePurchaseAction(s._id, "reject")}
                            disabled={processingId === s._id}
                            className={`px-3 py-1 rounded text-sm font-semibold ${confirmAction.id === s._id && confirmAction.action === 'reject' ? 'bg-red-700' : 'bg-red-600 hover:bg-red-700'}`}
                          >
                            {processingId === s._id ? 'Processing...' : (confirmAction.id === s._id && confirmAction.action === 'reject' ? 'Confirm' : 'Reject')}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Sells Table */}
        <Card className="bg-gray-800 border border-gray-700 rounded-lg">
          <CardHeader>
            <CardTitle>Pending Sell Requests</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-4">
              <input
                type="search"
                placeholder="Search symbol or user..."
                value={sellSearch}
                onChange={(e) => setSellSearch(e.target.value)}
                className="bg-gray-800 border border-gray-700 rounded px-3 py-2 text-sm text-white w-full sm:w-64"
              />
              <select value={sellStatus} onChange={(e) => setSellStatus(e.target.value)} className="bg-gray-800 border border-gray-700 rounded px-3 py-2 text-sm text-white">
                <option value="all">All statuses</option>
                <option value="pending-sell">Pending</option>
                <option value="partial-sold">Partial</option>
                <option value="sold">Sold</option>
                <option value="sell-rejected">Rejected</option>
              </select>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left table-auto">
                <thead>
                  <tr className="text-sm text-gray-300 border-b border-white/6">
                    <th className="py-2 px-3">User</th>
                    <th className="py-2 px-3">Symbol</th>
                    <th className="py-2 px-3">Requested</th>
                    <th className="py-2 px-3">Remaining</th>
                    <th className="py-2 px-3">Price</th>
                    <th className="py-2 px-3">Process</th>
                    <th className="py-2 px-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {loading && <tr><td colSpan={7} className="py-6 text-center text-gray-400">Loading...</td></tr>}
                  {!loading && filteredSells.length === 0 && <tr><td colSpan={7} className="py-6 text-center text-gray-400">No pending sell requests.</td></tr>}
                  {filteredSells.map((s) => {
                    const remaining = Math.max(0, (s.shares || 0) - (s.processedShares || 0));
                    return (
                      <tr key={s._id} className="border-b border-white/4">
                        <td className="py-3 px-3 min-w-0">
                          <div className="text-sm font-medium">{s.user?.username || s.user?.email || "Unknown"}</div>
                          <div className="text-xs text-gray-400">{s.user?.email}</div>
                        </td>
                        <td className="py-3 px-3">{s.symbol}</td>
                        <td className="py-3 px-3">{s.shares}</td>
                        <td className="py-3 px-3">{remaining}</td>
                        <td className="py-3 px-3">${s.price}</td>
                        <td className="py-3 px-3">
                          <input
                            type="number"
                            min="1"
                            max={remaining}
                            placeholder={`max ${remaining}`}
                            value={approvedSharesMap[s._id] ?? ""}
                            onChange={(e) => setApprovedSharesMap(prev => ({ ...prev, [s._id]: e.target.value }))}
                            className="bg-gray-800 border border-gray-700 rounded px-2 py-1 text-sm text-white w-24"
                          />
                        </td>
                        <td className="py-3 px-3">
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleSellAction(s._id, "approve")}
                              disabled={processingId === s._id || remaining <= 0}
                              className={`px-3 py-1 rounded text-sm font-semibold ${confirmAction.id === s._id && confirmAction.action === 'approve' ? 'bg-green-700' : 'bg-green-600 hover:bg-green-700'}`}
                            >
                              {processingId === s._id ? 'Processing...' : (confirmAction.id === s._id && confirmAction.action === 'approve' ? 'Confirm' : 'Approve')}
                            </button>
                            <button
                              onClick={() => handleSellAction(s._id, "reject")}
                              disabled={processingId === s._id}
                              className={`px-3 py-1 rounded text-sm font-semibold ${confirmAction.id === s._id && confirmAction.action === 'reject' ? 'bg-red-700' : 'bg-red-600 hover:bg-red-700'}`}
                            >
                              {processingId === s._id ? 'Processing...' : (confirmAction.id === s._id && confirmAction.action === 'reject' ? 'Confirm' : 'Reject')}
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  );
}
