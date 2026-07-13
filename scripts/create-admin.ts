import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { connectToDatabase } from "../lib/db";
import AdminUser from "../models/AdminUser";

async function createAdmin() {
  await connectToDatabase();
  console.log("Connected to MongoDB...");

  const email = "senthilragunathan2004@gmail.com";
  const password = "Senthil@123";
  
  const passwordHash = await bcrypt.hash(password, 10);

  const existingAdmin = await AdminUser.findOne({ email: email.toLowerCase() });
  
  if (existingAdmin) {
    existingAdmin.passwordHash = passwordHash;
    await existingAdmin.save();
    console.log(`Admin user ${email} updated successfully!`);
  } else {
    await AdminUser.create({
      name: "Senthil",
      email: email.toLowerCase(),
      passwordHash,
      role: "superadmin",
    });
    console.log(`Admin user ${email} created successfully!`);
  }

  process.exit(0);
}

createAdmin().catch((err) => {
  console.error(err);
  process.exit(1);
});
