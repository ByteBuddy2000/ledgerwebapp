// app/api/admin/toggle-user/route.js
import { connectToDB } from "@/lib/connectDB";
import User from "@/models/User";

export async function POST(req) {
  try {
    const { userId } = await req.json();

    if (!userId) {
      return new Response(JSON.stringify({ success: false, message: "User ID is required" }), { status: 400 });
    }

    await connectToDB();

    const user = await User.findById(userId);
    if (!user) {
      return new Response(JSON.stringify({ success: false, message: "User not found" }), { status: 404 });
    }

    user.status = user.status === "active" ? "inactive" : "active";
    await user.save();

    return new Response(JSON.stringify({ success: true, status: user.status }), { status: 200 });
  } catch (error) {
    console.error("API toggle-user error:", error);
    return new Response(JSON.stringify({ success: false, message: "Server error" }), { status: 500 });
  }
}
