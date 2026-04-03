"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Copy, CheckCircle2, Loader2 } from "lucide-react";

export default function MedbedSignupPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [color, setColor] = useState("white");
  const [submitting, setSubmitting] = useState(false);
  const [paymentInfo, setPaymentInfo] = useState(null);
  const [txHash, setTxHash] = useState("");
  const [confirming, setConfirming] = useState(false);
  const [step, setStep] = useState(1);
  const [copyStatus, setCopyStatus] = useState("");

  const fee = 10000; // registration fee in USD

  const RECEIVER_ADDRESS =
    process.env.NEXT_PUBLIC_XRP_RECEIVER_ADDRESS ||
    "rp5PMThCE9FtANy7ULtN4X43fNf7oXW6mt";

  const handleCopyAddress = async () => {
    try {
      await navigator.clipboard.writeText(paymentInfo.receiverAddress);
      setCopyStatus("Copied!");
      setTimeout(() => setCopyStatus(""), 1500);
    } catch (err) {
      console.error(err);
      setCopyStatus("Copy failed");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !phone || !email || !address) {
      toast.error("Please fill all required fields.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/medbed/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, phone, email, address, color }),
      });
      const data = await res.json();

      if (res.ok && data.success) {
        setPaymentInfo({
          registrationId: data.registrationId,
          amountXrp: data.amountXrp,
          receiverAddress: data.receiverAddress || RECEIVER_ADDRESS,
        });
        setStep(2);
        toast.success("Registration saved. Complete XRP payment to finish.");
      } else {
        toast.error(data.error || "Registration failed.");
      }
    } catch (err) {
      console.error(err);
      toast.error("Server error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleConfirm = async () => {
    if (!txHash) {
      toast.error("Please enter the transaction hash.");
      return;
    }
    setConfirming(true);

    try {
      const response = await fetch("/api/medbed/confirm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ registrationId: paymentInfo.registrationId, txHash }),
      });
      const result = await response.json();

      if (response.ok && result.success) {
        setStep(3);
        toast.success("Payment confirmed successfully.");
        setTimeout(() => router.push("/dashboard"), 1400);
      } else {
        toast.error(result.error || "Confirmation failed.");
      }
    } catch (error) {
      console.error(error);
      toast.error("Server error. Please try again.");
    } finally {
      setConfirming(false);
    }
  };

  const formatStatus = (s) => {
    if (s === "pending_payment") return "Pending payment";
    if (s === "paid") return "Paid";
    if (s === "cancelled") return "Cancelled";
    return s;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black text-white py-10 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-3xl">
        <div className="bg-slate-900 border border-slate-700 rounded-2xl shadow-xl p-6 sm:p-8">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-blue-300">Medbed Registration</h1>
            <p className="mt-2 text-gray-300">Secure a medbed slot with XRP payment and confirm with transaction hash.</p>
          </div>

          <div className="flex flex-col sm:flex-row gap-2 mb-6">
            {["Register", "Pay", "Confirm"].map((label, idx) => {
              const current = idx + 1;
              return (
                <div key={label} className="flex-1">
                  <div
                    className={`w-full rounded-xl border px-3 py-2 text-center text-xs font-semibold uppercase tracking-wide ${
                      step === current
                        ? "bg-blue-600 border-blue-500 text-white"
                        : step > current
                        ? "bg-emerald-600/20 border-emerald-500 text-emerald-200"
                        : "bg-slate-800 border-slate-700 text-gray-400"
                    }`}
                  >
                    {label}
                  </div>
                </div>
              );
            })}
          </div>

          {step === 1 && (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <InputField label="Full name" value={name} onChange={(v) => setName(v)} />
                <InputField label="Phone" value={phone} onChange={(v) => setPhone(v)} type="tel" />
                <InputField label="Email" value={email} onChange={(v) => setEmail(v)} type="email" />
                <SelectField label="Bed color" value={color} onChange={(v) => setColor(v)} options={["white", "black", "silver", "gold", "blue"]} />
              </div>

              <div>
                <label className="block text-gray-300 text-sm mb-1">Home address</label>
                <textarea
                  rows={3}
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-white placeholder:text-gray-500 focus:border-blue-400 focus:outline-none"
                  placeholder="e.g. 123 Main Street, City, Country"
                  required
                />
              </div>

              <div className="rounded-lg bg-slate-800 p-4 border border-slate-700 text-sm flex items-center justify-between">
                <span>Registration fee</span>
                <strong className="text-blue-300">${fee.toLocaleString()} USD</strong>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 px-5 py-2.5 text-white font-bold shadow-lg shadow-blue-500/40 hover:from-blue-500 hover:to-violet-500 disabled:opacity-60"
              >
                {submitting ? (
                  <span className="flex items-center justify-center gap-2"><Loader2 className="h-4 w-4 animate-spin" /> Submitting...</span>
                ) : (
                  "Submit registration"
                )}
              </button>
            </form>
          )}

          {step >= 2 && paymentInfo && (
            <div className="mt-4 rounded-xl border border-slate-700 bg-[#121630] p-4">
              <h2 className="text-lg font-semibold text-blue-300 mb-2">Payment details</h2>
              <div className="grid gap-2 sm:grid-cols-2">
                <StatCard label="Invoice" value={`#${paymentInfo.registrationId?.slice(-8)}`} />
                <StatCard label="Amount" value={`${paymentInfo.amountXrp} XRP`} />
                <StatCard label="Status" value={step === 3 ? "confirmed" : "awaiting payment"} />
              </div>

              <div className="mt-3 text-sm text-gray-300">Send XRP to the address below and verify with transaction hash.</div>
              <div className="mt-2 flex items-center gap-2 rounded-lg bg-slate-900 px-3 py-2 border border-slate-700">
                <div className="break-words text-sm text-white">{paymentInfo.receiverAddress}</div>
                <button
                  type="button"
                  onClick={handleCopyAddress}
                  className="ml-auto rounded-lg bg-blue-700 px-2 py-1 text-xs font-semibold text-white hover:bg-blue-600"
                >
                  <Copy className="h-4 w-4" />
                </button>
              </div>
              {copyStatus && <div className="text-xs text-emerald-300 mt-1">{copyStatus}</div>}

              <div className="mt-4 space-y-3">
                <input
                  value={txHash}
                  onChange={(e) => setTxHash(e.target.value)}
                  placeholder="Transaction hash"
                  className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-white placeholder:text-gray-500 focus:border-blue-400 focus:outline-none"
                />
                <button
                  onClick={handleConfirm}
                  disabled={confirming}
                  className="w-full rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-5 py-2.5 text-base font-semibold text-black shadow-lg shadow-cyan-500/30 hover:from-cyan-400 hover:to-blue-500 disabled:opacity-60"
                >
                  {confirming ? (
                    <span className="flex items-center justify-center gap-2"><Loader2 className="h-4 w-4 animate-spin" /> Confirming...</span>
                  ) : (
                    "Confirm payment"
                  )}
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="mt-5 rounded-xl border border-emerald-500 bg-emerald-500/10 p-4 text-emerald-200">
              <div className="flex items-start gap-2">
                <CheckCircle2 className="h-5 w-5" />
                <div>
                  <p className="font-semibold">Payment confirmed!</p>
                  <p className="text-sm text-gray-200">We received your transaction hash and your request is now marked as paid.</p>
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <button
              type="button"
              onClick={() => router.push("/dashboard")}
              className="mt-4 w-full rounded-xl border border-slate-700 bg-slate-800 px-5 py-2 text-sm font-semibold text-white hover:bg-slate-700"
            >
              Back to Dashboard
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function InputField({ label, value, onChange, type = "text" }) {
  return (
    <div>
      <label className="block text-gray-300 text-sm mb-1">{label}</label>
      <input
        value={value}
        type={type}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-white placeholder:text-gray-500 focus:border-blue-400 focus:outline-none"
        required
      />
    </div>
  );
}

function SelectField({ label, value, onChange, options }) {
  return (
    <div>
      <label className="block text-gray-300 text-sm mb-1">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-white focus:border-blue-400 focus:outline-none"
      >
        {options.map((opt) => (
          <option key={opt} value={opt} className="bg-slate-900 text-white">
            {opt.charAt(0).toUpperCase() + opt.slice(1)}
          </option>
        ))}
      </select>
    </div>
  );
}

function StatCard({ label, value }) {
  return (
    <div className="rounded-lg border border-slate-700 bg-slate-900 p-3">
      <div className="text-xs uppercase text-gray-500">{label}</div>
      <div className="mt-1 font-semibold text-white">{value}</div>
    </div>
  );
}
