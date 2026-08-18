import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import Admin from "@/models/Admin";
import OTP from "@/models/OTP";
import { sendOTPEmail, generateOTP } from "@/lib/email";
import { z } from "zod";

export const dynamic = "force-dynamic";

const schema = z.object({
  email: z.string().email("Invalid email address"),
  type: z.enum(["user", "admin"]).default("user"),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, type } = schema.parse(body);

    await connectDB();

    // Verify the account exists — return a clear error if not found
    let accountName: string | undefined;
    if (type === "admin") {
      const admin = await Admin.findOne({ email });
      if (!admin) {
        return NextResponse.json(
          { error: "No admin account found with this email address." },
          { status: 404 }
        );
      }
      accountName = admin.name;
    } else {
      const user = await User.findOne({ email });
      if (!user) {
        return NextResponse.json(
          { error: "No account found with this email address." },
          { status: 404 }
        );
      }
      accountName = user.name;
    }

    // Invalidate any existing unused OTPs for this email + type
    await OTP.updateMany(
      { email, type, used: false },
      { $set: { used: true } }
    );

    // Generate new OTP — valid for 10 minutes
    const otp = generateOTP();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    await OTP.create({ email, otp, type, expiresAt });

    // Send the email
    await sendOTPEmail(email, otp, accountName);

    return NextResponse.json(
      { message: "OTP sent successfully." },
      { status: 200 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.issues[0].message },
        { status: 400 }
      );
    }
    console.error("Forgot password error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
