import { NextResponse } from "next/server";
import { connectToDB } from "@/lib/connectDB";
import UserAsset from "@/models/UserAsset";

export async function GET() {
  try {
    await connectToDB();

    const assets = await UserAsset.find().lean();

    return NextResponse.json({ assets });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
