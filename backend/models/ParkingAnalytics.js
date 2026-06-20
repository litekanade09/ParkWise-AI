import mongoose from "mongoose";

const parkingAnalyticsSchema = new mongoose.Schema(
  {
    parkingLotId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ParkingLot",
      required: [true, "Parking lot reference ID is required"],
      unique: true,
    },
    totalSlots: {
      type: Number,
      required: [true, "Total slots is required"],
    },
    occupiedSlots: {
      type: Number,
      required: [true, "Occupied slots is required"],
    },
    emptySlots: {
      type: Number,
      required: [true, "Empty slots is required"],
    },
    lastUpdated: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Indexing parkingLotId for fast retrieval
parkingAnalyticsSchema.index({ parkingLotId: 1 });

const ParkingAnalytics = mongoose.model("ParkingAnalytics", parkingAnalyticsSchema);
export default ParkingAnalytics;
