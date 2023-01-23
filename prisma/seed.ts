import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { group } from "console";

const prisma = new PrismaClient();

async function seed() {
  const email = "rachel@remix.run";
  const name = "Rachel";
  const surname = "Remix";

  // cleanup the existing database
  await prisma.user.delete({ where: { email } }).catch(() => {
    // no worries if it doesn't exist yet
  });

  const hashedPassword = await bcrypt.hash("racheliscool", 10);

  // What I'm doing here is simulating both users being in the same group from the get-go
  // The next thing I need to configure is making sure that each user gets their own group to start with
  // then allowing the group id to be updated so that mutliple users can be in the same group
  const group = await prisma.group.create({
    data: {
      name: "Group!",
    },
  });

  const user = await prisma.user.create({
    data: {
      email,
      name,
      surname,
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
      surname: "Surname",
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
      groupId: group.id,
    },
  });

  await prisma.good.create({
    data: {
      title: "My incomplete good",
      completed: false,
      userId: user.id,
      groupId: group.id,
    },
  });

  await prisma.good.create({
    data: {
      title: "My completed good",
      completed: true,
      userId: user2.id,
      groupId: group.id,
    },
  });

  await prisma.good.create({
    data: {
      title: "My incomplete good",
      completed: false,
      userId: user2.id,
      groupId: group.id,
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
