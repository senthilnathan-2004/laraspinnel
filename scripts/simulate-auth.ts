import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { connectToDatabase } from "../lib/db";
import AdminUser from "../models/AdminUser";

async function simulate() {
  await connectToDatabase();
  console.log("DB Name:", mongoose.connection.name);
  
  const email = "senthilragunathan2004@gmail.com".trim().toLowerCase();
  console.log("Searching for:", email);
  
  const user = await AdminUser.findOne({ email });
  console.log("Found:", user ? user.email : "null");
  
  if (user) {
    const isPasswordValid = await bcrypt.compare("Senthil@123", user.passwordHash);
    console.log("Password valid:", isPasswordValid);
  }
  process.exit(0);
}
simulate();
