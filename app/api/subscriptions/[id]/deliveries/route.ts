import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import SubscriptionDelivery from "@/models/SubscriptionDelivery";
import { getUserFromToken } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = getUserFromToken(req);
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await connectDB();

    const deliveries = await SubscriptionDelivery.find({ subscriptionId: params.id })
      .sort({ dayNumber: 1 })
      .lean();

    return NextResponse.json({ deliveries }, { status: 200 });
  } catch (error) {
    console.error("GET deliveries error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
