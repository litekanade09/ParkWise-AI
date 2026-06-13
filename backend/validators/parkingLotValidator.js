import { body } from "express-validator";

export const parkingLotCreateRules = [
  body("parkingName")
    .notEmpty()
    .withMessage("Parking name is required")
    .trim(),
  body("parkingAddress")
    .notEmpty()
    .withMessage("Parking address is required")
    .trim(),
  body("area")
    .notEmpty()
    .withMessage("Area/Locality is required")
    .trim(),
  body("city")
    .notEmpty()
    .withMessage("City is required")
    .trim(),
  body("postalCode")
    .notEmpty()
    .withMessage("Postal code is required")
    .trim(),
  body("contactNumber")
    .notEmpty()
    .withMessage("Contact number is required")
    .trim(),
  body("email")
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Must be a valid email address")
    .trim()
    .toLowerCase(),
  body("parkingType")
    .notEmpty()
    .withMessage("Parking type is required")
    .isIn(["Public Parking", "Mall Parking", "Office Parking", "Airport Parking", "Residential Parking"])
    .withMessage("Invalid parking type"),
  body("totalCapacity")
    .notEmpty()
    .withMessage("Total capacity is required")
    .isInt({ min: 1 })
    .withMessage("Total capacity must be at least 1"),
  body("bikeSlots")
    .notEmpty()
    .withMessage("Bike slots capacity is required")
    .isInt({ min: 0 })
    .withMessage("Bike slots cannot be negative"),
  body("carSlots")
    .notEmpty()
    .withMessage("Car slots capacity is required")
    .isInt({ min: 0 })
    .withMessage("Car slots cannot be negative"),
  body("suvSlots")
    .notEmpty()
    .withMessage("SUV slots capacity is required")
    .isInt({ min: 0 })
    .withMessage("SUV slots cannot be negative"),
  body("truckSlots")
    .notEmpty()
    .withMessage("Truck slots capacity is required")
    .isInt({ min: 0 })
    .withMessage("Truck slots cannot be negative"),
  body("facilities")
    .optional()
    .isArray()
    .withMessage("Facilities must be an array of strings"),
  body("bikePrice")
    .optional()
    .isInt({ min: 0 })
    .withMessage("Bike price must be a non-negative integer"),
  body("carPrice")
    .optional()
    .isInt({ min: 0 })
    .withMessage("Car price must be a non-negative integer"),
  body("suvPrice")
    .optional()
    .isInt({ min: 0 })
    .withMessage("SUV price must be a non-negative integer"),
  body("truckPrice")
    .optional()
    .isInt({ min: 0 })
    .withMessage("Truck price must be a non-negative integer"),
  body("createdBy")
    .notEmpty()
    .withMessage("CreatedBy user ID is required")
    .isMongoId()
    .withMessage("Invalid user ID format"),
];

export const parkingLotUpdateRules = [
  body("parkingName").optional().trim().notEmpty(),
  body("parkingAddress").optional().trim().notEmpty(),
  body("area").optional().trim().notEmpty(),
  body("city").optional().trim().notEmpty(),
  body("postalCode").optional().trim().notEmpty(),
  body("contactNumber").optional().trim().notEmpty(),
  body("email").optional().isEmail().withMessage("Must be a valid email address").trim().toLowerCase(),
  body("parkingType").optional().isIn(["Public Parking", "Mall Parking", "Office Parking", "Airport Parking", "Residential Parking"]),
  body("totalCapacity").optional().isInt({ min: 1 }),
  body("bikeSlots").optional().isInt({ min: 0 }),
  body("carSlots").optional().isInt({ min: 0 }),
  body("suvSlots").optional().isInt({ min: 0 }),
  body("truckSlots").optional().isInt({ min: 0 }),
  body("facilities").optional().isArray(),
  body("bikePrice").optional().isInt({ min: 0 }),
  body("carPrice").optional().isInt({ min: 0 }),
  body("suvPrice").optional().isInt({ min: 0 }),
  body("truckPrice").optional().isInt({ min: 0 }),
];
