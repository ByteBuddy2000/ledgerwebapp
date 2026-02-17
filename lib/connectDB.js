import mongoose from "mongoose";

const connection = {};

export const connectToDB = async () => {
  try {
    if (mongoose.connection.readyState >= 1) return;
    const uri = process.env.MONGODB_URI;
    if (!uri) {
      throw new Error("MONGODB_URI is not defined in environment variables.");
    }
    const db = await mongoose.connect(uri);
    connection.isConnected = db.connections[0].readyState;
    console.log("Connected to MongoDB!");
  } catch (error) {
    console.error("Failed to connect to MongoDB:", error.message);
    throw new Error(error.message || "Failed to connect to MongoDB");
  }
};