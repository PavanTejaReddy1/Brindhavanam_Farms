import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Subscription from "@/models/Subscription";
import SubscriptionDelivery from "@/models/SubscriptionDelivery";
import { getUserFromToken } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const user = getUserFromToken(req);
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await connectDB();

    const subscriptions = await Subscription.find({ userId: user.userId })
      .sort({ createdAt: -1 })
      .lean();

    // Attach delivery days for each subscription
    const result = await Promise.all(
      subscriptions.map(async (sub: any) => {
        const deliveries = await SubscriptionDelivery.find({
          subscriptionId: sub._id,
        })
          .sort({ dayNumber: 1 })
          .select("deliveryDate dayNumber status note")
          .lean();

        return { ...sub, deliveries };
      })
    );

    return NextResponse.json({ subscriptions: result }, { status: 200 });
  } catch (error) {
    console.error("GET subscriptions/user error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
