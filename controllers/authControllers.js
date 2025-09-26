import { User } from "../models/User.js";
import { sendToken } from "../utils/sendToken.js";
import ErrorHandle from "../utils/errorHandle.js";
import { catchAsyncError } from "../utils/catchAsyncError.js";

export const register = catchAsyncError(async (req, res, next) => {
  const { FirstName, LastName, Email, Contact, Password } = req.body;

  if (!Email || !Password) return next(new ErrorHandle("Missing fields", 400));

  let user = await User.findOne({ Email });
  if (user) return next(new ErrorHandle("User already exists", 400));

  user = await User.create({ FirstName, LastName, Email, Contact, Password });
  console.log("Headers being sent:", res.getHeaders());

  res.status(201).json({
    message: "Registered successfully",
  });
});

export const login = catchAsyncError(async (req, res, next) => {
  const { Email, Password, device_id } = req.body;
  if (!Email || !Password)
    return next(new ErrorHandle("Enter all fields", 400));

  const user = await User.findOne({ Email }).select("+Password");
  if (!user) return next(new ErrorHandle("Invalid credentials", 401));

  const isMatch = await user.comparePassword(Password);
  if (!isMatch) return next(new ErrorHandle("Invalid credentials", 401));

  // Enforce SINGLE DEVICE login
  user.devices = []; // Clear all previous devices
  user.devices.push({ device_id }); // Register new device

  await user.save();

  sendToken(res, user, 200, "Login successful (single device enforced)");
});

// Refresh Token Endpoint
export const refreshToken = catchAsyncError(async (req, res, next) => {
  const { refreshToken } = req.cookies;
  if (!refreshToken)
    return next(new ErrorHandle("No refresh token found", 401));

  const decoded = jwt.verify(refreshToken, ENV.JWT_SECRET);
  const user = await User.findById(decoded.id);

  if (!user || user.refreshToken !== refreshToken) {
    return next(new ErrorHandle("Invalid refresh token", 403));
  }

  const newAccessToken = user.getJWTToken();
  res.status(200).json({
    success: true,
    accessToken: newAccessToken,
  });
});

export const logout = catchAsyncError(async (req, res, next) => {
  const user = await User.findById(req.user._id);
  user.refreshToken = null;
  await user.save();

  res.cookie("refreshToken", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  });

  res.status(200).json({ success: true, message: "Logged out successfully" });
});
