import { body } from "express-validator";

export const vehicleCreateRules = [
  body("userId")
    .notEmpty()
    .withMessage("User ID is required")
    .isMongoId()
    .withMessage("Invalid User ID format"),
  body("vehicleNumber")
    .notEmpty()
    .withMessage("Vehicle number is required")
    .trim()
    .toUpperCase(),
  body("vehicleType")
    .notEmpty()
    .withMessage("Vehicle type is required")
    .isIn(["Car", "Bike", "SUV", "Truck", "Electric Vehicle"])
    .withMessage("Invalid vehicle type. Must be Car, Bike, SUV, Truck, or Electric Vehicle"),
  body("vehicleColor")
    .notEmpty()
    .withMessage("Vehicle color is required")
    .trim(),
  body("vehicleModel")
    .notEmpty()
    .withMessage("Vehicle model is required")
    .trim(),
];

export const vehicleUpdateRules = [
  body("vehicleType")
    .optional()
    .isIn(["Car", "Bike", "SUV", "Truck", "Electric Vehicle"])
    .withMessage("Invalid vehicle type"),
  body("vehicleColor")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Vehicle color cannot be empty"),
  body("vehicleModel")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Vehicle model cannot be empty"),
];
