import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Referral from "@/models/Referral";
import { requireAuth } from "@/lib/auth";

export const dynamic = 'force-dynamic';

const updateReferralSchema = {
  status: ["Pending", "Successful", "Rejected"],
  reward: "number",
};

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const authCheck = await requireAuth("admin")(req);
    if (authCheck.status !== 200) return authCheck;

    const body = await req.json();

    await connectDB();

    const referral = await Referral.findByIdAndUpdate(
      params.id,
      { $set: body },
      { new: true, runValidators: true }
    );

    if (!referral) {
      return NextResponse.json(
        { error: "Referral not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Referral updated successfully", referral },
      { status: 200 }
    );
  } catch (error) {
    console.error("Update referral error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
