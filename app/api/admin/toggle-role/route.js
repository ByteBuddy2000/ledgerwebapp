// app/api/admin/toggle-role/route.js

import { connectToDB } from "@/lib/connectDB";
import User from "@/models/User";

export async function POST(req) {
  try {
    const { userId } = await req.json();

    if (!userId) {
      return new Response(JSON.stringify({ success: false, message: "User ID is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    await connectToDB();

    const user = await User.findById(userId);
    if (!user) {
      return new Response(JSON.stringify({ success: false, message: "User not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Toggle role
    user.role = user.role === "admin" ? "user" : "admin";
    await user.save();

    return new Response(JSON.stringify({ success: true, role: user.role }), {
      status: 200,
      headers: { "Content-Type": "application/json" }, // ✅ Very important!
    });
  } catch (error) {
    console.error("Error in toggle-role API:", error);
    return new Response(JSON.stringify({ success: false, message: "Server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" }, // ✅ Important for preventing that <html> error
    });
  }
}
