import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import cors from "cors";

// Configurations
import connectDB from "./config/db.js";

// Middlewares
import { notFound, errorHandler } from "./middlewares/error.js";

// Routes imports
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import vehicleRoutes from "./routes/vehicleRoutes.js";
import parkingLotRoutes from "./routes/parkingLotRoutes.js";
import parkingSlotRoutes from "./routes/parkingSlotRoutes.js";
import bookingRoutes from "./routes/bookingRoutes.js";
import parkingAnalyticsRoutes from "./routes/parkingAnalyticsRoutes.js";

// Load environment variables
dotenv.config();

// Connect to Database
connectDB();

const app = express();

// Global Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

if (process.env.NODE_ENV !== "production") {
  app.use(morgan("dev"));
}

// Health Check API
app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "ParkWise AI backend is healthy and running",
    timestamp: new Date(),
  });
});

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "ParkWise AI Backend is running"
  });
});

// API Routes mounting
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/vehicles", vehicleRoutes);
app.use("/api/parking-lots", parkingLotRoutes);
app.use("/api/slots", parkingSlotRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/analytics", parkingAnalyticsRoutes);

// Fallback handlers
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running in ${process.env.NODE_ENV || "development"} mode on port ${PORT}`);
});
