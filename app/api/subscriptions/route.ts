import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Subscription from "@/models/Subscription";
import { getUserFromToken, requireAuth } from "@/lib/auth";
import { z } from "zod";

const subscriptionSchema = z.object({
  productId: z.string(),
  productName: z.string(),
  quantity: z.string(),
  plan: z.enum(["Daily", "Weekly", "Monthly"]),
  startDate: z.string(),
  nextDelivery: z.string(),
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

    let query: any = isAdmin ? {} : { userId: user.userId };
    const status = searchParams.get("status");
    if (status) {
      query = { ...query, status };
    }

    const subscriptions = await Subscription.find(query)
      .sort({ createdAt: -1 })
      .populate("userId", "name email phone")
      .populate("productId", "name");

    return NextResponse.json({ subscriptions }, { status: 200 });
  } catch (error) {
    console.error("Get subscriptions error:", error);
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
    const validatedData = subscriptionSchema.parse(body);

    await connectDB();

    const subscription = await Subscription.create({
      userId: user.userId,
      productId: validatedData.productId,
      productName: validatedData.productName,
      quantity: validatedData.quantity,
      plan: validatedData.plan,
      startDate: new Date(validatedData.startDate),
      nextDelivery: new Date(validatedData.nextDelivery),
    });

    return NextResponse.json(
      { message: "Subscription created successfully", subscription },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.issues[0].message },
        { status: 400 }
      );
    }

    console.error("Create subscription error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
