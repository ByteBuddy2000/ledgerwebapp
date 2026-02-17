"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Users,
  CreditCard,
  AlertTriangle,
  DollarSign,
  Activity,
  UserPlus,
  List,
  Shield,
  BarChart3,
  BetweenVerticalStart,
  Loader2,
  Bed, // added Bed icon
} from "lucide-react";
import Link from "next/link";
import AdminTopNav from "./_components/AdminTopNav";
import { useRef, useEffect, useState } from "react";

const recentActivity = [
  {
    id: 1,
    user: "John Doe",
    action: "Account Created",
    time: "2 minutes ago",
    status: "success",
    avatar: "/placeholder.svg?height=32&width=32",
  },
  {
    id: 2,
    user: "Jane Smith",
    action: "KYC Approved",
    time: "5 minutes ago",
    status: "success",
    avatar: "/placeholder.svg?height=32&width=32",
  },
  {
    id: 3,
    user: "Mike Johnson",
    action: "Large Transaction",
    time: "10 minutes ago",
    status: "warning",
    avatar: "/placeholder.svg?height=32&width=32",
  },
  {
    id: 4,
    user: "Sarah Wilson",
    action: "KYC Rejected",
    time: "15 minutes ago",
    status: "error",
    avatar: "/placeholder.svg?height=32&width=32",
  },
  {
    id: 5,
    user: "David Chen",
    action: "Password Reset",
    time: "20 minutes ago",
    status: "info",
    avatar: "/placeholder.svg?height=32&width=32",
  },
];

const kycQueue = [
  {
    id: 1,
    name: "Alex Thompson",
    email: "alex@example.com",
    submitted: "2 hours ago",
    status: "pending",
    documents: 3,
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: 2,
    name: "Maria Garcia",
    email: "maria@example.com",
    submitted: "4 hours ago",
    status: "review",
    documents: 2,
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: 3,
    name: "David Chen",
    email: "david@example.com",
    submitted: "6 hours ago",
    status: "pending",
    documents: 3,
    avatar: "/placeholder.svg?height=40&width=40",
  },
];

