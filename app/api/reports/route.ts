import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Order from "@/models/Order";
import User from "@/models/User";
import Subscription from "@/models/Subscription";
import Referral from "@/models/Referral";
import Payment from "@/models/Payment";
import { requireAuth } from "@/lib/auth";

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const authCheck = await requireAuth("admin")(req);
    if (authCheck.status !== 200) return authCheck;

    await connectDB();

    const { searchParams } = new URL(req.url);
    const reportType = searchParams.get("type") || "sales";
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");

    const dateFilter: any = {};
    if (startDate && endDate) {
      dateFilter.createdAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    }

    let data;

    switch (reportType) {
      case "sales":
        data = await Order.find(dateFilter)
          .sort({ createdAt: -1 })
          .populate("userId", "name");
        break;
      case "customers":
        data = await User.find(dateFilter)
          .sort({ createdAt: -1 })
          .select("name email phone referralEarnings totalOrders lifetimeValue createdAt");
        break;
      case "referrals":
        data = await Referral.find(dateFilter)
          .sort({ createdAt: -1 })
          .populate("referrerId", "name")
          .populate("refereeId", "name");
        break;
      case "revenue":
        data = await Payment.find({ ...dateFilter, status: "Successful" })
          .sort({ createdAt: -1 })
          .populate("userId", "name");
        break;
      case "subscriptions":
        data = await Subscription.find(dateFilter)
          .sort({ createdAt: -1 })
          .populate("userId", "name")
          .populate("productId", "name");
        break;
      default:
        data = await Order.find(dateFilter).sort({ createdAt: -1 });
    }

    return NextResponse.json({ data, type: reportType }, { status: 200 });
  } catch (error) {
    console.error("Get reports error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
