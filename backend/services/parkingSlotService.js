import ParkingSlot from "../models/ParkingSlot.js";
import Booking from "../models/Booking.js";

class ParkingSlotService {
  async syncOccupancy(parkingLotId, detections) {
    const results = [];
    for (const detection of detections) {
      const { slotId, isOccupied } = detection;
      const slot = await ParkingSlot.findOne({ parkingLotId, slotId });
      
      if (!slot) {
        results.push({ slotId, status: "not_found", updated: false });
        continue;
      }

      const originalStatus = slot.status;
      if (isOccupied) {
        // Rule 1 & Rule 2: If AI detects occupied, update empty -> occupied and reserved -> occupied
        if (originalStatus === "empty" || originalStatus === "reserved") {
          slot.status = "occupied";
          await slot.save();
          results.push({ slotId, status: "occupied", originalStatus, updated: true });
        } else {
          results.push({ slotId, status: originalStatus, originalStatus, updated: false });
        }
      } else {
        // Rule 3: If AI detects empty and slot is occupied, update occupied -> empty and complete active booking
        if (originalStatus === "occupied") {
          slot.status = "empty";
          await slot.save();

          // Find active booking for this slot and update to completed
          const activeBooking = await Booking.findOne({
            parkingLotId,
            slotId: slot._id,
            bookingStatus: "active"
          });

          if (activeBooking) {
            activeBooking.bookingStatus = "completed";
            await activeBooking.save();
          }

          results.push({
            slotId,
            status: "empty",
            originalStatus,
            updated: true,
            completedBooking: activeBooking ? activeBooking._id : null
          });
        }
        // Rule 4: If AI detects empty and slot is reserved, do nothing (keep reserved)
        else {
          results.push({ slotId, status: originalStatus, originalStatus, updated: false });
        }
      }
    }
    return results;
  }

  async createParkingSlot(slotData) {
    const slot = new ParkingSlot(slotData);
    return await slot.save();
  }

  async getAllParkingSlots(filter = {}) {
    return await ParkingSlot.find(filter).populate("parkingLotId", "parkingName city");
  }

  async getParkingSlotById(id) {
    return await ParkingSlot.findById(id).populate("parkingLotId", "parkingName city");
  }

  async updateParkingSlot(id, updateData) {
    return await ParkingSlot.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });
  }

  async deleteParkingSlot(id) {
    return await ParkingSlot.findByIdAndDelete(id);
  }
}

export default new ParkingSlotService();
