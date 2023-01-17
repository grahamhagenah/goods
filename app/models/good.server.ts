import type { User, Good } from "@prisma/client";

import { prisma } from "~/db.server";

export type { Good } from "@prisma/client";

export function getGood({
  id,
  userId,
}: Pick<Good, "id"> & {
  userId: User["id"];
}) {
  return prisma.good.findFirst({
    select: { id: true, title: true },
    where: { id, userId },
  });
}

export function getUser({ userId }: {userId: User["id"]; }) {
  return prisma.user.findFirst({
    select: { name: true },
    where: { userId },
  });
}

export function getGoodListItems({ userId }: { userId: User["id"] }) {
  return prisma.good.findMany({
    where: { userId },
    select: { id: true, title: true },
    orderBy: { updatedAt: "desc" },
  });
}

export function getIncompleteGoodListItems({ userId }: { userId: User["id"] }) {
  return prisma.good.findMany({
    where: {
      AND: [
        { userId },
        { completed: false},
      ],
    },
    select: { id: true, title: true, completed: false, user: true, updatedAt: true },
    orderBy: { createdAt: "desc" },
  });
}

export function getCompletedGoodListItems({ userId }: { userId: User["id"] }) {
  return prisma.good.findMany({
    where: {
      AND: [
        { userId },
        { completed: true},
      ],
    },
    select: { id: true, title: true, completed: true, user: true, updatedAt: true },
    orderBy: { updatedAt: "desc" },
  });
}

export function deleteGood({ id, userId,}: Pick<Good, "id"> & { userId: User["id"] }) {
  return prisma.good.deleteMany({
    where: { id, userId },
  });
}

export function updateGood({ title, id }) {
  return prisma.good.update({
    data: { title },
    where: { id },
  });
}

export function markComplete({ id }) {
  return prisma.good.update({
    data: { completed: true },
    where: { id },
  });
}

export function markIncomplete({ id }) {
  return prisma.good.update({
    data: { completed: false },
    where: { id },
  });
}

export function createGood({ title, userId }: Pick<Good, "title"> & { userId: User["id"]; }) {
  return prisma.good.create({
    data: {
      title,
      user: {
        // The following query creates (create ) a new User record and connects that record (connect ) to an existing userId:
        connect: {
          id: userId,
        },
      },
    },
  });
}
