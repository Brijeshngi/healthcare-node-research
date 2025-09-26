import jwt from "jsonwebtoken";
import { User } from "../models/User.js";
import ErrorHandle from "../utils/errorHandle.js";
import { ENV } from "../config/env.js";

export const isAuthenticated = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return next(new ErrorHandle("Access token missing", 401));
  }

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, ENV.JWT_SECRET);
    req.user = await User.findById(decoded.id);
    next();
  } catch (err) {
    return next(new ErrorHandle("Invalid/Expired access token", 401));
  }
};

// Role-based access
export const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.Role)) {
      return next(new ErrorHandle(`Role: ${req.user.Role} not allowed`, 403));
    }
    next();
  };
};
