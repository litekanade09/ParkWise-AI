import express from "express";
import parkingAnalyticsController from "../controllers/parkingAnalyticsController.js";

const router = express.Router();

// Public routes for AI synchronization and dashboard retrieval
router.post("/update", parkingAnalyticsController.updateAnalytics);
router.get("/:parkingLotId", parkingAnalyticsController.getAnalytics);

export default router;
