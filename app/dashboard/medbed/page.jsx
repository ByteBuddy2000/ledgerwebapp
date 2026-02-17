"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function MedbedSignupPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [color, setColor] = useState("white");
  const [paymentInfo, setPaymentInfo] = useState(null);
  const [txHash, setTxHash] = useState("");
  const [confirming, setConfirming] = useState(false);

  const fee = 10000; // registration fee in USD

  // Default receiver address can be provided via NEXT_PUBLIC_XRP_RECEIVER_ADDRESS
  const RECEIVER_ADDRESS =
    process.env.NEXT_PUBLIC_XRP_RECEIVER_ADDRESS ||
    "rp5PMThCE9FtANy7ULtN4X43fNf7oXW6mt"; // replace with your real address

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !phone || !email || !address) {
      toast.error("Please fill all required fields");
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
        // Use API receiverAddress if provided, otherwise fall back to env/default
        setPaymentInfo({
          registrationId: data.registrationId,
          amountXrp: data.amountXrp,
          receiverAddress: data.receiverAddress || RECEIVER_ADDRESS,
        });
        toast.success("Registration saved. Please complete XRP payment to finish.");
      } else {
        toast.error(data.error || "Registration failed");
      }
    } catch (err) {
      console.error(err);
      toast.error("Server error");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-background text-foreground">
      <div className="w-full max-w-xl bg-card border border-border rounded-lg p-6">
        <h1 className="text-2xl font-bold mb-4 text-foreground">Medbed Registration</h1>
        <p className="text-sm text-muted-foreground mb-4">Please provide your details and pay the registration fee of <strong>${fee.toLocaleString()}</strong>.</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-muted-foreground mb-1">Full name</label>
            <input className="w-full bg-card/50 border border-border rounded px-3 py-2 text-foreground placeholder-muted-foreground" value={name} onChange={(e) => setName(e.target.value)} required />
          </div>

          <div>
            <label className="block text-sm text-muted-foreground mb-1">Phone number</label>
            <input className="w-full bg-card/50 border border-border rounded px-3 py-2 text-foreground placeholder-muted-foreground" value={phone} onChange={(e) => setPhone(e.target.value)} required />
          </div>

          <div>
            <label className="block text-sm text-muted-foreground mb-1">Email</label>
            <input type="email" className="w-full bg-card/50 border border-border rounded px-3 py-2 text-foreground placeholder-muted-foreground" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>

          <div>
            <label className="block text-sm text-muted-foreground mb-1">Home address</label>
            <textarea className="w-full bg-card/50 border border-border rounded px-3 py-2 text-foreground placeholder-muted-foreground" value={address} onChange={(e) => setAddress(e.target.value)} required />
          </div>

          <div>
            <label className="block text-sm text-muted-foreground mb-1">Bed color</label>
            <select value={color} onChange={(e) => setColor(e.target.value)} className="w-full bg-card/50 border border-border rounded px-3 py-2 text-foreground">
              <option value="white">White</option>
              <option value="black">Black</option>
              <option value="silver">Silver</option>
              <option value="gold">Gold</option>
              <option value="blue">Blue</option>
            </select>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <span className="text-sm text-muted-foreground">Registration fee</span>
              <div className="text-lg font-semibold text-foreground">${fee.toLocaleString()}</div>
            </div>
            <button type="submit" disabled={submitting} className="bg-primary text-primary-foreground hover:opacity-90 px-4 py-2 rounded font-semibold shadow-lg shadow-primary/25 disabled:opacity-50 transition">
              {submitting ? "Submitting..." : "Submit & Pay"}
            </button>
          </div>
        </form>

        {/* If there's payment info returned, show payment instructions and a confirm form */}
        {paymentInfo && (
          <div className="mt-6 p-4 bg-card border border-border rounded">
            <h2 className="text-lg font-semibold mb-2 text-foreground">Payment details</h2>
            <p className="text-sm text-muted-foreground">Send <strong>{paymentInfo.amountXrp} XRP</strong> to:</p>
            <div className="break-words bg-card/50 p-2 rounded my-2 text-foreground border border-border">{paymentInfo.receiverAddress || "(No receiver address configured)"}</div>
            <p className="text-xs text-muted-foreground mb-2">After you send the payment, paste the transaction hash below and click Confirm.</p>

            <div className="space-y-2">
              <input placeholder="Transaction hash (txHash)" value={txHash} onChange={(e) => setTxHash(e.target.value)} className="w-full bg-card/50 border border-border rounded px-3 py-2 text-foreground placeholder-muted-foreground" />
              <div className="flex justify-end">
                <button
                  onClick={async () => {
                    if (!txHash) return toast.error("Enter tx hash");
                    setConfirming(true);
                    try {
                      const r = await fetch("/api/medbed/confirm", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ registrationId: paymentInfo.registrationId, txHash }),
                      });
                      const d = await r.json();
                      if (r.ok && d.success) {
                        toast.success("Payment confirmed. Thank you.");
                        router.push("/dashboard");
                      } else {
                        toast.error(d.error || "Confirmation failed");
                      }
                    } catch (err) {
                      console.error(err);
                      toast.error("Server error");
                    } finally {
                      setConfirming(false);
                    }
                  }}
                  disabled={confirming}
                  className="bg-primary text-primary-foreground hover:opacity-90 px-4 py-2 rounded font-semibold shadow-lg shadow-primary/25 disabled:opacity-50 transition"
                >
                  {confirming ? "Confirming..." : "Confirm Payment"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Show default receiver address when payment info not yet created */}
        {!paymentInfo && (
          <div className="mt-4 text-sm text-muted-foreground">
            Payment will be sent to: <span className="break-words text-foreground">{RECEIVER_ADDRESS}</span>
          </div>
        )}
      </div>
    </div>
  );
}
