import ParkingLot from "../models/ParkingLot.js";
import ParkingSlot from "../models/ParkingSlot.js";

class ParkingLotService {
  async createParkingLot(lotData) {
    const lot = new ParkingLot(lotData);
    const savedLot = await lot.save();

    const slotsToCreate = [];

    // Bike slots
    if (savedLot.bikeSlots > 0) {
      for (let i = 1; i <= savedLot.bikeSlots; i++) {
        slotsToCreate.push({
          parkingLotId: savedLot._id,
          slotId: `B${i}`,
          zone: "Zone 1",
          slotType: "Bike",
          status: "empty",
        });
      }
    }

    // Car slots
    if (savedLot.carSlots > 0) {
      for (let i = 1; i <= savedLot.carSlots; i++) {
        slotsToCreate.push({
          parkingLotId: savedLot._id,
          slotId: `C${i}`,
          zone: "Zone 2",
          slotType: "Car",
          status: "empty",
        });
      }
    }

    // SUV slots
    if (savedLot.suvSlots > 0) {
      for (let i = 1; i <= savedLot.suvSlots; i++) {
        slotsToCreate.push({
          parkingLotId: savedLot._id,
          slotId: `S${i}`,
          zone: "Zone 3",
          slotType: "SUV",
          status: "empty",
        });
      }
    }

    // Truck slots
    if (savedLot.truckSlots > 0) {
      for (let i = 1; i <= savedLot.truckSlots; i++) {
        slotsToCreate.push({
          parkingLotId: savedLot._id,
          slotId: `T${i}`,
          zone: "Zone 4",
          slotType: "Truck",
          status: "empty",
        });
      }
    }

    if (slotsToCreate.length > 0) {
      await ParkingSlot.insertMany(slotsToCreate);
    }

    return savedLot;
  }

  async getAllParkingLots(filter = {}) {
    return await ParkingLot.find(filter).populate("createdBy", "name email role");
  }

  async getParkingLotById(id) {
    return await ParkingLot.findById(id).populate("createdBy", "name email role");
  }

  async updateParkingLot(id, updateData) {
    return await ParkingLot.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });
  }

  async deleteParkingLot(id) {
    return await ParkingLot.findByIdAndDelete(id);
  }
}

export default new ParkingLotService();
