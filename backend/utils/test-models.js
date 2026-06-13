import User from "../models/User.js";
import Vehicle from "../models/Vehicle.js";
import ParkingLot from "../models/ParkingLot.js";
import ParkingSlot from "../models/ParkingSlot.js";
import Booking from "../models/Booking.js";

console.log("=== Model Import Verification ===");
console.log("User Model loaded:", User.modelName);
console.log("Vehicle Model loaded:", Vehicle.modelName);
console.log("ParkingLot Model loaded:", ParkingLot.modelName);
console.log("ParkingSlot Model loaded:", ParkingSlot.modelName);
console.log("Booking Model loaded:", Booking.modelName);
console.log("=== Verification Successful! ===");
