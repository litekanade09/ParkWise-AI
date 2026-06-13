import mongoose from "mongoose";

const parkingLotSchema = new mongoose.Schema(
  {
    parkingName: {
      type: String,
      required: [true, "Parking name is required"],
      trim: true,
    },
    parkingAddress: {
      type: String,
      required: [true, "Parking address is required"],
      trim: true,
    },
    area: {
      type: String,
      required: [true, "Area/Locality is required"],
      trim: true,
    },
    city: {
      type: String,
      required: [true, "City is required"],
      trim: true,
    },
    postalCode: {
      type: String,
      required: [true, "Postal code is required"],
      trim: true,
    },
    contactNumber: {
      type: String,
      required: [true, "Contact number is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email address is required"],
      trim: true,
      lowercase: true,
    },
    parkingType: {
      type: String,
      required: [true, "Parking type is required"],
      enum: {
        values: [
          "Public Parking",
          "Mall Parking",
          "Office Parking",
          "Airport Parking",
          "Residential Parking",
        ],
        message: "Invalid parking type",
      },
    },
    totalCapacity: {
      type: Number,
      required: [true, "Total capacity is required"],
      min: [1, "Total capacity must be at least 1"],
    },
    bikeSlots: {
      type: Number,
      required: [true, "Bike slots capacity is required"],
      min: [0, "Slots cannot be negative"],
    },
    carSlots: {
      type: Number,
      required: [true, "Car slots capacity is required"],
      min: [0, "Slots cannot be negative"],
    },
    suvSlots: {
      type: Number,
      required: [true, "SUV slots capacity is required"],
      min: [0, "Slots cannot be negative"],
    },
    truckSlots: {
      type: Number,
      required: [true, "Truck slots capacity is required"],
      min: [0, "Slots cannot be negative"],
    },
    facilities: {
      type: [String],
      default: [],
    },
    bikePrice: {
      type: Number,
      required: [true, "Bike price is required"],
      min: [0, "Price cannot be negative"],
      default: 20,
    },
    carPrice: {
      type: Number,
      required: [true, "Car price is required"],
      min: [0, "Price cannot be negative"],
      default: 40,
    },
    suvPrice: {
      type: Number,
      required: [true, "SUV price is required"],
      min: [0, "Price cannot be negative"],
      default: 60,
    },
    truckPrice: {
      type: Number,
      required: [true, "Truck price is required"],
      min: [0, "Price cannot be negative"],
      default: 80,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Creator (Manager) user reference is required"],
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
// city: Facilitates fast searching and filtering of parking lots by city name
parkingLotSchema.index({ city: 1 });
// area: Facilitates fast searching and filtering of parking lots by locality
parkingLotSchema.index({ area: 1 });
// createdBy: Fast retrieval of all lots owned/managed by a specific manager
parkingLotSchema.index({ createdBy: 1 });

const ParkingLot = mongoose.model("ParkingLot", parkingLotSchema);
export default ParkingLot;
