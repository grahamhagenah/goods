import type { Password, User, Group } from "@prisma/client";
import bcrypt from "bcryptjs";

import { prisma } from "~/db.server";

export type { User } from "@prisma/client";

export async function getUserById(id: User["id"]) {
  return prisma.user.findUnique(
    { where: { id } });
}

export async function getUserByEmail(email: User["email"]) {
  return prisma.user.findUnique({ where: { email } });
}

export async function getGroupById(id: Group["id"]) {
  return prisma.group.findUnique(
    { where: 
      { 
        id 
      },
      select: { id: true, users: true, name: true, createdAt: true },
    });
}

export function getGroup({ groupId }: {groupId: Group["id"]; }) {
  return prisma.group.findFirst({
    select: { id: true },
    where: { id: groupId },
  });
}

export function updateGroupName({ groupId, groupName }) {

  return prisma.group.update({
    data: { 
      name: groupName,
    },
    where: { id: groupId },
  });
}

export function updateGroup({ userId, groupId }) {

  if(getGroup(groupId) === null) {
    return prisma.group.create({
      data: {
        name: groupId + "group",
      },
    });
  }

  return prisma.user.update({
    data: { 
      groupId: groupId,
    },
    where: { id: userId },
  });
}

export function updateUserDetails(userId, name, surname) {
  return prisma.user.update({
    data: { 
      name: name,
      surname: surname,
    },
    where: { id: userId },
  });
}

export async function createUser(email: User["email"], password: string, name: User["name"], surname: User["surname"]) {
  const hashedPassword = await bcrypt.hash(password, 10);

  const group = await prisma.group.create({
    data: {
      name: name + "'s Group",
    },
  });

  return prisma.user.create({
    data: {
      email,
      password: {
        create: {
          hash: hashedPassword,
        },
      },
      name,
      surname,
      groupId: group.id,
    },
  });
}

export async function deleteUserByEmail(email: User["email"]) {
  return prisma.user.delete({ where: { email } });
}

export async function verifyLogin(
  email: User["email"],
  password: Password["hash"]
) {
  const userWithPassword = await prisma.user.findUnique({
    where: { email },
    include: {
      password: true,
    },
  });

  if (!userWithPassword || !userWithPassword.password) {
    return null;
  }

  const isValid = await bcrypt.compare(
    password,
    userWithPassword.password.hash
  );

  if (!isValid) {
    return null;
  }

  const { password: _password, ...userWithoutPassword } = userWithPassword;

  return userWithoutPassword;
}
