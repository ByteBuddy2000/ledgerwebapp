"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { connectToDB } from "@/lib/connectDB";
import User from "@/models/User";

export default async function getUsername() {
  await connectToDB();
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return null;
  }

  const user = await User.findOne({ email: session.user.email }).select("username");

  if (!user) {
    return null;
  }

  return user.username;
}
