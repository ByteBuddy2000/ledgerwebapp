import { NextResponse } from "next/server";
import { connectToDB } from "@/lib/connectDB";
import MedbedRegistration from "@/models/MedbedRegistration";

export async function POST(request) {
  try {
    const body = await request.json();
    const { registrationId, txHash } = body;

    if (!registrationId || !txHash) {
      return NextResponse.json({ success: false, error: "Missing registrationId or txHash" }, { status: 400 });
    }

    await connectToDB();

    const reg = await MedbedRegistration.findById(registrationId);
    if (!reg) return NextResponse.json({ success: false, error: "Registration not found" }, { status: 404 });

    // Mark as paid. In a real app we'd verify this txHash on the XRP ledger first.
    reg.status = "paid";
    reg.txHash = txHash;
    reg.paidAt = new Date();
    await reg.save();

    return NextResponse.json({ success: true, message: "Payment confirmed", registration: reg });
  } catch (err) {
    console.error("/api/medbed/confirm error", err);
    return NextResponse.json({ success: false, error: err.message || "Server error" }, { status: 500 });
  }
}
