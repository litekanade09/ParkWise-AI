import vehicleService from "../services/vehicleService.js";
import { sendSuccess, sendError } from "../utils/response.js";

class VehicleController {
  createVehicle = async (req, res, next) => {
    try {
      const vehicle = await vehicleService.createVehicle(req.body);
      return sendSuccess(res, "Vehicle registered successfully", vehicle, 201);
    } catch (error) {
      next(error);
    }
  };

  getAllVehicles = async (req, res, next) => {
    try {
      const filter = {};
      if (req.user && req.user.role === "vehicle_owner") {
        filter.userId = req.user._id;
      } else if (req.query.userId) {
        filter.userId = req.query.userId;
      }
      const vehicles = await vehicleService.getAllVehicles(filter);
      return sendSuccess(res, "Vehicles retrieved successfully", vehicles);
    } catch (error) {
      next(error);
    }
  };

  getVehicleById = async (req, res, next) => {
    try {
      const vehicle = await vehicleService.getVehicleById(req.params.id);
      if (!vehicle) {
        return sendError(res, "Vehicle not found", {}, 404);
      }
      return sendSuccess(res, "Vehicle retrieved successfully", vehicle);
    } catch (error) {
      next(error);
    }
  };

  updateVehicle = async (req, res, next) => {
    try {
      const vehicle = await vehicleService.updateVehicle(req.params.id, req.body);
      if (!vehicle) {
        return sendError(res, "Vehicle not found", {}, 404);
      }
      return sendSuccess(res, "Vehicle updated successfully", vehicle);
    } catch (error) {
      next(error);
    }
  };

  deleteVehicle = async (req, res, next) => {
    try {
      const vehicle = await vehicleService.deleteVehicle(req.params.id);
      if (!vehicle) {
        return sendError(res, "Vehicle not found", {}, 404);
      }
      return sendSuccess(res, "Vehicle deleted successfully", vehicle);
    } catch (error) {
      next(error);
    }
  };
}

export default new VehicleController();
