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
        { groupId },
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
          completed: false,
        }
       },
    },
    orderBy: { createdAt: "asc" },
  });
}

// ok given an arrary of users, 

export function getIncompleteGoodsWithinGroup({ group }) {

  return prisma.goods.findMany({
    where: {
      AND: [
        { group: group },
        { completed: false },
      ],
    },
    select: { id: true, name: true, groupId: true },
    orderBy: { createdAt: "asc" },
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

export function updateGood({ title, id }) {
  return prisma.good.update({
    data: { title },
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

