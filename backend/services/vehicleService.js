import Vehicle from "../models/Vehicle.js";

class VehicleService {
  async createVehicle(vehicleData) {
    const vehicle = new Vehicle(vehicleData);
    return await vehicle.save();
  }

  async getAllVehicles(filter = {}) {
    return await Vehicle.find(filter).populate("userId", "name email role");
  }

  async getVehicleById(id) {
    return await Vehicle.findById(id).populate("userId", "name email role");
  }

  async updateVehicle(id, updateData) {
    return await Vehicle.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });
  }

  async deleteVehicle(id) {
    return await Vehicle.findByIdAndDelete(id);
  }
}

export default new VehicleService();
