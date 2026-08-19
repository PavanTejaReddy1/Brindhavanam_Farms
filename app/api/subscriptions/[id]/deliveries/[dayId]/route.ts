import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import SubscriptionDelivery from "@/models/SubscriptionDelivery";
import { requireAuth } from "@/lib/auth";
import { z } from "zod";

export const dynamic = "force-dynamic";

const updateSchema = z.object({
  status: z.enum(["Pending", "Out for Delivery", "Delivered", "Skipped"]),
  note: z.string().optional(),
});

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string; dayId: string } }
) {
  try {
    const authCheck = await requireAuth("admin")(req);
    if (authCheck.status !== 200) return authCheck;

    const body = await req.json();
    const data = updateSchema.parse(body);

    await connectDB();

    const delivery = await SubscriptionDelivery.findByIdAndUpdate(
      params.dayId,
      { $set: data },
      { new: true, runValidators: true }
    );

    if (!delivery) {
      return NextResponse.json({ error: "Delivery day not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Updated", delivery }, { status: 200 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues[0].message }, { status: 400 });
    }
    console.error("PUT delivery day error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
