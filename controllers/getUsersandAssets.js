import User from "@/models/User"
import UserAsset from "@/models/UserAsset"
import { connectToDB } from "@/lib/connectDB"

export async function getUsersWithAssets(search = "") {
  await connectToDB()
  const query = search
    ? {
      $or: [
        { username: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ],
    }
    : {}

  const users = await User.find(query)
    .populate("assets")
    .lean()

  return users.map(user => ({
    id: user._id.toString(),
    name: user.username,
    email: user.email,
    avatar: user.avatar,
    assets: user.assets.reduce((acc, asset) => {
      acc[asset.coin] = asset.amount
      return acc
    }, {}),
    lastActive: user.lastLogin ? user.lastLogin.toISOString().slice(0, 10) : "",
  }))
}


// export async function updateUserAssets(userId, assets) {
//   await connectToDB();

//   if (!assets || typeof assets !== "object") {
//     throw new Error("Invalid assets data");
//   }

//   const user = await User.findById(userId).populate("assets");
//   if (!user) throw new Error("User not found");

//   const newAssetIds = [];

//   for (const [coin, amount] of Object.entries(assets)) {
//     let asset = await UserAsset.findOne({ user: user._id, coin });

//     if (asset) {
//       asset.amount = amount;
//       await asset.save();
//     } else {
//       asset = await UserAsset.create({
//         coin,
//         network: "mainnet", // Adjust if needed
//         amount,
//         user: user._id,
//       });
//     }

//     newAssetIds.push(asset._id);
//   }

//   // Sync user.assets to reflect these IDs
//   user.assets = newAssetIds;
//   await user.save();

//   const updatedUser = await User.findById(userId).populate("assets").lean();

//   return {
//     success: true,
//     user: {
//       id: updatedUser._id.toString(),
//       name: updatedUser.username,
//       email: updatedUser.email,
//       avatar: updatedUser.avatar,
//       assets: updatedUser.assets.reduce((acc, asset) => {
//         acc[asset.coin] = asset.amount;
//         return acc;
//       }, {}),
//       lastActive: updatedUser.lastLogin
//         ? updatedUser.lastLogin.toISOString().slice(0, 10)
//         : "",
//     },
//   };
// }

