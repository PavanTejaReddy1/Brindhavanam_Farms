import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Admin from "@/models/Admin";
import { hashPassword } from "@/lib/password";

export async function POST() {
  try {
    await connectDB();
    
    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD;
    
    if (!adminEmail || !adminPassword) {
      return NextResponse.json(
        { error: "ADMIN_EMAIL and ADMIN_PASSWORD must be set in .env.local" },
        { status: 500 }
      );
    }
    
    // Delete existing admin with this email
    await Admin.deleteOne({ email: adminEmail });
    
    // Hash password
    const hashedPassword = await hashPassword(adminPassword);
    
    // Create admin
    const admin = await Admin.create({
      name: "Admin",
      email: adminEmail,
      password: hashedPassword,
      role: "admin",
      avatar: undefined,
    });
    
    return NextResponse.json(
      { message: "Admin created successfully", email: adminEmail },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error seeding admin:", error);
    return NextResponse.json(
      { error: "Failed to seed admin", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}
