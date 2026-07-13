import mongoose from "mongoose";
import { connectToDatabase } from "../lib/db";
import AdminUser from "../models/AdminUser";

async function checkAdmin() {
  await connectToDatabase();
  console.log("Connected to MongoDB...");
  const users = await AdminUser.find({});
  console.log("All Admins in DB:", users.map(u => u.email));
  const specific = await AdminUser.findOne({ email: "senthilragunathan2004@gmail.com" });
  console.log("Specific User Found:", specific ? specific.email : "null");
  process.exit(0);
}
checkAdmin();
