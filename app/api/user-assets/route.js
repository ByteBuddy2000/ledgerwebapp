import { NextResponse } from "next/server";
import getUserAssets from "@/controllers/getUserAssets";

export async function GET() {
  try {
    const data = await getUserAssets();

    return NextResponse.json({
      totalUsd: data.totalUsd || 0,
      assets: data.assets || [],
    });
  } catch (err) {
    console.error("GET /api/user-assets error:", err);
    return NextResponse.json(
      { error: err.message },
      { status: 500 }
    );
  }
}
