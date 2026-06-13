import { body } from "express-validator";

export const parkingSlotCreateRules = [
  body("parkingLotId")
    .notEmpty()
    .withMessage("Parking lot ID is required")
    .isMongoId()
    .withMessage("Invalid parking lot ID format"),
  body("slotId")
    .notEmpty()
    .withMessage("Slot ID is required")
    .trim()
    .toUpperCase(),
  body("zone")
    .notEmpty()
    .withMessage("Zone location is required")
    .trim(),
  body("slotType")
    .notEmpty()
    .withMessage("Slot type is required")
    .isIn(["Car", "Bike", "SUV", "Truck"])
    .withMessage("Invalid slot type. Must be Car, Bike, SUV, or Truck"),
  body("status")
    .optional()
    .isIn(["empty", "reserved", "occupied", "maintenance"])
    .withMessage("Invalid status value"),
];

export const parkingSlotUpdateRules = [
  body("slotId").optional().trim().toUpperCase().notEmpty(),
  body("zone").optional().trim().notEmpty(),
  body("slotType").optional().isIn(["Car", "Bike", "SUV", "Truck"]),
  body("status").optional().isIn(["empty", "reserved", "occupied", "maintenance"]),
];
