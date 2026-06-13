import { body } from "express-validator";

export const registerRules = [
  body("email")
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Please provide a valid email address")
    .trim()
    .toLowerCase(),
  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),
  body("role")
    .notEmpty()
    .withMessage("Role is required")
    .isIn(["vehicle_owner", "parking_manager"])
    .withMessage("Role must be either vehicle_owner or parking_manager"),
];

export const profileUpdateRules = [
  body("name")
    .notEmpty()
    .withMessage("Name is required")
    .trim(),
  body("phone")
    .notEmpty()
    .withMessage("Phone number is required")
    .trim(),
];

export const loginRules = [
  body("email")
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Please provide a valid email address")
    .trim()
    .toLowerCase(),
  body("password")
    .notEmpty()
    .withMessage("Password is required"),
];
