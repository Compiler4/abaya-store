import { PrismaClient } from "@prisma/client";
import * as bcrypt from "bcryptjs";
import { randomBytes } from "crypto";

const prisma = new PrismaClient();

function createTemporaryPassword() {
  return randomBytes(18).toString("base64url");
}

async function main() {
  const email =
    process.env.ADMIN_EMAIL?.trim().toLowerCase() || "admin@abaya.com";
  const configuredPassword = process.env.ADMIN_PASSWORD?.trim();

  const existingAdmin = await prisma.user.findUnique({
    where: { email },
    select: { id: true, email: true, role: true },
  });

  if (existingAdmin) {
    if (configuredPassword) {
      const hashedPassword = await bcrypt.hash(configuredPassword, 10);

      await prisma.user.update({
        where: { id: existingAdmin.id },
        data: {
          password: hashedPassword,
          role: "ADMIN",
        },
      });

      console.log(`Admin password updated: ${existingAdmin.email}`);
      return;
    }

    if (existingAdmin.role !== "ADMIN") {
      await prisma.user.update({
        where: { id: existingAdmin.id },
        data: { role: "ADMIN" },
      });
    }

    console.log(`Admin already exists: ${existingAdmin.email}`);
    return;
  }

  const password = configuredPassword || createTemporaryPassword();
  const hashedPassword = await bcrypt.hash(password, 10);

  const admin = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      role: "ADMIN",
    },
  });

  console.log(`Admin seed completed: ${admin.email}`);

  if (!configuredPassword) {
    console.log(`Temporary admin password: ${password}`);
    console.log(
      "Set ADMIN_PASSWORD in .env before seeding production again if you want a fixed initial password."
    );
  }
}

main()
  .catch((error) => {
    console.error("Admin seed failed:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
