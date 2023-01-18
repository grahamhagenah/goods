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

// You can do it in this way: just add goods to groups and go through groups to retrueve all goods

export function getAllIncompleteGoodsWithinGroup({ groupId }: { groupId: User["groupId"] }) {

  return prisma.user.findMany({
    where: {
      AND: [
        { 
          groupId,
          // goods: {
          //   completed: false,
          // }
        },
      ],
    },
    select: { 
      id: true, 
      name: true, 
      groupId: true, 
      goods: {
        select: {
          id: true, 
          title: true,
          user: true,
          completed: false,
        }
       },
    },
    orderBy: { createdAt: "desc" },
  });
}

// maybe I'm going about this the wrong way, I need to return a "good" where the groupId is something and 

export function getAllCompletedGoodsWithinGroup({ groupId }: { groupId: User["groupId"] }) {

  return prisma.user.findMany({
    where: {
      AND: [
        { 
          groupId
        },
      ],
    },
    select: { 
      id: true, 
      name: true, 
      groupId: true, 
      goods: {
        select: {
          id: true, 
          title: true,
          user: true,
          completed: true,
        }
       },
    },
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

// export function getAllCompletedGoodListItems({ groupId }: { groupId: Group["id"] }) {
//   return prisma.good.findMany({
//     where: {
//       AND: [
//         { groupId: group.id },
//         { completed: true},
//       ],
//     },
//     select: { id: true, title: true, completed: true, user: true, updatedAt: true },
//     orderBy: { updatedAt: "desc" },
//   });
// }


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

export function updateGood({ title, id, user }) {
  return prisma.good.update({
    data: { title, user },
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

