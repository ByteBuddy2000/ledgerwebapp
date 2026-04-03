"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Bed, ChevronLeft, Loader2 } from "lucide-react";
import Link from "next/link";

const STATUS_FILTERS = ["all", "pending_payment", "paid", "cancelled"];
const friendly = { pending_payment: "Pending", paid: "Paid", cancelled: "Cancelled" };

export default function AdminMedbedPage() {
  const router = useRouter();
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState(null);
  const [activeFilter, setActiveFilter] = useState("all");

  const fetchRegs = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/medbed");
      const data = await res.json();
      if (res.ok && data.success) {
        setRegistrations(data.registrations || []);
      } else {
        toast.error(data.error || "Failed to load registrations");
      }
    } catch (err) {
      console.error(err);
      toast.error("Server error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRegs();
  }, []);

  const handleAction = async (id, action) => {
    if (!confirm(`Are you sure you want to ${action} this registration?`)) return;
    setProcessingId(id);
    try {
      const res = await fetch("/api/admin/medbed", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, action }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        toast.success(`${action === "approve" ? "Approved" : "Rejected"}.`);
        setRegistrations((prev) => prev.map((r) => (r._id === id ? data.registration : r)));
      } else {
        toast.error(data.error || "Action failed");
      }
    } catch (err) {
      console.error(err);
      toast.error("Server error");
    } finally {
      setProcessingId(null);
    }
  };

  const stats = useMemo(() => {
    const total = registrations.length;
    const pending = registrations.filter((r) => r.status === "pending_payment").length;
    const paid = registrations.filter((r) => r.status === "paid").length;
    const cancelled = registrations.filter((r) => r.status === "cancelled").length;
    return { total, pending, paid, cancelled };
  }, [registrations]);

  const shownRegistrations = useMemo(() => {
    if (activeFilter === "all") return registrations;
    return registrations.filter((r) => r.status === activeFilter);
  }, [registrations, activeFilter]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black text-gray-200 p-6">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md px-4 py-4 sm:px-6 sm:py-5 shadow-lg">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

              {/* Left Section */}
              <div className="flex items-center gap-3">
                <Link href="/admin">
                  <button className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 text-white transition-all hover:bg-white/10 hover:scale-105">
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                </Link>

                <div className="flex items-center gap-2 text-white">
                  <div className="rounded-xl bg-blue-500/10 p-2">
                    <Bed className="h-5 w-5 text-blue-400" />
                  </div>
                  <div>
                    <h1 className="text-lg sm:text-xl md:text-2xl font-semibold tracking-tight">
                      Medbed Registrations
                    </h1>
                    <p className="text-xs sm:text-sm text-white/60">
                      Manage all submitted registrations
                    </p>
                  </div>
                </div>
              </div>

              {/* Return Link */}
              {/* <Link
                href="/admin"
                className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 px-4 py-2 text-sm font-medium text-white shadow-md transition-all hover:scale-105"
              >
                Return to Admin
              </Link> */}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
          <StatBox label="Total" value={stats.total} />
          <StatBox label="Pending" value={stats.pending} color="amber" />
          <StatBox label="Paid" value={stats.paid} color="emerald" />
          <StatBox label="Cancelled" value={stats.cancelled} color="rose" />
        </div>

        <div className="mb-4 flex flex-wrap gap-2">
          {STATUS_FILTERS.map((status) => (
            <button
              key={status}
              onClick={() => setActiveFilter(status)}
              className={`rounded-lg border px-3 py-1.5 text-xs font-semibold uppercase transition ${activeFilter === status
                  ? "bg-blue-600 text-white border-blue-500"
                  : "bg-slate-800 text-gray-300 border-slate-700 hover:bg-slate-700"
                }`}
            >
              {status === "all" ? "All" : friendly[status] || status}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="rounded-xl border border-gray-700 bg-[#111426] p-10 text-center">
            <Loader2 className="mx-auto h-8 w-8 animate-spin text-blue-400" />
            <p className="mt-3 text-sm">Loading medbed registrations...</p>
          </div>
        ) : shownRegistrations.length === 0 ? (
          <div className="rounded-xl border border-gray-700 bg-[#111426] p-10 text-center text-gray-400">
            No registrations found for this filter.
          </div>
        ) : (
          <div className="grid gap-3">
            {shownRegistrations.map((reg) => (
              <div key={reg._id} className="rounded-xl border border-slate-700 bg-slate-900 p-4 sm:p-5">
                <div className="flex flex-wrap justify-between gap-3">
                  <div>
                    <p className="text-sm text-gray-300">Name</p>
                    <p className="text-lg font-semibold text-white">{reg.name}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-300">Amount (XRP)</p>
                    <p className="font-semibold text-cyan-300">{reg.amountXrp ?? "-"}</p>
                  </div>
                </div>

                <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-3">
                  <Badge label="Status" text={friendly[reg.status] ?? reg.status} variant={reg.status} />
                  <Badge label="Admin Approved" text={reg.adminApproved ? "Yes" : "No"} variant={reg.adminApproved ? "green" : "gray"} />
                  <div className="flex items-center justify-between rounded-lg bg-slate-800 p-2 text-xs text-gray-300">
                    <span className="font-medium">TX Hash</span>
                    <span className="text-right break-all text-blue-300">{reg.txHash || "Not set"}</span>
                  </div>
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  <button
                    disabled={processingId === reg._id}
                    onClick={() => handleAction(reg._id, "approve")}
                    className="rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-emerald-500 disabled:opacity-60"
                  >
                    {processingId === reg._id ? "Processing..." : "Approve"}
                  </button>
                  <button
                    disabled={processingId === reg._id}
                    onClick={() => handleAction(reg._id, "reject")}
                    className="rounded-lg bg-rose-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-rose-500 disabled:opacity-60"
                  >
                    {processingId === reg._id ? "Processing..." : "Reject"}
                  </button>
                  <button
                    onClick={() => router.push(`/admin/medbed/${reg._id}`)}
                    className="rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-blue-500"
                  >
                    View details
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function StatBox({ label, value, color = "sky" }) {
  const colorClass = {
    sky: "text-sky-300",
    amber: "text-amber-300",
    emerald: "text-emerald-300",
    rose: "text-rose-300",
  };
  return (
    <div className="rounded-xl border border-slate-700 bg-slate-900 p-4">
      <p className="text-xs text-gray-400 uppercase tracking-wider">{label}</p>
      <p className={`mt-1 text-2xl font-semibold ${colorClass[color]}`}>{value}</p>
    </div>
  );
}

function Badge({ label, text, variant }) {
  const classes = {
    paid: "bg-emerald-500/20 text-emerald-300 border border-emerald-500",
    pending_payment: "bg-amber-500/20 text-amber-300 border border-amber-500",
    cancelled: "bg-rose-500/20 text-rose-300 border border-rose-500",
    green: "bg-emerald-500/20 text-emerald-300 border border-emerald-500",
    gray: "bg-slate-700 text-slate-200 border border-slate-600",
  };

  return (
    <div className="rounded-lg border p-2 text-xs font-semibold" style={{ minWidth: "fit-content" }}>
      <div className="text-[10px] text-gray-400">{label}</div>
      <div className={`mt-1 rounded px-2 py-1 text-white ${classes[variant] || classes.gray}`}>{text}</div>
    </div>
  );
}
