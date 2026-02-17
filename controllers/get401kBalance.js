"use server"
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { connectToDB } from "@/lib/connectDB";

export default async function get401kBalance() {
  try {
    await connectToDB();
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return { balance: 0 };
    }

    const User = (await import("@/models/User")).default;
    const user = await User.findOne({ email: session.user.email });

    if (!user) {
      return { balance: 0 };
    }

    const Contribution = (await import("@/models/401kContribution")).default;
    
    // Aggregate sum of all confirmed 401k contributions in USD
    const result = await Contribution.aggregate([
      { $match: { userId: user._id, status: "confirmed" } },
      { $group: { _id: null, totalUsd: { $sum: "$amountUsd" } } },
    ]);

    const balance = result[0]?.totalUsd || 0;
    return { balance };
  } catch (err) {
    console.error("get401kBalance error:", err);
    return { balance: 0 };
  }
}
