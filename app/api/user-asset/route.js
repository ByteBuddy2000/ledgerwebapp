import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { connectToDB } from "@/lib/connectDB";
import Asset from "@/models/UserAsset";

export async function GET(req) {
  await connectToDB();
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;
  const { searchParams } = req.nextUrl;
  const coin = searchParams.get("coin");

  if (!userId || !coin) {
    return Response.json({ asset: null });
  }

  // Use 'user' instead of 'userId' to match your schema
  const asset = await Asset.findOne({
    user: userId,
    coin: coin.toUpperCase(),
  });

  return Response.json({ asset });
}