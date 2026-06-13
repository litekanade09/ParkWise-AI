import ParkingSlot from "../models/ParkingSlot.js";

class ParkingSlotService {
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
