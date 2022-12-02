import { prisma } from "@/config";

async function findBookingByUserId(userId: number) {
  return prisma.booking.findFirst({
    where: {
      userId
    },
    include: {
      Room: true
    }
  });
}

async function createBooking(userId: number, roomId: number) {
  return prisma.booking.create({
    data: {
      userId,
      roomId
    }
  });
}

async function updateBooking(userId: number, roomId: number, bookingId: number) {
  return prisma.booking.update({
    where: {
      id: bookingId
    },
    data: {
      userId,
      roomId
    }
  });
}

const bookingRepository = {
  findBookingByUserId,
  createBooking,
  updateBooking
};

export default bookingRepository;
