import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import User from "@/models/User";
import UserAsset from "@/models/UserAsset";
import { connectToDB } from "@/lib/connectDB";

export async function POST(req) {
  try {
    await connectToDB();

    const {
      username,
      firstName,
      lastName,
      phone,
      email,
      password,
      country,
      state,
      zipCode,
      accountType,
    } = await req.json();

    if (!username || !phone || !email || !password || !accountType) {
      return NextResponse.json(
        { message: "All required fields must be filled" },
        { status: 400 }
      );
    }

    const existing = await User.findOne({ email });
    if (existing) {
      return NextResponse.json(
        { message: "Email already registered" },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      userID: Date.now().toString(),
      username,
      firstName: firstName || "",
      lastName: lastName || "",
      phone,
      email,
      password: hashedPassword,
      country: country || "",
      state: state || "",
      zipCode: zipCode || "",
      accountType,
      joinDate: new Date(),
    });

    // ✅ Expanded asset list with network info
    const defaultAssets = [
      { coin: "BTC", network: "Mainnet" },
      { coin: "ETH", network: "Mainnet" },
      { coin: "USDT", network: "ERC20" },
      { coin: "USDT", network: "TRC20" },
      { coin: "USDT", network: "BEP20" },
      { coin: "BNB", network: "BNB Smart Chain (BEP20)" },
      { coin: "SOL", network: "Solana" },
      { coin: "ADA", network: "Cardano" },
      { coin: "XRP", network: "Ripple" },
      { coin: "DOGE", network: "Dogecoin" },
      { coin: "TRX", network: "Tron" },
      { coin: "DOT", network: "Polkadot" },
      { coin: "SHIB", network: "Ethereum" },
      { coin: "XLM", network: "Stellar" }, // <-- Added Stellar coin
    ];

    // FIX: Use 'user' not 'userId' for UserAsset model
    const userAssets = defaultAssets.map((asset) => ({
      user: newUser._id, // <-- FIXED FIELD NAME
      coin: asset.coin,
      network: asset.network,
      amount: 0,
    }));

    await UserAsset.insertMany(userAssets);

    return NextResponse.json(
      { message: "Registration successful" },
      { status: 201 }
      
    );
  } catch (err) {
    console.error("Registration error:", err);
    return NextResponse.json(
      { message: "Registration failed", error: err.message },
      { status: 500 }
    );
  }
}