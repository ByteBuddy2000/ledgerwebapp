import ActionButtons from "./ActionButtons";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { connectToDB } from "@/lib/connectDB";
import User from "@/models/User";

export default async function ActionButtonsPage() {
  // Get the current session
  const session = await getServerSession(authOptions);
  const userEmail = session?.user?.email;

  // Fetch the user from the database
  await connectToDB();
  const user = userEmail ? await User.findOne({ email: userEmail }).lean() : null;
  const userId = user?._id?.toString() || "";

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-950 via-gray-900 to-black">
      <div className="w-full max-w-2xl mx-auto">
        <ActionButtons userId={userId} />
      </div>
    </div>
  );
}