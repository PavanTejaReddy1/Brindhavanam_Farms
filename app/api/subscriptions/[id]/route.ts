import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Subscription from "@/models/Subscription";
import SubscriptionDelivery from "@/models/SubscriptionDelivery";
import { requireAuth, getUserFromToken } from "@/lib/auth";
import { z } from "zod";

export const dynamic = "force-dynamic";

const updateSchema = z.object({
  status: z.enum(["Active", "Paused", "Cancelled", "Expired"]).optional(),
  nextDelivery: z.string().optional(),
  remainingDays: z.number().optional(),
});

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = getUserFromToken(req);
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await connectDB();

    const sub = await Subscription.findById(params.id).lean() as any;
    if (!sub) return NextResponse.json({ error: "Not found" }, { status: 404 });

    // Attach all delivery days
    const deliveries = await SubscriptionDelivery.find({ subscriptionId: params.id })
      .sort({ dayNumber: 1 })
      .lean();

    return NextResponse.json({ subscription: { ...sub, deliveries } }, { status: 200 });
  } catch (error) {
    console.error("GET subscription error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const authCheck = await requireAuth("admin")(req);
    if (authCheck.status !== 200) return authCheck;

    const body = await req.json();
    const data = updateSchema.parse(body);

    await connectDB();

    const sub = await Subscription.findByIdAndUpdate(
      params.id,
      { $set: data },
      { new: true, runValidators: true }
    );
    if (!sub) return NextResponse.json({ error: "Not found" }, { status: 404 });

    return NextResponse.json({ message: "Updated", subscription: sub }, { status: 200 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues[0].message }, { status: 400 });
    }
    console.error("PUT subscription error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const authCheck = await requireAuth("admin")(req);
    if (authCheck.status !== 200) return authCheck;

    await connectDB();

    const sub = await Subscription.findByIdAndDelete(params.id);
    if (!sub) return NextResponse.json({ error: "Not found" }, { status: 404 });

    // Also delete all delivery day records
    await SubscriptionDelivery.deleteMany({ subscriptionId: params.id });

    return NextResponse.json({ message: "Deleted" }, { status: 200 });
  } catch (error) {
    console.error("DELETE subscription error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
