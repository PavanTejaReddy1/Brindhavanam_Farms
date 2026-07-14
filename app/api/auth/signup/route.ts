import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import { hashPassword } from "@/lib/password";
import { signToken } from "@/lib/jwt";
import { z } from "zod";

export const dynamic = 'force-dynamic';

const signupSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  address: z.string().min(10, "Address must be at least 10 characters"),
  referralCode: z.string().optional(),
  confirmPassword: z.string().optional(),
});

export async function POST(req: NextRequest) {
  try {
    console.log("Signup request received");
    const body = await req.json();
    console.log("Request body:", body);
    
    // Validate input
    const validatedData = signupSchema.parse(body);
    console.log("Validation passed:", validatedData);

    console.log("Connecting to database...");
    await connectDB();
    console.log("Database connected");

    // Check if user already exists
    console.log("Checking for existing user with email:", validatedData.email);
    const existingUser = await User.findOne({ email: validatedData.email });
    if (existingUser) {
      console.log("User already exists with email");
      return NextResponse.json(
        { error: "User with this email already exists" },
        { status: 400 }
      );
    }

    console.log("Checking for existing user with phone:", validatedData.phone);
    const existingPhone = await User.findOne({ phone: validatedData.phone });
    if (existingPhone) {
      console.log("User already exists with phone");
      return NextResponse.json(
        { error: "User with this phone number already exists" },
        { status: 400 }
      );
    }

    // Generate unique referral code
    console.log("Generating referral code");
    const referralCode = validatedData.name.toUpperCase().replace(/\s/g, "") + Date.now().toString().slice(-6);
    console.log("Referral code generated:", referralCode);

    // Hash password
    console.log("Hashing password");
    const hashedPassword = await hashPassword(validatedData.password);
    console.log("Password hashed");

    // Check referral code if provided
    let referredBy = null;
    if (validatedData.referralCode) {
      console.log("Checking referral code:", validatedData.referralCode);
      const referrer = await User.findOne({ referralCode: validatedData.referralCode });
      if (referrer) {
        referredBy = referrer._id;
        console.log("Referrer found");
      } else {
        console.log("Referrer not found");
      }
    }

    // Create user
    console.log("Creating user");
    const userData: any = {
      name: validatedData.name,
      email: validatedData.email,
      phone: validatedData.phone,
      password: hashedPassword,
      address: validatedData.address,
      referralCode,
    };
    
    if (referredBy) {
      userData.referredBy = referredBy;
    }
    
    const user = await User.create(userData);
    console.log("User created:", user._id);

    // Generate token
    console.log("Generating token");
    const token = signToken({
      userId: user._id.toString(),
      email: user.email,
      role: "user",
    });
    console.log("Token generated");

    return NextResponse.json(
      {
        message: "User created successfully",
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          address: user.address,
          referralCode: user.referralCode,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error("Validation error:", error.issues);
      return NextResponse.json(
        { error: error.issues[0].message },
        { status: 400 }
      );
    }

    console.error("Signup error:", error);
    console.error("Error details:", error instanceof Error ? error.message : "Unknown error");
    console.error("Error stack:", error instanceof Error ? error.stack : "No stack trace");
    
    return NextResponse.json(
      { error: "Internal server error", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}
