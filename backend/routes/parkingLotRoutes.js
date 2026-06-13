import express from "express";
import parkingLotController from "../controllers/parkingLotController.js";
import { parkingLotCreateRules, parkingLotUpdateRules } from "../validators/parkingLotValidator.js";
import validate from "../middlewares/validate.js";
import { protect, authorize } from "../middlewares/auth.js";

const router = express.Router();

router
  .route("/")
  .post(protect, authorize("parking_manager"), parkingLotCreateRules, validate, parkingLotController.createParkingLot)
  .get(protect, parkingLotController.getAllParkingLots);

router.route("/search").get(protect, parkingLotController.searchParkingLots);

router
  .route("/:id")
  .get(protect, parkingLotController.getParkingLotById)
  .put(protect, authorize("parking_manager"), parkingLotUpdateRules, validate, parkingLotController.updateParkingLot)
  .delete(protect, authorize("parking_manager"), parkingLotController.deleteParkingLot);

export default router;
