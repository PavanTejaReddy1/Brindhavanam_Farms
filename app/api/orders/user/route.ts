import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Order from "@/models/Order";
import { getUserFromToken } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const user = getUserFromToken(req);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const orders = await Order.find({ userId: user.userId })
      .sort({ createdAt: -1 })
      .select(
        "orderId productName quantity plan startDate orderType amount deliveryCharge status createdAt"
      );

    return NextResponse.json({ orders }, { status: 200 });
  } catch (error) {
    console.error("Get user orders error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
