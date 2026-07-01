import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Product from "@/models/Product";
import { getUserFromToken, requireAuth } from "@/lib/auth";
import { z } from "zod";

const productSchema = z.object({
  name: z.string().min(2, "Product name must be at least 2 characters"),
  slug: z.string().min(2, "Product slug is required"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  shortDescription: z.string().min(5, "Short description is required"),
  category: z.string().default("dairy"),
  image: z.string().default(""),
  galleryImages: z.array(z.string()).default([]),
  variants: z.array(z.object({
    id: z.string(),
    label: z.string(),
    pricePerDay: z.number(),
  })).min(1, "At least one variant is required"),
  stock: z.number().min(0, "Stock cannot be negative").default(100),
  stockStatus: z.enum(["in_stock", "out_of_stock", "low_stock"]).default("in_stock"),
  featured: z.boolean().default(false),
  active: z.boolean().default(true),
  freshnessBadge: z.string().default(""),
  availability: z.string().default("In Stock"),
  deliveryTime: z.string().default("Daily Morning · 5 AM – 7 AM"),
  deliveryCharges: z.number().default(0),
  displayPrice: z.string().default(""),
  sizes: z.array(z.string()).default([]),
});

export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const activeOnly = searchParams.get("active") === "true";

    const query = activeOnly ? { $or: [{ active: true }, { active: { $exists: false } }] } : {};
    const products = await Product.find(query).sort({ createdAt: -1 });

    return NextResponse.json(
      { products },
      { status: 200 }
    );
  } catch (error) {
    console.error("Get products error:", error);
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
    
    const validatedData = productSchema.parse(body);

    await connectDB();

    const product = await Product.create(validatedData);

    return NextResponse.json(
      { message: "Product created successfully", product },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.issues[0].message },
        { status: 400 }
      );
    }

    console.error("Create product error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
