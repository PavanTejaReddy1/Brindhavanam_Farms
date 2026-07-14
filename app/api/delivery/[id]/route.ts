import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Delivery from "@/models/Delivery";
import { requireAuth } from "@/lib/auth";

export const dynamic = 'force-dynamic';

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const authCheck = await requireAuth("admin")(req);
    if (authCheck.status !== 200) return authCheck;

    const body = await req.json();

    await connectDB();

    const delivery = await Delivery.findByIdAndUpdate(
      params.id,
      { $set: body },
      { new: true, runValidators: true }
    );

    if (!delivery) {
      return NextResponse.json(
        { error: "Delivery not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Delivery updated successfully", delivery },
      { status: 200 }
    );
  } catch (error) {
    console.error("Update delivery error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
