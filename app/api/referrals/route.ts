import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Referral from "@/models/Referral";
import { getUserFromToken, requireAuth } from "@/lib/auth";

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

    let query: any = isAdmin ? {} : { $or: [{ referrerId: user.userId }, { refereeId: user.userId }] };
    const status = searchParams.get("status");
    if (status) {
      query = { ...query, status };
    }

    const referrals = await Referral.find(query)
      .sort({ createdAt: -1 })
      .populate("referrerId", "name email")
      .populate("refereeId", "name email");

    return NextResponse.json({ referrals }, { status: 200 });
  } catch (error) {
    console.error("Get referrals error:", error);
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

    const referral = await Referral.create(body);

    return NextResponse.json(
      { message: "Referral created successfully", referral },
      { status: 201 }
    );
  } catch (error) {
    console.error("Create referral error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
