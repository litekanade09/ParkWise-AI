import parkingAnalyticsService from "../services/parkingAnalyticsService.js";
import { sendSuccess, sendError } from "../utils/response.js";

class ParkingAnalyticsController {
  updateAnalytics = async (req, res, next) => {
    try {
      const { parkingLotId, emptySlots, occupiedSlots, totalSlots } = req.body;
      
      if (!parkingLotId) {
        return sendError(res, "parkingLotId is required", {}, 400);
      }

      if (emptySlots === undefined || occupiedSlots === undefined || totalSlots === undefined) {
        return sendError(res, "emptySlots, occupiedSlots, and totalSlots are required", {}, 400);
      }

      const analytics = await parkingAnalyticsService.updateAnalytics(parkingLotId, {
        emptySlots: Number(emptySlots),
        occupiedSlots: Number(occupiedSlots),
        totalSlots: Number(totalSlots),
      });

      return sendSuccess(res, "Parking analytics updated successfully", analytics, 200);
    } catch (error) {
      if (error.message === "Parking lot not found") {
        return sendError(res, error.message, {}, 404);
      }
      next(error);
    }
  };

  getAnalytics = async (req, res, next) => {
    try {
      const { parkingLotId } = req.params;
      
      const analytics = await parkingAnalyticsService.getAnalytics(parkingLotId);
      if (!analytics) {
        return sendError(res, "Parking analytics not found for this parking lot", {}, 404);
      }

      return sendSuccess(res, "Parking analytics retrieved successfully", analytics, 200);
    } catch (error) {
      next(error);
    }
  };
}

export default new ParkingAnalyticsController();
