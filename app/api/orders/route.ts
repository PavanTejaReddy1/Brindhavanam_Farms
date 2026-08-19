import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Order from "@/models/Order";
import { getUserFromToken } from "@/lib/auth";
import { z } from "zod";

export const dynamic = "force-dynamic";

function generateOrderId(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // no ambiguous chars
  let suffix = "";
  for (let i = 0; i < 6; i++) {
    suffix += chars[Math.floor(Math.random() * chars.length)];
  }
  return `BRN-${suffix}`;
}

const createOrderSchema = z.object({
  customerName: z.string().min(1, "Customer name is required"),
  customerPhone: z.string().min(10, "Valid phone is required"),
  customerEmail: z.string().optional().default(""),
  customerAddress: z.string().min(1, "Address is required"),
  productName: z.string().min(1, "Product name is required"),
  quantity: z.string().min(1, "Quantity is required"),
  plan: z.string().optional().default(""),
  startDate: z.string().optional().default(""),
  orderType: z.enum(["subscription", "one-time"]).default("subscription"),
  amount: z.number().positive("Amount must be positive"),
  deliveryCharge: z.number().min(0).default(0),
  subtotal: z.number().min(0).default(0),
  productId: z.string().optional(),
});

export async function GET(req: NextRequest) {
  try {
    const user = getUserFromToken(req);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const { searchParams } = new URL(req.url);
    const isAdmin = user.role === "admin";

    let query: any = isAdmin ? {} : { userId: user.userId };
    const status = searchParams.get("status");
    if (status && status !== "All") query.status = status;

    const orders = await Order.find(query)
      .sort({ createdAt: -1 })
      .populate("userId", "name email phone")
      .populate("productId", "name");

    return NextResponse.json({ orders }, { status: 200 });
  } catch (error) {
    console.error("Get orders error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const body = await req.json();
    const data = createOrderSchema.parse(body);

    // Detect logged-in user from token (optional — guests can order too)
    const user = getUserFromToken(req);

    // Generate a collision-safe order ID
    let orderId = generateOrderId();
    let attempts = 0;
    while (attempts < 5) {
      const existing = await Order.findOne({ orderId });
      if (!existing) break;
      orderId = generateOrderId();
      attempts++;
    }

    const subtotal = data.subtotal || data.amount - data.deliveryCharge;

    const order = await Order.create({
      orderId,
      userId: user?.userId ? new (require("mongoose").Types.ObjectId)(user.userId) : null,
      customerName: data.customerName,
      customerPhone: data.customerPhone,
      customerEmail: data.customerEmail,
      customerAddress: data.customerAddress,
      productName: data.productName,
      quantity: data.quantity,
      plan: data.plan,
      startDate: data.startDate,
      orderType: data.orderType,
      amount: data.amount,
      deliveryCharge: data.deliveryCharge,
      subtotal,
      productId: data.productId ? new (require("mongoose").Types.ObjectId)(data.productId) : null,
      status: "Pending",
    });

    return NextResponse.json(
      { message: "Order created successfully", order, orderId },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues[0].message }, { status: 400 });
    }
    console.error("Create order error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
