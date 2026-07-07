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

    // Ensure availability is always correct based on stockStatus and stock
   const productsWithCorrectAvailability = products.map(product => ({
      ...product.toObject(),
      availability: (product.stock === 0 || product.stockStatus === "out_of_stock") ? "Out of Stock" : "In Stock",
    }));

    return NextResponse.json(
      { products: productsWithCorrectAvailability },
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
    console.log("Received product data:", body);
    
    const validatedData = productSchema.parse(body);
    console.log("Validated product data:", validatedData);

    await connectDB();

    const product = await Product.create(validatedData);
    console.log("Created product:", product);

    return NextResponse.json(
      { message: "Product created successfully", product },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error("Zod validation error:", error.issues);
      return NextResponse.json(
        { error: error.issues[0].message },
        { status: 400 }
      );
    }

    console.error("Create product error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal server error" },
      { status: 500 }
    );
  }
}
