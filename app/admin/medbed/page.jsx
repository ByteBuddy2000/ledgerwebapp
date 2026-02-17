"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Bed, Loader2 } from "lucide-react";

export default function AdminMedbedPage() {
  const router = useRouter();
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState(null);

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
        setRegistrations((prev) =>
          prev.map((r) => (r._id === id ? data.registration : r))
        );
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

  return (
    <div className="p-6 relative min-h-screen bg-[#0d0f1a] text-gray-200">
      {loading && (
        <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/60">
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="w-10 h-10 animate-spin text-white" />
            <div className="text-white text-sm">Loading registrations…</div>
          </div>
        </div>
      )}

      <div className="flex items-center gap-3 mb-6">
        <Bed className="w-6 h-6 text-blue-400" />
        <h1 className="text-2xl font-semibold text-white">Medbed Registrations</h1>
      </div>

      {!loading && registrations.length === 0 ? (
        <div className="flex flex-col items-center justify-center mt-16 text-gray-400">
          <Bed className="w-10 h-10 mb-2 opacity-50" />
          <p>No registrations found yet.</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-gray-700 bg-[#111426] shadow-md">
          <table className="w-full text-sm">
            <thead className="bg-[#161a2d] text-gray-300 uppercase text-xs">
              <tr>
                <th className="p-3 text-left">Name</th>
                <th className="p-3 text-left">Email</th>
                <th className="p-3 text-left">Phone</th>
                <th className="p-3 text-left">Color</th>
                <th className="p-3 text-left">Amount (XRP)</th>
                <th className="p-3 text-left">Status</th>
                <th className="p-3 text-left">Admin Approved</th>
                <th className="p-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {registrations.map((r) => (
                <tr
                  key={r._id}
                  className="border-t border-gray-800 hover:bg-[#1a1d33] transition"
                >
                  <td className="p-3 font-medium text-white">{r.name}</td>
                  <td className="p-3">{r.email}</td>
                  <td className="p-3">{r.phone}</td>
                  <td className="p-3">{r.color}</td>
                  <td className="p-3">{r.amountXrp ?? "-"}</td>
                  <td className="p-3">
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium ${
                        r.status === "paid"
                          ? "bg-green-500/20 text-green-400"
                          : r.status === "cancelled"
                          ? "bg-red-500/20 text-red-400"
                          : "bg-yellow-500/20 text-yellow-400"
                      }`}
                    >
                      {r.status || "pending"}
                    </span>
                  </td>
                  <td className="p-3">
                    {r.adminApproved ? (
                      <span className="text-green-400 font-medium">Yes</span>
                    ) : (
                      <span className="text-red-400 font-medium">No</span>
                    )}
                  </td>
                  <td className="p-3">
                    <div className="flex flex-wrap gap-2">
                      <button
                        disabled={processingId === r._id}
                        onClick={() => handleAction(r._id, "approve")}
                        className="bg-green-600 hover:bg-green-700 px-3 py-1.5 rounded-md text-xs text-white disabled:opacity-50"
                      >
                        {processingId === r._id ? "..." : "Approve"}
                      </button>
                      <button
                        disabled={processingId === r._id}
                        onClick={() => handleAction(r._id, "reject")}
                        className="bg-red-600 hover:bg-red-700 px-3 py-1.5 rounded-md text-xs text-white disabled:opacity-50"
                      >
                        {processingId === r._id ? "..." : "Reject"}
                      </button>
                      <button
                        onClick={() => router.push(`/admin/medbed/${r._id}`)}
                        className="bg-blue-700 hover:bg-blue-800 px-3 py-1.5 rounded-md text-xs text-white"
                      >
                        View
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
