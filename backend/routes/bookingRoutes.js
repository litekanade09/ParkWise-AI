import express from "express";
import bookingController from "../controllers/bookingController.js";
import { bookingCreateRules, bookingUpdateRules } from "../validators/bookingValidator.js";
import validate from "../middlewares/validate.js";
import { protect, authorize } from "../middlewares/auth.js";

const router = express.Router();

router.use(protect);

router
  .route("/")
  .post(authorize("vehicle_owner"), bookingCreateRules, validate, bookingController.createBooking)
  .get(bookingController.getAllBookings);

router
  .route("/:id")
  .get(bookingController.getBookingById)
  .put(bookingUpdateRules, validate, bookingController.updateBooking)
  .delete(bookingController.deleteBooking);

export default router;
