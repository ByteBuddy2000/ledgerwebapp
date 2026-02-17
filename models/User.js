// models/User.js
import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    userID: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      required: true,
      trim: true,
    },
    firstName: {
      type: String,
      default: "",
    },
    lastName: {
      type: String,
      default: "",
    },
    email: {
      type: String,
      unique: true,
      required: [true, "Email is required"],
      match: [
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        "Please enter a valid email address",
      ],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters"],
      select: false,
    },
    avatar: {
      type: String,
      default: "",
    },
    balance: {
      type: Number,
      default: 0,
    },
    joinDate: {
      type: Date,
      default: Date.now,
    },
    lastLogin: {
      type: Date,
      default: null,
    },
    accountType: {
      type: String,
      enum: ["personal", "business"],
      default: "personal",
    },
    phone: {
      type: String,
      default: "",
    },
    country: {
      type: String,
      default: "",
    },
    state: {
      type: String,
      default: "",
    },
    zipCode: {
      type: String,
      default: "",
    },
    role: {
      type: String,
      enum: ["user", "superAdmin", "admin"],
      default: "user",
    },
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
    wallets: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Wallet'
      }
    ],
    assets: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "UserAsset",
      },
    ],
    
  },
  {
    timestamps: true,
  }
);
const User = mongoose.models.User || mongoose.model("User", UserSchema);
export default User;