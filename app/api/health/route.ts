import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    await connectDB();
    return NextResponse.json({ 
      status: "ok", 
      message: "Backend is running",
      database: "connected" 
    });
  } catch (error) {
    return NextResponse.json({ 
      status: "error", 
      message: "Database connection failed",
      error: error instanceof Error ? error.message : "Unknown error"
    }, { status: 500 });
  }
}
