import { NextResponse } from "next/server";
import { connectToDB } from "@/lib/connectDB";
import MedbedRegistration from "@/models/MedbedRegistration";

export async function GET(req, context) {
  try {
    const params = await context.params; // ✅ await params
    const { id } = params;

    await connectToDB();
    const reg = await MedbedRegistration.findById(id);

    if (!reg) {
      return NextResponse.json(
        { success: false, error: "Registration not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, registration: reg }, { status: 200 });
  } catch (err) {
    console.error("GET /api/admin/medbed/[id] error:", err);
    return NextResponse.json(
      { success: false, error: "Server error" },
      { status: 500 }
    );
  }
}
