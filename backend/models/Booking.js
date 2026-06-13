import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User reference ID is required"],
    },
    vehicleId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Vehicle",
      required: [true, "Vehicle reference ID is required"],
    },
    parkingLotId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ParkingLot",
      required: [true, "Parking lot reference ID is required"],
    },
    slotId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ParkingSlot",
      required: [true, "Parking slot reference ID is required"],
    },
    bookingDate: {
      type: Date,
      default: Date.now,
      required: true,
    },
    entryTime: {
      type: Date,
      required: [true, "Booking entry date & time is required"],
    },
    exitTime: {
      type: Date,
      required: [true, "Booking exit date & time is required"],
    },
    bookingStatus: {
      type: String,
      required: [true, "Booking transaction status is required"],
      enum: {
        values: ["active", "completed", "cancelled"],
        message: "Status must be active, completed, or cancelled",
      },
      default: "active",
    },
    price: {
      type: Number,
      required: [true, "Booking price is required"],
      min: [0, "Price cannot be negative"],
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
// userId: Acceleration when listing a specific user's booking history in UI
bookingSchema.index({ userId: 1 });
// parkingLotId: Accelaration when rendering manager reservation metrics
bookingSchema.index({ parkingLotId: 1 });
// compound index status & entryTime: Used to scan active slot reservations at specific timelines
bookingSchema.index({ bookingStatus: 1, entryTime: 1 });

const Booking = mongoose.model("Booking", bookingSchema);
export default Booking;
