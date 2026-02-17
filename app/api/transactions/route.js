import { connectToDB } from "@/lib/connectDB";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import Transaction from "@/models/Transaction";
import User from "@/models/User";

export async function GET() {
  await connectToDB();
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return Response.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  const user = await User.findOne({ email: session.user.email }).select("_id");
  if (!user) {
    return Response.json({ success: false, error: "User not found" }, { status: 404 });
  }

  const deposits = await Transaction.find({
    userId: user._id,
    type: "deposit"
  })
    .sort({ createdAt: -1 })
    .lean();

  const withdrawals = await Transaction.find({
    userId: user._id,
    type: "withdrawal"
  })
    .sort({ createdAt: -1 })
    .lean();

  return Response.json({ success: true, deposits, withdrawals });
}
