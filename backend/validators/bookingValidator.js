import { body } from "express-validator";

export const bookingCreateRules = [
  body("userId")
    .notEmpty()
    .withMessage("User ID is required")
    .isMongoId()
    .withMessage("Invalid User ID format"),
  body("vehicleId")
    .notEmpty()
    .withMessage("Vehicle ID is required")
    .isMongoId()
    .withMessage("Invalid Vehicle ID format"),
  body("parkingLotId")
    .notEmpty()
    .withMessage("Parking lot ID is required")
    .isMongoId()
    .withMessage("Invalid Parking Lot ID format"),
  body("slotId")
    .notEmpty()
    .withMessage("Parking slot ID is required")
    .isMongoId()
    .withMessage("Invalid Slot ID format"),
  body("entryTime")
    .notEmpty()
    .withMessage("Entry time is required")
    .isISO8601()
    .withMessage("Entry time must be a valid ISO8601 date string"),
  body("exitTime")
    .notEmpty()
    .withMessage("Exit time is required")
    .isISO8601()
    .withMessage("Exit time must be a valid ISO8601 date string")
    .custom((value, { req }) => {
      if (new Date(value) <= new Date(req.body.entryTime)) {
        throw new Error("Exit time must be after entry time");
      }
      return true;
    }),
  body("bookingStatus")
    .optional()
    .isIn(["active", "completed", "cancelled"])
    .withMessage("Invalid booking status"),
  body("price")
    .notEmpty()
    .withMessage("Booking price is required")
    .isNumeric()
    .withMessage("Booking price must be a valid number"),
];

export const bookingUpdateRules = [
  body("entryTime").optional().isISO8601(),
  body("exitTime")
    .optional()
    .isISO8601()
    .custom((value, { req }) => {
      if (req.body.entryTime && new Date(value) <= new Date(req.body.entryTime)) {
        throw new Error("Exit time must be after entry time");
      }
      return true;
    }),
  body("bookingStatus")
    .optional()
    .isIn(["active", "completed", "cancelled"])
    .withMessage("Invalid booking status"),
];
