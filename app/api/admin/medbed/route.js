import { NextResponse } from "next/server";
import {connectToDB}  from "@/lib/connectDB"
import MedbedRegistration from "@/models/MedbedRegistration";

/**
 * GET /api/admin/medbed
 * Returns all medbed registrations for admin listing.
 */
export async function GET() {
  try {
    await connectToDB();
    const regs = await MedbedRegistration.find().sort({ createdAt: -1 });
    return NextResponse.json({ success: true, registrations: regs }, { status: 200 });
  } catch (err) {
    console.error("GET /api/admin/medbed error:", err);
    return NextResponse.json({ success: false, error: "Server error" }, { status: 500 });
  }
}

/**
 * PUT /api/admin/medbed
 * Body: { id: string, action: "approve" | "reject" }
 * Approves or rejects a medbed registration (sets adminApproved / status).
 */
export async function PUT(req) {
  try {
    const body = await req.json();
    const { id, action } = body;
    if (!id || !action) {
      return NextResponse.json({ success: false, error: "Missing id or action" }, { status: 400 });
    }

    await connectToDB();
    const reg = await MedbedRegistration.findById(id);
    if (!reg) {
      return NextResponse.json({ success: false, error: "Registration not found" }, { status: 404 });
    }

    if (action === "approve") {
      reg.adminApproved = true;
      // if a txHash exists and payment completed, optionally set status to paid
      if (reg.txHash) reg.status = "paid";
      await reg.save();
      return NextResponse.json({ success: true, registration: reg }, { status: 200 });
    }

    if (action === "reject") {
      reg.adminApproved = false;
      reg.status = "cancelled";
      await reg.save();
      return NextResponse.json({ success: true, registration: reg }, { status: 200 });
    }

    return NextResponse.json({ success: false, error: "Unknown action" }, { status: 400 });
  } catch (err) {
    console.error("PUT /api/admin/medbed error:", err);
    return NextResponse.json({ success: false, error: "Server error" }, { status: 500 });
  }
}