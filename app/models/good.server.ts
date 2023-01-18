import type { User, Good, Group } from "@prisma/client";

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

export function getGroup({ groupId }: {groupId: Group["id"]; }) {
  return prisma.group.findFirst({
    select: { id: true },
    where: { groupId },
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

export function getAllIncompleteGoods({ groupId }: { groupId: Group["id"] }) {

  return prisma.good.findMany({
    where: {
      AND: [
        { groupId: groupId },
        { completed: false },
      ],
    },
    select: { id: true, groupId: true, title: true, user: true, createdAt: true, updatedAt: true, completed: true },
    orderBy: { createdAt: "desc" },
  });
}

export function getAllCompleteGoods({ groupId }: { groupId: Group["id"] }) {

  return prisma.good.findMany({
    where: {
      AND: [
        { groupId: groupId },
        { completed: true },
      ],
    },
    select: { id: true, groupId: true, title: true, user: true, createdAt: true, updatedAt: true, completed: true },
    orderBy: { createdAt: "desc" },
  });
}

export function deleteGood({ id, userId,}: Pick<Good, "id"> & { userId: User["id"] }) {
  return prisma.good.deleteMany({
    where: { id, userId },
  });
}

// why doesn't this work? why can't i use user here

export function updateGood({ title, id, userId }) {
  return prisma.good.update({
    data: { 
      title,
      userId: userId,
    },
    where: { id },
  });
}

export function markIncomplete({ id }) {
  return prisma.good.update({
    data: { completed: false },
    where: { id },
  });
}

export function markComplete({ id }) {
  return prisma.good.update({
    data: { completed: true },
    where: { id },
  });
}

export function createGood({ title, userId, groupId }: Pick<Good, "title"> & { userId: User["id"] } & { groupId: Group["id"] }) {
  return prisma.good.create({
    data: {
      title,
      group: {
        connect: {
          id: groupId,
        },
      },
      user: {
        // The following query creates (create ) a new User record and connects that record (connect ) to an existing userId:
        connect: {
          id: userId,
        },
      },
    },
  });
}

