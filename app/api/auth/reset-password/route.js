import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { connectToDB } from "../../../../lib/connectDB";
import User from "../../../../models/User";
import PasswordReset from "../../../../models/PasswordReset";

export async function POST(req) {
  try {
    const { token, id, password } = await req.json();

    if (!token || !id || !password) {
      return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 });
    }

    if (password.length < 6) {
      return NextResponse.json({ success: false, error: "Password must be at least 6 characters" }, { status: 400 });
    }

    await connectToDB();

    // Find and validate the reset token
    const resetRecord = await PasswordReset.findOne({
      token,
      user: id,
      used: false,
      expiresAt: { $gt: new Date() },
    });

    if (!resetRecord) {
      return NextResponse.json({ success: false, error: "Invalid or expired reset token" }, { status: 400 });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Update user password
    const user = await User.findByIdAndUpdate(id, { password: hashedPassword }, { new: true });

    if (!user) {
      return NextResponse.json({ success: false, error: "User not found" }, { status: 404 });
    }

    // Mark token as used
    resetRecord.used = true;
    await resetRecord.save();

    return NextResponse.json({ success: true, message: "Password reset successfully" }, { status: 200 });
  } catch (err) {
    console.error("POST /api/auth/reset-password error:", err);
    return NextResponse.json({ success: false, error: "Server error" }, { status: 500 });
  }
}
