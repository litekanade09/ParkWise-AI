import express from "express";
import parkingSlotController from "../controllers/parkingSlotController.js";
import { parkingSlotCreateRules, parkingSlotUpdateRules } from "../validators/parkingSlotValidator.js";
import validate from "../middlewares/validate.js";
import { protect, authorize } from "../middlewares/auth.js";

const router = express.Router();

router.use(protect);

router
  .route("/")
  .post(authorize("parking_manager"), parkingSlotCreateRules, validate, parkingSlotController.createParkingSlot)
  .get(parkingSlotController.getAllParkingSlots);

router
  .route("/:id")
  .get(parkingSlotController.getParkingSlotById)
  .put(authorize("parking_manager"), parkingSlotUpdateRules, validate, parkingSlotController.updateParkingSlot)
  .delete(authorize("parking_manager"), parkingSlotController.deleteParkingSlot);

export default router;
