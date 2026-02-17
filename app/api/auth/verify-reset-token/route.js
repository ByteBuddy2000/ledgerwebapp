import { NextResponse } from "next/server";
import { connectToDB } from "../../../../lib/connectDB";
import PasswordReset from "../../../../models/PasswordReset";

export async function POST(req) {
  try {
    const { token, id } = await req.json();

    if (!token || !id) {
      return NextResponse.json({ valid: false, error: "Missing token or id" }, { status: 400 });
    }

    await connectToDB();

    const resetRecord = await PasswordReset.findOne({
      token,
      user: id,
      used: false,
      expiresAt: { $gt: new Date() },
    });

    if (!resetRecord) {
      return NextResponse.json({ valid: false, error: "Invalid or expired reset token" }, { status: 400 });
    }

    return NextResponse.json({ valid: true, success: true }, { status: 200 });
  } catch (err) {
    console.error("POST /api/auth/verify-reset-token error:", err);
    return NextResponse.json({ valid: false, error: "Server error" }, { status: 500 });
  }
}
