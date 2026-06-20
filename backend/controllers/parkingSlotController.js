import parkingSlotService from "../services/parkingSlotService.js";
import { sendSuccess, sendError } from "../utils/response.js";

class ParkingSlotController {
  syncOccupancy = async (req, res, next) => {
    try {
      const { parkingLotId, detections } = req.body;
      if (!parkingLotId || !detections || !Array.isArray(detections)) {
        return sendError(res, "parkingLotId and detections (array) are required", {}, 400);
      }
      const syncResult = await parkingSlotService.syncOccupancy(parkingLotId, detections);
      return sendSuccess(res, "Parking slots synchronized successfully", syncResult, 200);
    } catch (error) {
      next(error);
    }
  };

  createParkingSlot = async (req, res, next) => {
    try {
      const slot = await parkingSlotService.createParkingSlot(req.body);
      return sendSuccess(res, "Parking slot created successfully", slot, 201);
    } catch (error) {
      next(error);
    }
  };

  getAllParkingSlots = async (req, res, next) => {
    try {
      const filter = {};
      if (req.query.parkingLotId) {
        filter.parkingLotId = req.query.parkingLotId;
      }
      if (req.query.status) {
        filter.status = req.query.status;
      }
      if (req.query.zone) {
        filter.zone = req.query.zone;
      }
      if (req.query.slotType) {
        filter.slotType = req.query.slotType;
      }
      const slots = await parkingSlotService.getAllParkingSlots(filter);
      return sendSuccess(res, "Parking slots retrieved successfully", slots);
    } catch (error) {
      next(error);
    }
  };

  getParkingSlotById = async (req, res, next) => {
    try {
      const slot = await parkingSlotService.getParkingSlotById(req.params.id);
      if (!slot) {
        return sendError(res, "Parking slot not found", {}, 404);
      }
      return sendSuccess(res, "Parking slot retrieved successfully", slot);
    } catch (error) {
      next(error);
    }
  };

  updateParkingSlot = async (req, res, next) => {
    try {
      const slot = await parkingSlotService.updateParkingSlot(req.params.id, req.body);
      if (!slot) {
        return sendError(res, "Parking slot not found", {}, 404);
      }
      return sendSuccess(res, "Parking slot updated successfully", slot);
    } catch (error) {
      next(error);
    }
  };

  deleteParkingSlot = async (req, res, next) => {
    try {
      const slot = await parkingSlotService.deleteParkingSlot(req.params.id);
      if (!slot) {
        return sendError(res, "Parking slot not found", {}, 404);
      }
      return sendSuccess(res, "Parking slot deleted successfully", slot);
    } catch (error) {
      next(error);
    }
  };
}

export default new ParkingSlotController();
