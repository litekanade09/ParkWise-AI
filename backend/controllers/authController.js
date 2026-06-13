import authService from "../services/authService.js";
import { sendSuccess, sendError } from "../utils/response.js";

class AuthController {
  register = async (req, res, next) => {
    try {
      const data = await authService.registerUser(req.body);
      return sendSuccess(res, "Registration successful", data, 201);
    } catch (error) {
      if (error.message === "Email already registered") {
        return sendError(res, error.message, {}, 400);
      }
      next(error);
    }
  };

  login = async (req, res, next) => {
    try {
      const { email, password } = req.body;
      const data = await authService.loginUser(email, password);
      return sendSuccess(res, "Login successful", data);
    } catch (error) {
      if (error.message === "Invalid credentials") {
        return sendError(res, error.message, {}, 401);
      }
      next(error);
    }
  };

  getMe = async (req, res, next) => {
    try {
      // req.user was populated by protect middleware
      return sendSuccess(res, "User profile retrieved successfully", req.user);
    } catch (error) {
      next(error);
    }
  };

  updateProfile = async (req, res, next) => {
    try {
      const user = req.user;
      const { name, phone, address, postalCode } = req.body;

      user.name = name;
      user.phone = phone;
      if (address !== undefined) user.address = address;
      if (postalCode !== undefined) user.postalCode = postalCode;
      user.profileCompleted = true;

      const updatedUser = await user.save();

      const userObj = updatedUser.toObject();
      delete userObj.password;

      return sendSuccess(res, "Profile updated successfully", userObj);
    } catch (error) {
      next(error);
    }
  };

  logout = async (req, res, next) => {
    try {
      return sendSuccess(res, "Logged out successfully", {});
    } catch (error) {
      next(error);
    }
  };
}

export default new AuthController();
