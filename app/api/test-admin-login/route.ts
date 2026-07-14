import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Admin from "@/models/Admin";
import { comparePassword } from "@/lib/password";
import { hashPassword } from "@/lib/password";

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password } = body;
    
    await connectDB();
    
    const admin = await Admin.findOne({ email });
    if (!admin) {
      return NextResponse.json({ error: "Admin not found" }, { status: 404 });
    }
    
    const isPasswordValid = await comparePassword(password, admin.password);
    
    // Test hashing the current password
    const testHash = await hashPassword(password);
    
    return NextResponse.json({
      email: admin.email,
      passwordMatch: isPasswordValid,
      storedHash: admin.password,
      testHash: testHash,
      inputPassword: password
    });
  } catch (error) {
    console.error("Test login error:", error);
    return NextResponse.json(
      { error: "Test failed", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}
