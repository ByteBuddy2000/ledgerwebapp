import { connectToDB } from "@/lib/connectDB";
import User from "@/models/User";

export default async function getRecentCustomers() {
  await connectToDB();

  const users = await User.find({ status: { $ne: "deleted" } })
    .sort({ createdAt: -1 })
    .limit(3)
    .select("firstName lastName email createdAt role");

  const formattedUsers = users.map((user) => ({
    ...user.toObject(),
    _id: user._id.toString(),
    createdAt:
      user.createdAt instanceof Date
        ? user.createdAt.toISOString()
        : user.createdAt,
  }));

  return formattedUsers;
}
