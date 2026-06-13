import parkingLotService from "../services/parkingLotService.js";
import { sendSuccess, sendError } from "../utils/response.js";

class ParkingLotController {
  searchParkingLots = async (req, res, next) => {
    try {
      const { area, city, q } = req.query;
      const filter = {};

      if (area) {
        filter.area = { $regex: String(area), $options: "i" };
      }
      if (city) {
        filter.city = { $regex: String(city), $options: "i" };
      }
      if (q) {
        const queryRegex = { $regex: String(q), $options: "i" };
        filter.$or = [
          { parkingName: queryRegex },
          { area: queryRegex },
          { city: queryRegex },
        ];
      }

      const lots = await parkingLotService.getAllParkingLots(filter);
      return sendSuccess(res, "Parking lots searched successfully", lots);
    } catch (error) {
      next(error);
    }
  };

  createParkingLot = async (req, res, next) => {
    try {
      const lot = await parkingLotService.createParkingLot(req.body);
      return sendSuccess(res, "Parking lot created successfully", lot, 201);
    } catch (error) {
      next(error);
    }
  };

  getAllParkingLots = async (req, res, next) => {
    try {
      const filter = {};
      if (req.query.city) {
        filter.city = new RegExp(req.query.city, "i");
      }
      if (req.query.createdBy) {
        filter.createdBy = req.query.createdBy;
      }
      const lots = await parkingLotService.getAllParkingLots(filter);
      return sendSuccess(res, "Parking lots retrieved successfully", lots);
    } catch (error) {
      next(error);
    }
  };

  getParkingLotById = async (req, res, next) => {
    try {
      const lot = await parkingLotService.getParkingLotById(req.params.id);
      if (!lot) {
        return sendError(res, "Parking lot not found", {}, 404);
      }
      return sendSuccess(res, "Parking lot retrieved successfully", lot);
    } catch (error) {
      next(error);
    }
  };

  updateParkingLot = async (req, res, next) => {
    try {
      const lot = await parkingLotService.updateParkingLot(req.params.id, req.body);
      if (!lot) {
        return sendError(res, "Parking lot not found", {}, 404);
      }
      return sendSuccess(res, "Parking lot updated successfully", lot);
    } catch (error) {
      next(error);
    }
  };

  deleteParkingLot = async (req, res, next) => {
    try {
      const lot = await parkingLotService.deleteParkingLot(req.params.id);
      if (!lot) {
        return sendError(res, "Parking lot not found", {}, 404);
      }
      return sendSuccess(res, "Parking lot deleted successfully", lot);
    } catch (error) {
      next(error);
    }
  };
}

export default new ParkingLotController();
