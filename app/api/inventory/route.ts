import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Inventory from "@/models/Inventory";
import { requireAuth } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const inventory = await Inventory.find()
      .sort({ createdAt: -1 })
      .populate("productId", "name price");

    return NextResponse.json({ inventory }, { status: 200 });
  } catch (error) {
    console.error("Get inventory error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const authCheck = await requireAuth("admin")(req);
    if (authCheck.status !== 200) return authCheck;

    const body = await req.json();

    await connectDB();

    const inventory = await Inventory.create(body);

    return NextResponse.json(
      { message: "Inventory item created successfully", inventory },
      { status: 201 }
    );
  } catch (error) {
    console.error("Create inventory error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
