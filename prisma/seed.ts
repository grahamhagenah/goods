import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { group } from "console";

const prisma = new PrismaClient();

async function seed() {
  const email = "rachel@remix.run";
  const name = "Rachel";

  // cleanup the existing database
  await prisma.user.delete({ where: { email } }).catch(() => {
    // no worries if it doesn't exist yet
  });

  const hashedPassword = await bcrypt.hash("racheliscool", 10);

  const group = await prisma.group.create({
    data: {
      name: "Group!",
    },
  });

  const user = await prisma.user.create({
    data: {
      email,
      name,
      groupId: group.id,
      password: {
        create: {
          hash: hashedPassword,
        },
      },
    },
  });

  const user2 = await prisma.user.create({
    data: {
      email: "grahamsss@gmail.com",
      name: "Sarah",
      groupId: group.id,
      password: {
        create: {
          hash: hashedPassword,
        },
      },
    },
  });

  await prisma.good.create({
    data: {
      title: "My completed good",
      completed: true,
      userId: user.id,
    },
  });

  await prisma.good.create({
    data: {
      title: "My incomplete good",
      completed: false,
      userId: user.id,
    },
  });

  await prisma.good.create({
    data: {
      title: "My completed good",
      completed: true,
      userId: user2.id,
    },
  });

  await prisma.good.create({
    data: {
      title: "My incomplete good",
      completed: false,
      userId: user2.id,
    },
  });

  console.log(`Database has been seeded. 🌱`);
}

seed()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
