import bookingService from "../services/bookingService.js";
import { sendSuccess, sendError } from "../utils/response.js";
import ParkingLot from "../models/ParkingLot.js";

class BookingController {
  createBooking = async (req, res, next) => {
    try {
      const booking = await bookingService.createBooking(req.body);
      return sendSuccess(res, "Booking created successfully", booking, 201);
    } catch (error) {
      next(error);
    }
  };

  getAllBookings = async (req, res, next) => {
    try {
      const filter = {};
      if (req.user) {
        if (req.user.role === "vehicle_owner") {
          filter.userId = req.user._id;
        } else if (req.user.role === "parking_manager") {
          const lots = await ParkingLot.find({ createdBy: req.user._id });
          filter.parkingLotId = { $in: lots.map((l) => l._id) };
        }
      }
      if (req.query.bookingStatus) {
        filter.bookingStatus = req.query.bookingStatus;
      }
      const bookings = await bookingService.getAllBookings(filter);
      return sendSuccess(res, "Bookings retrieved successfully", bookings);
    } catch (error) {
      next(error);
    }
  };

  getBookingById = async (req, res, next) => {
    try {
      const booking = await bookingService.getBookingById(req.params.id);
      if (!booking) {
        return sendError(res, "Booking not found", {}, 404);
      }
      return sendSuccess(res, "Booking retrieved successfully", booking);
    } catch (error) {
      next(error);
    }
  };

  updateBooking = async (req, res, next) => {
    try {
      const booking = await bookingService.updateBooking(req.params.id, req.body);
      if (!booking) {
        return sendError(res, "Booking not found", {}, 404);
      }
      return sendSuccess(res, "Booking updated successfully", booking);
    } catch (error) {
      next(error);
    }
  };

  deleteBooking = async (req, res, next) => {
    try {
      const booking = await bookingService.deleteBooking(req.params.id);
      if (!booking) {
        return sendError(res, "Booking not found", {}, 404);
      }
      return sendSuccess(res, "Booking deleted successfully", booking);
    } catch (error) {
      next(error);
    }
  };
}

export default new BookingController();
