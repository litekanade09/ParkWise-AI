import User from "../models/User.js";
import { sendSuccess } from "../utils/response.js";

class UserController {
  createUser = async (req, res, next) => {
    try {
      const user = new User(req.body);
      const savedUser = await user.save();
      return sendSuccess(res, "User created successfully", savedUser, 201);
    } catch (error) {
      next(error);
    }
  };

  getAllUsers = async (req, res, next) => {
    try {
      const users = await User.find({});
      return sendSuccess(res, "Users retrieved successfully", users);
    } catch (error) {
      next(error);
    }
  };
}

export default new UserController();
