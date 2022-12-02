import faker from "@faker-js/faker";
import { prisma } from "@/config";
import { createUser } from "./users-factory";

export async function createBooking(userId: number, roomId: number) {
  return await prisma.booking.create({
    data: {
      userId,
      roomId
    }
  });
}

export async function findBookings() {
  return await prisma.booking.findMany();
}

export async function createTwoBookings(roomId: number) {
  const user1 = await createUser();
  const user2 = await createUser();
  const booking1 = await createBooking(user1.id, roomId);
  const booking2 = await createBooking(user2.id, roomId);

  return [booking1.id, booking2.id];
}

export async function findBookingByUserId(userId: number) {
  return prisma.booking.findFirst({
    where: {
      userId
    }
  });
}
