import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Delivery from "@/models/Delivery";
import { requireAuth } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const authCheck = await requireAuth("admin")(req);
    if (authCheck.status !== 200) return authCheck;

    await connectDB();

    const { searchParams } = new URL(req.url);
    const date = searchParams.get("date");
    const status = searchParams.get("status");

    const query: any = {};
    if (status) {
      query.status = status;
    }
    if (date) {
      query.date = new Date(date);
    }

    const deliveries = await Delivery.find(query)
      .sort({ date: -1 })
      .populate("customerId", "name phone address")
      .populate("orderId", "productName");

    return NextResponse.json({ deliveries }, { status: 200 });
  } catch (error) {
    console.error("Get deliveries error:", error);
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

    const delivery = await Delivery.create(body);

    return NextResponse.json(
      { message: "Delivery created successfully", delivery },
      { status: 201 }
    );
  } catch (error) {
    console.error("Create delivery error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
