import CardPage from "./CardPage";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import User from "@/models/User";
import { connectToDB } from "@/lib/connectDB";

export default async function Page() {
  await connectToDB();
  const session = await getServerSession(authOptions);

  let firstName = "";
  let lastName = "";
  let email = "";
  let phone = "";

  if (session?.user?.email) {
    const user = await User.findOne({ email: session.user.email });
    if (user) {
      firstName = user.firstName || "";
      lastName = user.lastName || "";
      email = user.email || "";
      phone = user.phone || "";
    }
  }

  return <CardPage firstName={firstName} lastName={lastName} email={email} phone={phone} />;
}