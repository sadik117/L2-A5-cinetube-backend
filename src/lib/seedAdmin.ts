import bcrypt from "bcrypt";
import { prisma } from "./prisma";
import { Role } from "../generated/prisma/enums";


async function main() {
  const adminEmail = "admin@gmail.com";
  const adminPassword = "admin123";

  // check if admin already exists
  const existingAdmin = await prisma.user.findUnique({
    where: { email: adminEmail },
  });

  if (existingAdmin) {
    console.log("Admin already exists");
    return;
  }

  // hash password
  const hashedPassword = await bcrypt.hash(adminPassword, 10);

  // create admin
  const admin = await prisma.user.create({
    data: {
      name: "Admin",
      email: adminEmail,
      password: hashedPassword,
      role: Role.ADMIN
    },
  });

  console.log("Admin created successfully");
  console.log(admin);
}

main()
  .catch((e) => {
    console.error(e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });