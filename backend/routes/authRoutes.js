import express from "express";
import authController from "../controllers/authController.js";
import { registerRules, loginRules, profileUpdateRules } from "../validators/authValidator.js";
import validate from "../middlewares/validate.js";
import { protect } from "../middlewares/auth.js";

const router = express.Router();

router.post("/register", registerRules, validate, authController.register);
router.post("/login", loginRules, validate, authController.login);
router.get("/me", protect, authController.getMe);
router.put("/profile", protect, profileUpdateRules, validate, authController.updateProfile);
router.post("/logout", authController.logout);

export default router;
