import { NextResponse } from "next/server";
import { connectToDB } from "@/lib/connectDB";
import MedbedRegistration from "@/models/MedbedRegistration";

// Expected: process.env.XRP_RECEIVER_ADDRESS (the address to receive XRP payments)
const TARGET_USD = 10000;

export async function POST(request) {
  try {
    const body = await request.json();
    const { name, phone, email, address, color } = body;

    if (!name || !phone || !email || !address || !color) {
      return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 });
    }

    // Connect to DB
    await connectToDB();

    // Fetch XRP price (USD) from CoinGecko to compute amount in XRP
    // NOTE: This external call may fail offline; handle errors gracefully
    let priceUsd = null;
    try {
      const res = await fetch(
        "https://api.coingecko.com/api/v3/simple/price?ids=ripple&vs_currencies=usd",
        { cache: "no-store" }
      );
      const json = await res.json();
      priceUsd = json?.ripple?.usd;
    } catch (err) {
      console.error("Failed to fetch XRP price", err);
    }

    if (!priceUsd || typeof priceUsd !== "number" || priceUsd <= 0) {
      // fallback: require client to pass feeUsd directly or return error
      return NextResponse.json(
        { success: false, error: "Unable to determine XRP price. Try again later." },
        { status: 503 }
      );
    }

    const amountXrp = Number((TARGET_USD / priceUsd).toFixed(6));
    const receiverAddress = process.env.XRP_RECEIVER_ADDRESS || "";

    // Create registration record with pending status
    const doc = await MedbedRegistration.create({
      name,
      phone,
      email,
      address,
      color,
      feeUsd: TARGET_USD,
      amountXrp,
      receiverAddress,
      status: "pending_payment",
    });

    // Return payment details to client so they can send XRP to receiverAddress
    return NextResponse.json({
      success: true,
      registrationId: doc._id,
      amountXrp,
      receiverAddress,
      message: "Pay the specified XRP amount to the receiver address and then confirm with the transaction hash.",
    });
  } catch (err) {
    console.error("/api/medbed/register error", err);
    return NextResponse.json({ success: false, error: err.message || "Server error" }, { status: 500 });
  }
}
