import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { ENV } from "../config/env.js";
const userSchema = new mongoose.Schema(
  {
    FirstName: { type: String, required: true },
    LastName: { type: String },
    Email: { type: String, required: true, unique: true },
    Contact: { type: String, required: true },
    Password: { type: String, required: true, minlength: 8, select: false },
    Role: { type: String, enum: ["User", "Admin"], default: "User" },
    ProfilePicture: { url: String },
    devices: [
      {
        device_id: { type: String },
        loginAt: { type: Date, default: Date.now },
      },
    ],

    AccountStatus: {
      type: String,
      enum: ["Active", "Inactive"],
      default: "Active",
    },
    refreshToken: { type: String }, // ✅ store refresh token
  },
  { timestamps: true }
);

// Generate Access Token
userSchema.methods.getJWTToken = function () {
  return jwt.sign({ id: this._id, role: this.Role }, ENV.JWT_SECRET, {
    expiresIn: "15m",
  });
};

// Generate Refresh Token
userSchema.methods.getRefreshToken = function () {
  return jwt.sign({ id: this._id }, ENV.JWT_SECRET, {
    expiresIn: ENV.JWT_EXPIRE,
  });
};
// Hash Password
userSchema.pre("save", async function (next) {
  if (!this.isModified("Password")) return next();

  this.Password = await bcrypt.hash(this.Password, 10);
  next();
});

// compare password

userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.Password);
};

export const User = mongoose.model("user", userSchema);
