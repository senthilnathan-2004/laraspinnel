import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { connectToDatabase } from "../lib/db";
import AdminUser from "../models/AdminUser";

async function updateAdmin() {
  await connectToDatabase();
  const passwordHash = await bcrypt.hash("Senthil@123", 10);
  
  // Make sure the default admin has this password too
  const defaultAdmin = await AdminUser.findOne({ email: "admin@ragugoatfarm.com" });
  if (defaultAdmin) {
    defaultAdmin.passwordHash = passwordHash;
    await defaultAdmin.save();
  }

  // Also create a catch-all in case they made a typo with @gr
  const typoEmail = "senthilragunathan2004@gr";
  const existingTypo = await AdminUser.findOne({ email: typoEmail });
  if (!existingTypo) {
    await AdminUser.create({
      name: "Senthil (Typo)",
      email: typoEmail,
      passwordHash,
      role: "superadmin"
    });
  }

  // Ensure main one is correct
  const mainEmail = "senthilragunathan2004@gmail.com";
  const mainAdmin = await AdminUser.findOne({ email: mainEmail });
  if (mainAdmin) {
    mainAdmin.passwordHash = passwordHash;
    await mainAdmin.save();
  } else {
    await AdminUser.create({
      name: "Senthil",
      email: mainEmail,
      passwordHash,
      role: "superadmin"
    });
  }
  console.log("All accounts updated with password Senthil@123!");
  process.exit(0);
}

updateAdmin();
