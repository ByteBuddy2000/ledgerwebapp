import { connectToDB } from "@/lib/connectDB";
import Notification from "@/models/Notification";

export default async function getRecentActivity() {
  await connectToDB();

  // Populate `user` with desired fields
  const notifications = await Notification.find({})
    .sort({ createdAt: -1 })
    .limit(5)
    .populate("user", "firstName lastName username avatar"); // explicitly pick needed fields

  const formattedNotifications = notifications.map((notification) => {
    const user = notification.user;

    return {
      ...notification.toObject(),
      _id: notification._id.toString(),
      user: user && typeof user === "object"
        ? {
            _id: user._id?.toString(),
            firstName: user.firstName || "",
            lastName: user.lastName || "",
            username: user.username || "",
            avatar: user.avatar || null,
          }
        : null,
      createdAt: notification.createdAt instanceof Date
        ? notification.createdAt.toISOString()
        : notification.createdAt,
    };
  });

  return formattedNotifications;
}
