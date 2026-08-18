import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import Admin from "@/models/Admin";
import OTP from "@/models/OTP";
import { hashPassword } from "@/lib/password";
import { z } from "zod";

export const dynamic = "force-dynamic";

const schema = z.object({
  email: z.string().email("Invalid email address"),
  otp: z.string().length(6, "OTP must be 6 digits"),
  newPassword: z.string().min(6, "Password must be at least 6 characters"),
  type: z.enum(["user", "admin"]).default("user"),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, otp, newPassword, type } = schema.parse(body);

    await connectDB();

    // Find the most recent unused, non-expired OTP
    const otpRecord = await OTP.findOne({
      email,
      type,
      used: false,
      expiresAt: { $gt: new Date() },
    }).sort({ createdAt: -1 });

    if (!otpRecord) {
      return NextResponse.json(
        { error: "Invalid or expired OTP. Please request a new one." },
        { status: 400 }
      );
    }

    if (otpRecord.otp !== otp) {
      return NextResponse.json(
        { error: "Incorrect OTP. Please try again." },
        { status: 400 }
      );
    }

    // Mark OTP as used
    otpRecord.used = true;
    await otpRecord.save();

    // Hash and update the password
    const hashedPassword = await hashPassword(newPassword);

    if (type === "admin") {
      const admin = await Admin.findOne({ email });
      if (!admin) {
        return NextResponse.json({ error: "Account not found." }, { status: 404 });
      }
      admin.password = hashedPassword;
      await admin.save();
    } else {
      const user = await User.findOne({ email });
      if (!user) {
        return NextResponse.json({ error: "Account not found." }, { status: 404 });
      }
      user.password = hashedPassword;
      await user.save();
    }

    return NextResponse.json(
      { message: "Password reset successfully. You can now log in." },
      { status: 200 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.issues[0].message },
        { status: 400 }
      );
    }
    console.error("Verify OTP error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
