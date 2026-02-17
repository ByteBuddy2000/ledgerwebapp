import { connectToDB } from "@/lib/connectDB";
import User from "@/models/User";

export async function POST(req) {
  try {
    const { userId } = await req.json();
    if (!userId) {
      return new Response(JSON.stringify({ success: false, message: "User ID required" }), { status: 400 });
    }
    await connectToDB();
    const user = await User.findById(userId);
    if (!user) {
      return new Response(JSON.stringify({ success: false, message: "User not found" }), { status: 404 });
    }
    await User.deleteOne({ _id: userId });
    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (err) {
    console.error("Delete user error:", err);
    return new Response(JSON.stringify({ success: false, message: "Server error" }), { status: 500 });
  }
}
