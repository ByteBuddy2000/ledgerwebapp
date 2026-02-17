import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import Contribution from "@/models/401kContribution";
import { connectToDB } from "@/lib/connectDB";

export async function GET(req) {
  await connectToDB();
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return Response.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  const url = new URL(req.url, "http://localhost");
  const recent = url.searchParams.get("recent");
  const balance = url.searchParams.get("balance");
  const ytd = url.searchParams.get("ytd");
  const userId = session.user.id;

  if (recent) {
    const contributions = await Contribution.find({ userId })
      .sort({ date: -1 })
      .limit(10)
      .lean();
    return Response.json({ success: true, contributions });
  }

  if (balance) {
    // Sum all confirmed contributions for this user
    const all = await Contribution.find({ userId, status: "confirmed" });
    const totalUsd = all.reduce((sum, c) => sum + (c.amountUsd || 0), 0);
    return Response.json({ success: true, balance: totalUsd });
  }

  if (ytd) {
    // Sum all confirmed contributions for this year
    const startOfYear = new Date(new Date().getFullYear(), 0, 1);
    const ytdContributions = await Contribution.find({
      userId,
      status: "confirmed",
      date: { $gte: startOfYear }
    });
    const ytdUsd = ytdContributions.reduce((sum, c) => sum + (c.amountUsd || 0), 0);
    return Response.json({ success: true, ytd: ytdUsd });
  }

  return Response.json({ success: false, error: "Invalid request" }, { status: 400 });
}