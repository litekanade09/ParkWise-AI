import express from "express";
import vehicleController from "../controllers/vehicleController.js";
import { vehicleCreateRules, vehicleUpdateRules } from "../validators/vehicleValidator.js";
import validate from "../middlewares/validate.js";
import { protect, authorize } from "../middlewares/auth.js";

const router = express.Router();

// Apply protection middleware to all vehicle routes
router.use(protect);

router
  .route("/")
  .post(authorize("vehicle_owner"), vehicleCreateRules, validate, vehicleController.createVehicle)
  .get(vehicleController.getAllVehicles);

router
  .route("/:id")
  .get(vehicleController.getVehicleById)
  .put(authorize("vehicle_owner"), vehicleUpdateRules, validate, vehicleController.updateVehicle)
  .delete(authorize("vehicle_owner"), vehicleController.deleteVehicle);

export default router;
