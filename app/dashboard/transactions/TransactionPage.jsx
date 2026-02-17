"use client";
import React, { useEffect, useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowDownLeft, ArrowUpRight, LineChart } from "lucide-react";
import NavHeader from "../components/NavHeader/NavHeader";

const TransactionPage = () => {
  const [receivedTransactions, setReceivedTransactions] = useState([]);
  const [sentTransactions, setSentTransactions] = useState([]);
  const [stockTransactions, setStockTransactions] = useState([]);

  useEffect(() => {
    async function fetchTransactions() {
      try {
        const res = await fetch("/api/transactions");
        const data = await res.json();
        if (data.success) {
          setReceivedTransactions(data.deposits || []);
          setSentTransactions(data.withdrawals || []);
        }
      } catch (error) {
        console.error("Error fetching transactions:", error);
      }
    }

    async function fetchUserStocks() {
      try {
        const res = await fetch("/api/user-stocks?all=true");
        const data = await res.json();
        if (data.success && Array.isArray(data.stocks)) {
          setStockTransactions(data.stocks);
        }
      } catch (error) {
        console.error("Error fetching user stocks:", error);
      }
    }

    async function markAllRead() {
      try {
        await fetch("/api/transactions/mark-read", { method: "POST" });
      } catch { }
    }

    fetchTransactions();
    fetchUserStocks();
    markAllRead();
  }, []);

  // Move renderCard outside useEffect
  const renderCard = (tx, type) => {
    // Mobile-first responsive card
    let statusColor = "text-yellow-400";
    if (tx.status === "approved" || tx.status === "confirmed") statusColor = "text-green-500";
    if (tx.status === "failed" || tx.status === "rejected") statusColor = "text-red-500";

    let bgColor = "bg-gray-900/80";
    if (type === "received") bgColor = "bg-green-900/60";
    if (type === "sent") bgColor = "bg-red-900/60";
    if (type === "stocks") bgColor = "bg-blue-900/60";

    let icon = null;
    if (type === "received") icon = <ArrowDownLeft className="w-6 h-6 text-green-400" />;
    if (type === "sent") icon = <ArrowUpRight className="w-6 h-6 text-red-400" />;
    if (type === "stocks") icon = <LineChart className="w-6 h-6 text-blue-400" />;

    return (
      <div
        key={tx._id}
        className={`relative p-4 sm:p-5 rounded-xl border border-white/10 ${bgColor} shadow-lg transition-all duration-300 hover:scale-[1.01] flex flex-col gap-2`}
      >
        {/* Premium Glow Effects */}
        <div className="absolute inset-0 pointer-events-none z-0">
          <div className="absolute top-20 right-1/4 w-64 h-64 sm:w-96 sm:h-96 bg-primary/20 rounded-full blur-3xl opacity-30 animate-pulse"></div>
          <div className="absolute bottom-20 left-1/4 w-48 h-48 sm:w-72 sm:h-72 bg-primary/10 rounded-full blur-3xl opacity-20"></div>
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/5"></div>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-black/30">{icon}</div>
          <div className="flex-1 min-w-0">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-3">
              <div className="text-base sm:text-lg font-bold text-white truncate">
                {type === "received" && "+"}
                {type === "sent" && "-"}
                {tx.amount?.toLocaleString?.() || tx.shares} {tx.coin || tx.symbol}
              </div>
              <div className="text-xs text-gray-400 text-right">
                {tx.createdAt && !isNaN(new Date(tx.createdAt))
                  ? new Date(tx.createdAt).toLocaleString()
                  : "Date unavailable"}
              </div>
            </div>
            <div className="mt-2 text-xs sm:text-sm text-gray-300 space-y-1">
              {type === "stocks" ? (
                <>
                  <div>
                    <span className="font-semibold text-white">Shares:</span> {tx.shares}
                  </div>
                  <div>
                    <span className="font-semibold text-white">Price:</span> ${tx.price}
                  </div>
                  <div>
                    <span className="font-semibold text-white">Status:</span> <span className={`font-semibold ${statusColor}`}>{tx.status}</span>
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <span className="font-semibold text-white">Type:</span> {type === "received" ? "Deposit" : "Withdrawal"}
                  </div>
                  <div>
                    <span className="font-semibold text-white">Status:</span> <span className={`font-semibold ${statusColor}`}>{tx.status}</span>
                  </div>
                  {tx.transactionId && (
                    <div className="truncate">
                      <span className="font-semibold text-white">Tx ID:</span> {tx.transactionId}
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-bl from-[#05011aff] via-[#000000] to-[#001F3F] py-6 px-2 sm:px-4">
      <div className="max-w-5xl mx-auto w-full">
        <NavHeader />
        <Card className="border-none bg-black/30 shadow-xl backdrop-blur-lg">
          <CardHeader>
            <CardTitle>
              <span className="bg-gradient-to-r from-sky-400 via-cyan-300 to-blue-400 bg-clip-text text-transparent text-xl sm:text-2xl font-extrabold drop-shadow-lg">
                Transaction History
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="received" className="w-full mx-auto">
              <TabsList
                className="mx-auto mb-4 flex flex-nowrap justify-center gap-2 bg-gray-900/80 p-2 rounded-xl shadow-lg border border-gray-700 overflow-x-auto scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent"
              >
                <TabsTrigger
                  value="received"
                  className="flex items-center gap-2 px-3 py-2 rounded-lg font-medium text-gray-200 data-[state=active]:text-white data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-500 data-[state=active]:to-emerald-600 transition flex-shrink-0"
                >
                  <ArrowDownLeft className="w-4 h-4" />
                  <span>Received</span>
                </TabsTrigger>

                <TabsTrigger
                  value="sent"
                  className="flex items-center gap-2 px-3 py-2 rounded-lg font-medium text-gray-200 data-[state=active]:text-white data-[state=active]:bg-gradient-to-r data-[state=active]:from-red-500 data-[state=active]:to-rose-600 transition flex-shrink-0"
                >
                  <ArrowUpRight className="w-4 h-4" />
                  <span>Sent</span>
                </TabsTrigger>

                <TabsTrigger
                  value="stocks"
                  className="flex items-center gap-2 px-3 py-2 rounded-lg font-medium text-gray-200 data-[state=active]:text-white data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-indigo-600 transition flex-shrink-0"
                >
                  <LineChart className="w-4 h-4" />
                  <span>Stocks</span>
                </TabsTrigger>
              </TabsList>

              {/* Received */}
              <TabsContent value="received">
                {receivedTransactions.length === 0 ? (
                  <div className="text-center text-gray-400 py-8 text-base">
                    No received transactions found.
                  </div>
                ) : (
                  <div className="flex flex-col gap-3">
                    {receivedTransactions.map((tx) =>
                      renderCard(tx, "received")
                    )}
                  </div>
                )}
              </TabsContent>
              {/* Sent */}
              <TabsContent value="sent">
                {sentTransactions.length === 0 ? (
                  <div className="text-center text-gray-400 py-8 text-base">
                    No sent transactions found.
                  </div>
                ) : (
                  <div className="flex flex-col gap-3">
                    {sentTransactions.map((tx) =>
                      renderCard(tx, "sent")
                    )}
                  </div>
                )}
              </TabsContent>
              {/* Stocks */}
              <TabsContent value="stocks">
                {stockTransactions.length === 0 ? (
                  <div className="text-center text-gray-400 py-8 text-base">
                    No stock transactions found.
                  </div>
                ) : (
                  <div className="flex flex-col gap-3">
                    {stockTransactions.map((tx) =>
                      renderCard(tx, "stocks")
                    )}
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TransactionPage;
