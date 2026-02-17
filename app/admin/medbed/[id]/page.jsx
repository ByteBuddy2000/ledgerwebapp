"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { ArrowLeft, Loader2, CheckCircle, XCircle } from "lucide-react";

export default function MedbedDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [registration, setRegistration] = useState(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);

  const fetchRegistration = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/medbed/${id}`);
      const data = await res.json();
      if (res.ok && data.success) {
        setRegistration(data.registration);
      } else {
        toast.error(data.error || "Failed to load details");
      }
    } catch (err) {
      console.error(err);
      toast.error("Server error");
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (action) => {
    if (!confirm(`Are you sure you want to ${action} this registration?`)) return;
    setProcessing(true);
    try {
      const res = await fetch("/api/admin/medbed", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, action }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        toast.success(`Registration ${action}ed successfully`);
        setRegistration(data.registration);
      } else {
        toast.error(data.error || "Action failed");
      }
    } catch (err) {
      console.error(err);
      toast.error("Server error");
    } finally {
      setProcessing(false);
    }
  };

  useEffect(() => {
    fetchRegistration();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#0d0f1a] text-gray-300">
        <Loader2 className="w-10 h-10 animate-spin" />
        <span className="ml-2">Loading details…</span>
      </div>
    );
  }

  if (!registration) {
    return (
      <div className="p-6 text-center text-gray-400 bg-[#0d0f1a] min-h-screen">
        <p>No registration found.</p>
        <button
          onClick={() => router.push("/admin/medbed")}
          className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded text-white"
        >
          Back
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0d0f1a] text-gray-200 p-6">
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 text-sm text-gray-400 hover:text-gray-200 mb-6"
      >
        <ArrowLeft className="w-4 h-4" /> Back
      </button>

      <div className="max-w-3xl mx-auto bg-[#111426] border border-gray-700 rounded-xl shadow-md p-6">
        <h1 className="text-2xl font-semibold mb-4 text-white">
          Registration Details
        </h1>

        <div className="grid sm:grid-cols-2 gap-4 text-sm">
          <Info label="Full Name" value={registration.name} />
          <Info label="Email" value={registration.email} />
          <Info label="Phone" value={registration.phone} />
          <Info label="Color" value={registration.color} />
          <Info label="Amount (XRP)" value={registration.amountXrp ?? "-"} />
          <Info label="Status" value={registration.status} />
          <Info label='Address' value={registration.address ?? "-"} />
          <Info
            label="Admin Approved"
            value={registration.adminApproved ? "Yes" : "No"}
          />
          <Info
            label="Date Registered"
            value={new Date(registration.createdAt).toLocaleString()}
          />
          {registration.txHash && (
            <Info label="Transaction Hash" value={registration.txHash} />
          )}
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          <button
            disabled={processing}
            onClick={() => handleAction("approve")}
            className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded disabled:opacity-50"
          >
            <CheckCircle className="w-4 h-4" />
            {processing ? "Processing..." : "Approve"}
          </button>

          <button
            disabled={processing}
            onClick={() => handleAction("reject")}
            className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded disabled:opacity-50"
          >
            <XCircle className="w-4 h-4" />
            {processing ? "Processing..." : "Reject"}
          </button>
        </div>
      </div>
    </div>
  );
}

function Info({ label, value }) {
  return (
    <div className="flex flex-col">
      <span className="text-gray-400 text-xs uppercase tracking-wider">
        {label}
      </span>
      <span className="text-white text-sm font-medium break-words">
        {value ?? "-"}
      </span>
    </div>
  );
}
