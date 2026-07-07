import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Subscription from "@/models/Subscription";
import { requireAuth } from "@/lib/auth";
import { z } from "zod";

const updateSubscriptionSchema = z.object({
  status: z.enum(["Active", "Paused", "Cancelled", "Expired"]).optional(),
  nextDelivery: z.string().optional(),
  remainingDays: z.number().optional(),
});

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();

    const subscription = await Subscription.findById(params.id)
      .populate("userId", "name email phone")
      .populate("productId", "name price");

    if (!subscription) {
      return NextResponse.json(
        { error: "Subscription not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ subscription }, { status: 200 });
  } catch (error) {
    console.error("Get subscription error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const authCheck = await requireAuth("admin")(req);
    if (authCheck.status !== 200) return authCheck;

    const body = await req.json();
    const validatedData = updateSubscriptionSchema.parse(body);

    await connectDB();

    const subscription = await Subscription.findByIdAndUpdate(
      params.id,
      { $set: validatedData },
      { new: true, runValidators: true }
    );

    if (!subscription) {
      return NextResponse.json(
        { error: "Subscription not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Subscription updated successfully", subscription },
      { status: 200 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.issues[0].message },
        { status: 400 }
      );
    }

    console.error("Update subscription error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const authCheck = await requireAuth("admin")(req);
    if (authCheck.status !== 200) return authCheck;

    await connectDB();

    const subscription = await Subscription.findByIdAndDelete(params.id);

    if (!subscription) {
      return NextResponse.json(
        { error: "Subscription not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Subscription deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Delete subscription error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
