import mongoose from "mongoose";

const vehicleSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User ID is required"],
    },
    vehicleNumber: {
      type: String,
      required: [true, "Vehicle number is required"],
      unique: true,
      trim: true,
      uppercase: true,
    },
    vehicleType: {
      type: String,
      required: [true, "Vehicle type is required"],
      enum: {
        values: ["Car", "Bike", "SUV", "Truck", "Electric Vehicle"],
        message: "Invalid vehicle type",
      },
    },
    vehicleColor: {
      type: String,
      required: [true, "Vehicle color is required"],
      trim: true,
    },
    vehicleModel: {
      type: String,
      required: [true, "Vehicle model is required"],
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// Note: A unique index on 'vehicleNumber' is automatically created by the field definition 'unique: true' above.
// userId: Fast lookup to load all vehicles owned by a specific user profile
vehicleSchema.index({ userId: 1 });

const Vehicle = mongoose.model("Vehicle", vehicleSchema);
export default Vehicle;
