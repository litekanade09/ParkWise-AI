import Booking from "../models/Booking.js";
import ParkingSlot from "../models/ParkingSlot.js";
import Vehicle from "../models/Vehicle.js";

class BookingService {
  async createBooking(bookingData) {
    // Start slot reservation
    const slot = await ParkingSlot.findById(bookingData.slotId);
    if (!slot) {
      throw new Error("Target parking slot does not exist");
    }
    if (slot.status !== "empty") {
      throw new Error(`Target parking slot is not empty (current: ${slot.status})`);
    }

    // Fetch vehicle to verify type constraint
    const vehicle = await Vehicle.findById(bookingData.vehicleId);
    if (!vehicle) {
      throw new Error("Target vehicle does not exist");
    }

    const targetSlotType = (vehicle.vehicleType === "Electric Vehicle") ? "Car" : vehicle.vehicleType;
    if (slot.slotType !== targetSlotType) {
      throw new Error(`Vehicle type (${vehicle.vehicleType}) cannot be assigned to a ${slot.slotType} slot`);
    }

    // Save booking
    const booking = new Booking(bookingData);
    const savedBooking = await booking.save();

    // Toggle Slot Status to reserved
    slot.status = "reserved";
    await slot.save();

    return savedBooking;
  }

  async getAllBookings(filter = {}) {
    return await Booking.find(filter)
      .populate("userId", "name email phone")
      .populate("vehicleId", "vehicleNumber vehicleType vehicleModel")
      .populate("parkingLotId", "parkingName city")
      .populate("slotId", "slotId zone slotType status");
  }

  async getBookingById(id) {
    return await Booking.findById(id)
      .populate("userId", "name email phone")
      .populate("vehicleId", "vehicleNumber vehicleType vehicleModel")
      .populate("parkingLotId", "parkingName city")
      .populate("slotId", "slotId zone slotType status");
  }

  async updateBooking(id, updateData) {
    const originalBooking = await Booking.findById(id);
    if (!originalBooking) {
      return null;
    }

    const updatedBooking = await Booking.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    // Handle slot state changes based on booking status transitions
    if (updateData.bookingStatus && updateData.bookingStatus !== originalBooking.bookingStatus) {
      const slot = await ParkingSlot.findById(originalBooking.slotId);
      if (slot) {
        if (updateData.bookingStatus === "cancelled" || updateData.bookingStatus === "completed") {
          slot.status = "empty";
        } else if (updateData.bookingStatus === "active") {
          slot.status = "occupied";
        }
        await slot.save();
      }
    }

    return updatedBooking;
  }

  async deleteBooking(id) {
    const booking = await Booking.findById(id);
    if (booking) {
      // Release slot upon transaction delete
      const slot = await ParkingSlot.findById(booking.slotId);
      if (slot) {
        slot.status = "empty";
        await slot.save();
      }
      return await Booking.findByIdAndDelete(id);
    }
    return null;
  }
}

export default new BookingService();
