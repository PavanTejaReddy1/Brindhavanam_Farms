import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

import connectDB from "@/lib/mongodb";
import Admin from "@/models/Admin";
import { hashPassword } from "@/lib/password";

async function seedAdmin() {
  try {
    await connectDB();
    
    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD;
    
    if (!adminEmail || !adminPassword) {
      console.error("ADMIN_EMAIL and ADMIN_PASSWORD must be set in .env.local");
      process.exit(1);
    }
    
    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ email: adminEmail });
    if (existingAdmin) {
      console.log("Admin already exists:", adminEmail);
      process.exit(0);
    }
    
    // Hash password
    const hashedPassword = await hashPassword(adminPassword);
    
    // Create admin
    const admin = await Admin.create({
      name: "Admin",
      email: adminEmail,
      password: hashedPassword,
      role: "admin",
    });
    
    console.log("Admin created successfully:", adminEmail);
    process.exit(0);
  } catch (error) {
    console.error("Error seeding admin:", error);
    process.exit(1);
  }
}

seedAdmin();
