import jwt from "jsonwebtoken";
import User from "../models/User.js";

class AuthService {
  generateToken(id, role) {
    return jwt.sign({ id, role }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRE || "30d",
    });
  }

  async registerUser(userData) {
    const { email } = userData;

    // Check if email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new Error("Email already registered");
    }

    // Create user
    const user = new User(userData);
    const savedUser = await user.save();

    // Generate token
    const token = this.generateToken(savedUser._id, savedUser.role);

    // Return user and token (remove password from response field if any)
    const userObj = savedUser.toObject();
    delete userObj.password;

    return { user: userObj, token };
  }

  async loginUser(email, password) {
    // Find user and explicitly select password field
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      throw new Error("Invalid credentials");
    }

    // Check if password matches
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      throw new Error("Invalid credentials");
    }

    // Generate token
    const token = this.generateToken(user._id, user.role);

    const userObj = user.toObject();
    delete userObj.password;

    return { user: userObj, token };
  }
}

export default new AuthService();
