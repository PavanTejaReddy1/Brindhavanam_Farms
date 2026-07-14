import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Admin from "@/models/Admin";

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    await connectDB();
    
    const adminEmail = process.env.ADMIN_EMAIL;
    const admins = await Admin.find({});
    
    return NextResponse.json({
      count: admins.length,
      admins: admins.map(a => ({ email: a.email, name: a.name })),
      configuredEmail: adminEmail
    });
  } catch (error) {
    console.error("Error checking admin:", error);
    return NextResponse.json(
      { error: "Failed to check admin" },
      { status: 500 }
    );
  }
}
