import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Subscription from "@/models/Subscription";
import SubscriptionDelivery from "@/models/SubscriptionDelivery";
import { getUserFromToken } from "@/lib/auth";
import { z } from "zod";
import mongoose, { Types } from "mongoose";

// ─── helper ──────────────────────────────────────────────────────────────────
function toObjectId(id?: string | null): Types.ObjectId | null {
  if (!id) return null;
  try { return new Types.ObjectId(id); } catch { return null; }
}

export const dynamic = "force-dynamic";

const createSchema = z.object({
  orderId:         z.string().optional(),
  customerName:    z.string().min(1),
  customerPhone:   z.string().min(10),
  customerEmail:   z.string().optional().default(""),
  customerAddress: z.string().min(1),
  productName:     z.string().min(1),
  quantity:        z.string().min(1),
  plan:            z.string().min(1),
  totalDays:       z.number().int().min(1),
  startDate:       z.string().min(1),   // ISO date string
  amount:          z.number().min(0).default(0),
});

// Helper — add N calendar days to a Date
function addDays(base: Date, n: number): Date {
  const d = new Date(base);
  d.setDate(d.getDate() + n);
  return d;
}

export async function GET(req: NextRequest) {
  try {
    const user = getUserFromToken(req);
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await connectDB();

    const { searchParams } = new URL(req.url);
    const isAdmin = user.role === "admin";
    const query: any = isAdmin ? {} : { userId: user.userId };
    const status = searchParams.get("status");
    if (status && status !== "All") query.status = status;

    const subscriptions = await Subscription.find(query)
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({ subscriptions }, { status: 200 });
  } catch (error) {
    console.error("GET subscriptions error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const body  = await req.json();
    const data  = createSchema.parse(body);
    const user  = getUserFromToken(req);

    const start   = new Date(data.startDate);
    start.setHours(0, 0, 0, 0);
    const endDate = addDays(start, data.totalDays - 1);
    const nextDelivery = start;

    // Create the subscription document
    const subscription = await Subscription.create({
      orderId:         toObjectId(data.orderId),
      userId:          toObjectId(user?.userId),
      customerName:    data.customerName,
      customerPhone:   data.customerPhone,
      customerEmail:   data.customerEmail,
      customerAddress: data.customerAddress,
      productName:     data.productName,
      quantity:        data.quantity,
      plan:            data.plan,
      totalDays:       data.totalDays,
      startDate:       start,
      endDate,
      nextDelivery,
      amount:          data.amount,
      remainingDays:   data.totalDays,
      status:          "Active" as const,
    } as any);

    // Generate one SubscriptionDelivery doc per day
    const deliveryDocs = Array.from({ length: data.totalDays }, (_, i) => ({
      subscriptionId:  subscription._id,
      userId:          toObjectId(user?.userId),
      customerName:    data.customerName,
      customerAddress: data.customerAddress,
      productName:     data.productName,
      quantity:        data.quantity,
      deliveryDate:    addDays(start, i),
      dayNumber:       i + 1,
      status:          "Pending" as const,
    }));

    await SubscriptionDelivery.insertMany(deliveryDocs);

    return NextResponse.json(
      { message: "Subscription created", subscription },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues[0].message }, { status: 400 });
    }
    console.error("POST subscriptions error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
