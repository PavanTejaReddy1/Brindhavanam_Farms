import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Product from "@/models/Product";

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function POST() {
  try {
    await connectDB();
    
    // Update all products to be active
    const result = await Product.updateMany({}, { active: true });
    
    return NextResponse.json(
      { message: "Products activated", modifiedCount: result.modifiedCount },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error activating products:", error);
    return NextResponse.json(
      { error: "Failed to activate products" },
      { status: 500 }
    );
  }
}
