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

export function getGoodListItems({ userId }: { userId: User["id"] }) {
  return prisma.good.findMany({
    where: {
      AND: [
        { userId },
        { completed: false},
      ],
    },
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
    select: { id: true, title: true, completed: false, },
    orderBy: { updatedAt: "desc" },
  });
}

export function getCompletedGoodListItems({ userId }: { userId: User["id"] }) {
  return prisma.good.findMany({
    where: { userId },
    select: { id: true, title: true, completed: true, },
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

export function createGood({
  title,
  userId,
}: Pick<Good, "title"> & {
  userId: User["id"];
}) {
  return prisma.good.create({
    data: {
      title,
      user: {
        connect: {
          id: userId,
        },
      },
    },
  });
}
