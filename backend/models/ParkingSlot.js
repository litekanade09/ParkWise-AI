import mongoose from "mongoose";

const parkingSlotSchema = new mongoose.Schema(
  {
    parkingLotId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ParkingLot",
      required: [true, "Parking lot reference ID is required"],
    },
    slotId: {
      type: String,
      required: [true, "Slot ID/Number is required"],
      trim: true,
      uppercase: true,
    },
    zone: {
      type: String,
      required: [true, "Zone/Floor location is required"],
      trim: true,
    },
    slotType: {
      type: String,
      required: [true, "Slot vehicle type constraint is required"],
      enum: {
        values: ["Car", "Bike", "SUV", "Truck"],
        message: "Slot type must be Car, Bike, SUV, or Truck",
      },
    },
    status: {
      type: String,
      required: [true, "Slot status is required"],
      enum: {
        values: ["empty", "reserved", "occupied", "maintenance"],
        message: "Status must be empty, reserved, occupied, or maintenance",
      },
      default: "empty",
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
// compound index of { parkingLotId, slotId } is marked unique to prevent duplicate slot numbers in the same lot
parkingSlotSchema.index({ parkingLotId: 1, slotId: 1 }, { unique: true });
// status index: Speeds up checking slot availability (empty slots) within a parking lot
parkingSlotSchema.index({ status: 1 });

const ParkingSlot = mongoose.model("ParkingSlot", parkingSlotSchema);
export default ParkingSlot;
