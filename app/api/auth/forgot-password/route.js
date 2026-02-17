import { NextResponse } from "next/server";
import crypto from "crypto";
import nodemailer from "nodemailer";
import { connectToDB } from "../../../../lib/connectDB";
import User from "../../../../models/User";
import PasswordReset from "../../../../models/PasswordReset";

// Email HTML template
function getResetEmailHTML(resetLink, userName) {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; background: #f5f5f5; }
          .container { max-width: 600px; margin: 0 auto; background: white; padding: 20px; border-radius: 8px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
          .content { padding: 20px; color: #333; }
          .button { background: #667eea; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block; margin: 20px 0; }
          .footer { background: #f5f5f5; padding: 10px; text-align: center; font-size: 12px; color: #666; border-top: 1px solid #ddd; }
          .expiry { background: #fff3cd; padding: 10px; border-left: 4px solid #ffc107; margin: 10px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Password Reset Request</h1>
          </div>
          <div class="content">
            <p>Hello ${userName},</p>
            <p>We received a request to reset your password. Click the button below to reset it:</p>
            <a href="${resetLink}" class="button">Reset Password</a>
            <p>Or copy and paste this link in your browser:</p>
            <p style="word-break: break-all; background: #f9f9f9; padding: 10px; border-radius: 4px;">
              ${resetLink}
            </p>
            <div class="expiry">
              <strong>⏰ This link expires in 1 hour</strong>
            </div>
            <p>If you didn't request a password reset, please ignore this email.</p>
            <p>Best regards,<br>The Support Team</p>
          </div>
          <div class="footer">
            <p>© 2024 All rights reserved. This is an automated email, please do not reply.</p>
          </div>
        </div>
      </body>
    </html>
  `;
}

export async function POST(req) {
  try {
    const { email } = await req.json();
    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
      return NextResponse.json({ success: false, error: "Invalid email" }, { status: 400 });
    }

    await connectToDB();
    const user = await User.findOne({ email });

    if (user) {
      const token = crypto.randomBytes(32).toString("hex");
      const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

      // store token record
      await PasswordReset.create({
        user: user._id,
        email: user.email,
        token,
        expiresAt,
      });

      const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
      const resetLink = `${appUrl}/reset-password?token=${token}&id=${user._id}`;

      // send email if SMTP configured, otherwise log reset link to server console
      if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
        const transporter = nodemailer.createTransport({
          host: process.env.SMTP_HOST,
          port: parseInt(process.env.SMTP_PORT || "587", 10),
          secure: process.env.SMTP_SECURE === "true",
          auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
          },
        });

        await transporter.sendMail({
          from: process.env.SMTP_FROM || process.env.SMTP_USER,
          to: user.email,
          subject: "Password reset request",
          text: `Reset your password using this link: ${resetLink}`,
          html: getResetEmailHTML(resetLink, user.username || user.email),
        });
      } else {
        console.log("Password reset link (SMTP not configured):", resetLink);
      }
    }

    // Always return success to avoid user enumeration
    return NextResponse.json(
      { success: true, message: "If an account exists for that email, a reset link was sent." },
      { status: 200 }
    );
  } catch (err) {
    console.error("POST /api/auth/forgot-password error:", err);
    return NextResponse.json({ success: false, error: "Server error" }, { status: 500 });
  }
}