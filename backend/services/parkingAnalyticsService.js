import ParkingAnalytics from "../models/ParkingAnalytics.js";
import ParkingLot from "../models/ParkingLot.js";

class ParkingAnalyticsService {
  async updateAnalytics(parkingLotId, data) {
    // Validate that the ParkingLot exists
    const lot = await ParkingLot.findById(parkingLotId);
    if (!lot) {
      throw new Error("Parking lot not found");
    }

    // Find or create analytics document and update stats
    const analytics = await ParkingAnalytics.findOneAndUpdate(
      { parkingLotId },
      {
        totalSlots: data.totalSlots,
        occupiedSlots: data.occupiedSlots,
        emptySlots: data.emptySlots,
        lastUpdated: new Date(),
      },
      { new: true, upsert: true, runValidators: true }
    );

    return analytics;
  }

  async getAnalytics(parkingLotId) {
    // Find analytics by parkingLotId
    const analytics = await ParkingAnalytics.findOne({ parkingLotId }).populate(
      "parkingLotId",
      "parkingName city totalCapacity"
    );
    return analytics;
  }
}

export default new ParkingAnalyticsService();