export default function AdminDashboard({ recentCustomers = [] }) {
  // Pending withdrawals state
  const [pendingWithdrawals, setPendingWithdrawals] = useState([]);
  const [loadingWithdrawals, setLoadingWithdrawals] = useState(true);

  // For notification badge
  const [pendingWithdrawalCount, setPendingWithdrawalCount] = useState(0);

  // Ref for scrolling to section
  const withdrawalSectionRef = useRef(null);

  useEffect(() => {
    async function fetchPendingWithdrawals() {
      setLoadingWithdrawals(true);
      try {
        const res = await fetch("/api/admin/withdrawals");
        const data = await res.json();
        if (data.success) {
          setPendingWithdrawals(data.withdrawals || []);
          setPendingWithdrawalCount((data.withdrawals || []).length);
        }
      } catch (err) {}
      setLoadingWithdrawals(false);
    }
    fetchPendingWithdrawals();
  }, []);

  // Scroll to withdrawal section
  const handleGoToWithdrawals = () => {
    withdrawalSectionRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Approve handler
  const [processingWithdrawalId, setProcessingWithdrawalId] = useState(null);

  const handleApprove = async (withdrawalId) => {
    setProcessingWithdrawalId(withdrawalId);
    await fetch(`/api/admin/withdrawals/${withdrawalId}/approve`, { method: "POST" });
    setPendingWithdrawals((prev) => prev.filter(w => w._id !== withdrawalId));
    setPendingWithdrawalCount((prev) => Math.max(prev - 1, 0));
    setProcessingWithdrawalId(null);
  };

  // Decline handler
  const handleDecline = async (withdrawalId) => {
    setProcessingWithdrawalId(withdrawalId);
    await fetch(`/api/admin/withdrawals/${withdrawalId}/reject`, { method: "POST" });
    setPendingWithdrawals((prev) => prev.filter(w => w._id !== withdrawalId));
    setPendingWithdrawalCount((prev) => Math.max(prev - 1, 0));
    setProcessingWithdrawalId(null);
  };

  return (
  <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-[#1a012b] via-black to-[#001933] text-white">

    {/* Background Glow Effects */}
    <div className="absolute top-[-100px] right-[-100px] w-[400px] h-[400px] bg-primary/20 blur-[120px] rounded-full opacity-30 animate-pulse" />
    <div className="absolute bottom-[-120px] left-[-120px] w-[400px] h-[400px] bg-blue-600/20 blur-[140px] rounded-full opacity-20" />

    <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

      <AdminTopNav />

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-10"
      >
        <h1 className="text-3xl font-bold tracking-tight">
          Admin Dashboard
        </h1>
        <p className="text-muted-foreground mt-2">
          Manage users, withdrawals and platform operations.
        </p>
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-2 md:grid-cols-4 gap-5 mb-10"
      >
        <Link href="/admin/seed">
          <div className="group relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 flex flex-col items-center justify-center hover:border-primary/40 hover:bg-white/10 transition-all duration-300 cursor-pointer">
            <UserPlus className="w-7 h-7 mb-3 text-primary group-hover:scale-110 transition" />
            <span className="text-sm font-medium">View Data</span>
          </div>
        </Link>

        <Link href="/admin/customers">
          <div className="group bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 flex flex-col items-center justify-center hover:border-primary/40 hover:bg-white/10 transition-all duration-300 cursor-pointer">
            <List className="w-7 h-7 mb-3 text-primary group-hover:scale-110 transition" />
            <span className="text-sm font-medium">Customer List</span>
          </div>
        </Link>

        <Link href="/admin/wallet">
          <div className="group bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 flex flex-col items-center justify-center hover:border-primary/40 hover:bg-white/10 transition-all duration-300 cursor-pointer">
            <BetweenVerticalStart className="w-7 h-7 mb-3 text-primary group-hover:scale-110 transition" />
            <span className="text-sm font-medium">Top-Up Assets</span>
          </div>
        </Link>

        <button
          onClick={handleGoToWithdrawals}
          className="group relative bg-yellow-500/10 backdrop-blur-xl border border-yellow-400/30 rounded-2xl p-6 flex flex-col items-center justify-center hover:bg-yellow-400/20 transition-all duration-300"
        >
          <DollarSign className="w-7 h-7 mb-3 text-yellow-300 group-hover:scale-110 transition" />
          <span className="text-sm font-medium text-yellow-200">
            Withdrawals
          </span>

          {pendingWithdrawalCount > 0 && (
            <span className="absolute top-3 right-3 bg-yellow-400 text-black text-xs font-bold rounded-full px-2 py-0.5 shadow-lg">
              {pendingWithdrawalCount}
            </span>
          )}
        </button>
      </motion.div>

      {/* Pending Withdrawals Section */}
      <motion.div
        ref={withdrawalSectionRef}
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl"
      >
        <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
          <DollarSign className="w-5 h-5 text-yellow-400" />
          Pending Withdrawals
          {pendingWithdrawalCount > 0 && (
            <span className="bg-yellow-400 text-black text-xs font-bold rounded-full px-2 py-0.5">
              {pendingWithdrawalCount}
            </span>
          )}
        </h2>

        {loadingWithdrawals ? (
          <div className="flex justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-yellow-400" />
          </div>
        ) : pendingWithdrawals.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            No pending withdrawals.
          </div>
        ) : (
          <div className="space-y-6">
            {pendingWithdrawals.map((w) => (
              <motion.div
                key={w._id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative bg-gradient-to-br from-yellow-900/20 to-black/40 border border-yellow-500/20 rounded-2xl p-6 flex flex-col lg:flex-row justify-between gap-6"
              >
                {processingWithdrawalId === w._id && (
                  <div className="absolute inset-0 bg-black/60 flex items-center justify-center rounded-2xl z-10">
                    <Loader2 className="animate-spin w-8 h-8 text-yellow-400" />
                  </div>
                )}

                {/* User Info */}
                <div className="flex items-center gap-4">
                  <Avatar>
                    <AvatarImage src={w.user?.avatar || "/placeholder.svg"} />
                    <AvatarFallback>
                      {w.user?.username
                        ? w.user.username[0]
                        : "U"}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold">{w.user?.username}</p>
                    <p className="text-xs text-muted-foreground">
                      {w.user?.email}
                    </p>
                    <p className="text-xs text-yellow-300 mt-1">
                      {w.coin} • {w.network}
                    </p>
                  </div>
                </div>

                {/* Amount + Wallet */}
                <div className="flex flex-col gap-2">
                  <span className="text-lg font-bold text-yellow-300">
                    {w.amount.toLocaleString()} {w.coin}
                  </span>
                  <span className="text-xs text-muted-foreground font-mono break-all">
                    {w.walletAddress}
                  </span>
                </div>

                {/* Actions */}
                <div className="flex gap-3 items-center">
                  <Button
                    size="sm"
                    className="bg-green-600 hover:bg-green-700"
                    onClick={() => handleApprove(w._id)}
                    disabled={processingWithdrawalId === w._id}
                  >
                    Approve
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleDecline(w._id)}
                    disabled={processingWithdrawalId === w._id}
                  >
                    Decline
                  </Button>
                </div>

                <div className="text-xs text-muted-foreground">
                  {new Date(w.createdAt).toLocaleString()}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>

    </div>
  </div>
);

}