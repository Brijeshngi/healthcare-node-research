export const sendToken = (res, user, statusCode, message) => {
  const accessToken = user.getJWTToken(); // short-lived
  const refreshToken = user.getRefreshToken(); // long-lived

  // Save refresh token in DB for validation
  user.refreshToken = refreshToken;
  user.save({ validateBeforeSave: false });

  // Send refresh token in secure cookie
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production", // true in prod
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });

  // Send access token in response
  res.status(statusCode).json({
    success: true,
    message,
    accessToken,
    user: { id: user._id, email: user.Email, role: user.Role },
  });
};
