import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Order from "@/models/Order";
import { getUserFromToken, requireAuth } from "@/lib/auth";
import { z } from "zod";

const orderSchema = z.object({
  productId: z.string(),
  productName: z.string(),
  quantity: z.string(),
  subscription: z.string().optional(),
  amount: z.number().positive(),
});

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

    let query = isAdmin ? {} : { userId: user.userId };
    const status = searchParams.get("status");
    if (status) {
      query = { ...query, status };
    }

    const orders = await Order.find(query)
      .sort({ createdAt: -1 })
      .populate("userId", "name email phone")
      .populate("productId", "name");

    return NextResponse.json({ orders }, { status: 200 });
  } catch (error) {
    console.error("Get orders error:", error);
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
    const validatedData = orderSchema.parse(body);

    await connectDB();

    const order = await Order.create({
      userId: user.userId,
      customerName: body.customerName,
      customerPhone: body.customerPhone,
      customerAddress: body.customerAddress,
      productId: validatedData.productId,
      productName: validatedData.productName,
      quantity: validatedData.quantity,
      subscription: validatedData.subscription || "None",
      amount: validatedData.amount,
    });

    return NextResponse.json(
      { message: "Order created successfully", order },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      );
    }

    console.error("Create order error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
