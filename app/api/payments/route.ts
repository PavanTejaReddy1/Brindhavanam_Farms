import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Payment from "@/models/Payment";
import { getUserFromToken, requireAuth } from "@/lib/auth";

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const user = getUserFromToken(req);
    
    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    await connectDB();

    const { searchParams } = new URL(req.url);
    const isAdmin = user.role === "admin";

    let query: any = isAdmin ? {} : { userId: user.userId };
    const status = searchParams.get("status");
    if (status) {
      query = { ...query, status };
    }

    const payments = await Payment.find(query)
      .sort({ createdAt: -1 })
      .populate("orderId", "productName amount")
      .populate("userId", "name email");

    return NextResponse.json({ payments }, { status: 200 });
  } catch (error) {
    console.error("Get payments error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = getUserFromToken(req);
    
    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await req.json();

    await connectDB();

    const payment = await Payment.create({
      ...body,
      userId: user.userId,
    });

    return NextResponse.json(
      { message: "Payment created successfully", payment },
      { status: 201 }
    );
  } catch (error) {
    console.error("Create payment error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
