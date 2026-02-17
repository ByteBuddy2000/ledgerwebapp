import { connectToDB } from "@/lib/connectDB";
import User from "@/models/User";
import UserAsset from "@/models/UserAsset";
import Transaction from "@/models/Transaction";

export async function updateUserAssets(userId, assets) {
  await connectToDB();

  if (!Array.isArray(assets)) {
    throw new Error("Invalid assets data");
  }

  const user = await User.findById(userId).populate("assets");
  if (!user) throw new Error("User not found");

  const newAssetIds = [];

  for (const { coin, network, amount } of assets) {
    let asset = await UserAsset.findOne({ user: user._id, coin, network });

    if (asset) {
      // Only create transaction if new amount is greater than previous
      if (amount > asset.amount) {
        const addedAmount = amount - asset.amount;

        await Transaction.create({
          userId: user._id,
          type: "deposit",
          amount: addedAmount,
          coin,
          network,
          status: "confirmed",
        });
      }

      asset.amount = amount;
      await asset.save();
    } else {
      // First-time deposit
      await Transaction.create({
        userId: user._id,
        type: "deposit",
        amount,
        coin,
        network,
        status: "confirmed",
      });

      asset = await UserAsset.create({
        coin,
        network,
        amount,
        user: user._id,
      });
    }

    newAssetIds.push(asset._id);
  }

  // Sync user.assets to reflect these IDs
  user.assets = newAssetIds;
  await user.save();

  // Fetch updated user and assets as array
  const updatedUser = await User.findById(userId).populate("assets").lean();

  return {
    success: true,
    user: {
      id: updatedUser._id.toString(),
      name: updatedUser.username,
      email: updatedUser.email,
      avatar: updatedUser.avatar,
      assets: updatedUser.assets.map((asset) => ({
        coin: asset.coin,
        network: asset.network,
        amount: asset.amount,
      })),
      lastActive: updatedUser.lastLogin
        ? updatedUser.lastLogin.toISOString().slice(0, 10)
        : "",
    },
  };
}
