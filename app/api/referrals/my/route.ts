import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Referral from "@/models/Referral";
import User from "@/models/User";
import { getUserFromToken } from "@/lib/auth";

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

    // Get user's referral code and earnings
    const userData = await User.findById(user.userId).select("referralCode referralEarnings totalOrders lifetimeValue");
    
    // Get referral statistics
    const referrals = await Referral.find({ referrerId: user.userId });
    const totalReferrals = referrals.length;
    const successfulReferrals = referrals.filter((r: any) => r.status === "Successful").length;
    const totalEarnings = referrals.reduce((sum: number, r: any) => sum + (r.reward || 0), 0);

    return NextResponse.json({
      referralCode: userData?.referralCode || "",
      totalReferrals,
      successfulReferrals,
      totalEarnings,
      referralEarnings: userData?.referralEarnings || 0,
      totalOrders: userData?.totalOrders || 0,
      lifetimeValue: userData?.lifetimeValue || 0,
    }, { status: 200 });
  } catch (error) {
    console.error("Get my referral data error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
