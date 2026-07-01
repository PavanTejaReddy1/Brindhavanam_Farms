import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Inventory from "@/models/Inventory";
import { requireAuth } from "@/lib/auth";

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const authCheck = await requireAuth("admin")(req);
    if (authCheck.status !== 200) return authCheck;

    const body = await req.json();

    await connectDB();

    const inventory = await Inventory.findByIdAndUpdate(
      params.id,
      { $set: { ...body, lastUpdated: new Date() } },
      { new: true, runValidators: true }
    );

    if (!inventory) {
      return NextResponse.json(
        { error: "Inventory item not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Inventory updated successfully", inventory },
      { status: 200 }
    );
  } catch (error) {
    console.error("Update inventory error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
