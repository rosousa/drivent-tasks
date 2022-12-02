import bookingRepository from "@/repositories/booking-repository";
import enrollmentRepository from "@/repositories/enrollment-repository";
import ticketRepository from "@/repositories/ticket-repository";
import hotelRepository from "@/repositories/hotel-repository";
import { notFoundError, requestError } from "@/errors";

async function checkTicketStatus(userId: number) {
  const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);

  if (!enrollment) {
    throw notFoundError();
  }
  
  const ticket = await ticketRepository.findTicketByEnrollmentId(enrollment.id);

  if (!ticket || ticket.status === "RESERVED" || ticket.TicketType.isRemote || !ticket.TicketType.includesHotel) {
    throw requestError(403, "Forbidden");
  }
}

async function getBooking(userId: number) {
  await checkTicketStatus(userId);

  const booking = await bookingRepository.findBookingByUserId(userId);
  
  if (!booking) {
    throw notFoundError();
  }
  
  return booking;
}

async function createBooking(userId: number, roomId: number) {
  await checkTicketStatus(userId);

  if (roomId < 1 || !Number(roomId)) {
    throw requestError(403, "Forbidden");
  }

  const userBooking = await bookingRepository.findBookingByUserId(userId);

  if (userBooking) {
    throw requestError(403, "Forbidden");
  }

  const room = await hotelRepository.findRoomWithBookings(roomId);

  if (!room) {
    throw notFoundError();
  }

  if (room.capacity <= room.Booking.length) {
    throw requestError(403, "Forbidden");
  }

  const booking = await bookingRepository.createBooking(userId, roomId);
  
  return booking;
}

async function updateBooking(userId: number, roomId: number, bookingId: number) {
  await checkTicketStatus(userId);

  if (roomId < 1 || !Number(roomId) || bookingId < 1 || !Number(bookingId)) {
    throw requestError(403, "Forbidden");
  }

  const room = await hotelRepository.findRoomWithBookings(roomId);

  if (!room) {
    throw notFoundError();
  }

  const userBooking = await bookingRepository.findBookingByUserId(userId);

  if (!userBooking || userBooking.userId !== userId) {
    throw requestError(403, "Forbidden");
  }

  if (room.capacity <= room.Booking.length) {
    throw requestError(403, "Forbidden");
  }

  const booking = await bookingRepository.updateBooking(userId, room.id, bookingId);
  
  return booking;
}

const bookingService = {
  getBooking,
  createBooking,
  updateBooking
};

export default bookingService;
