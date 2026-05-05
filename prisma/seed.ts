import { PrismaClient } from "@prisma/client";
import * as bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  const hashedPassword = await bcrypt.hash("123456", 10);

  // 👤 Admin user
  await prisma.user.upsert({
    where: { email: "admin@abaya.com" },
    update: {},
    create: {
      email: "admin@abaya.com",
      password: hashedPassword,
      role: "ADMIN",
    },
  });

  // 👤 Normal user
  await prisma.user.upsert({
    where: { email: "user@abaya.com" },
    update: {},
    create: {
      email: "user@abaya.com",
      password: hashedPassword,
      role: "USER",
    },
  });

  // 🛍️ Products
  await prisma.product.createMany({
  data: [
    {
      name: "Luxury Black Abaya",
      price: 120,
      image: "abaya-black.jpg",
      description: "Elegant premium black abaya for special occasions",
      category: "Women",
      stock: 10, // ✅ ADD THIS
      sizes: ["S", "M", "L"],
      colors: ["Black"]
    },
    {
      name: "Elegant Dubai Abaya",
      price: 150,
      image: "abaya-dubai.jpg",
      description: "Luxury Dubai-style abaya with modern design",
      category: "Women",
      stock: 15,
      sizes: ["S", "M", "L"],
      colors: ["Black", "Gold"]
    },
    {
      name: "Casual Everyday Abaya",
      price: 80,
      image: "abaya-casual.jpg",
      description: "Comfortable daily wear abaya",
      category: "Women",
      stock: 20,
      sizes: ["S", "M", "L"],
      colors: ["Grey", "Black"]
    },
    {
      name: "Premium Silk Abaya",
      price: 200,
      image: "abaya-silk.jpg",
      description: "High-quality silk abaya for luxury fashion",
      category: "Women",
      stock: 8,
      sizes: ["S", "M", "L"],
      colors: ["Black", "Navy"]
    }
  ]
});
  console.log("✅ Seed completed successfully");
}

main()
  .catch((e) => {
    console.error("❌ Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });