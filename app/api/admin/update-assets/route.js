import { updateUserAssets } from "@/controllers/updateUserAssets";

export async function POST(request) {
  try {
    const { userId, assets } = await request.json();
    console.log("📥 Incoming POST /api/user-assets with:", { userId, assets });

    if (!userId || !assets) {
      return Response.json({ success: false, error: "Missing userId or assets" }, { status: 400 });
    }

    const result = await updateUserAssets(userId, assets);
    console.log("✅ updateUserAssets result:", result);

    return Response.json({ success: true, data: result });
  } catch (error) {
    console.error("❌ Server error:", error);
    return Response.json(
      { success: false, error: error.message || "Unknown server error" },
      { status: 500 }
    );
  }
}
