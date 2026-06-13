import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { sendError } from "../utils/response.js";

export const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      // Get token from header
      token = req.headers.authorization.split(" ")[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Get user from token
      req.user = await User.findById(decoded.id);
      if (!req.user) {
        return sendError(res, "Not authorized, user not found", {}, 401);
      }

      next();
    } catch (error) {
      console.error("JWT Error:", error.message);
      return sendError(res, "Not authorized, token failed", {}, 401);
    }
  }

  if (!token) {
    return sendError(res, "Not authorized, no token", {}, 401);
  }
};

export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return sendError(
        res,
        `User role '${req.user?.role}' is not authorized to access this route`,
        {},
        403
      );
    }
    next();
  };
};
