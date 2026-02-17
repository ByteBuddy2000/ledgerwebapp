import AssetDetailPage from "./AssetDetails";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { connectToDB } from "@/lib/connectDB";
import User from "@/models/User";

export default async function Page({ params }) {
  const session = await getServerSession(authOptions);
  const userEmail = session?.user?.email;
  await connectToDB();
  const user = userEmail ? await User.findOne({ email: userEmail }).lean() : null;
  const userId = user?._id?.toString() || "";

  return <AssetDetailPage params={params} userId={userId} />;
}