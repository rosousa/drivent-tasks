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
  await createBooking(user1.id, roomId);
  await createBooking(user2.id, roomId);
}
