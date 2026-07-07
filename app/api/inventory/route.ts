import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Product from "@/models/Product";
import { requireAuth } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    await connectDB();

    // Fetch inventory from Product collection (single source of truth)
    const products = await Product.find({ active: true })
      .select("name slug stock stockStatus variants category image")
      .sort({ createdAt: -1 });

    // Transform to inventory format for compatibility
    const inventory = products.map(product => ({
      productId: product._id,
      productName: product.name,
      slug: product.slug,
      stock: product.stock,
      stockStatus: product.stockStatus,
      category: product.category,
      image: product.image,
      variants: product.variants,
      lastUpdated: product.updatedAt,
    }));

    return NextResponse.json({ inventory }, { status: 200 });
  } catch (error) {
    console.error("Get inventory error:", error);
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
    const { productId, stock } = body;

    await connectDB();

    // Update stock in Product collection (single source of truth)
    const product = await Product.findByIdAndUpdate(
      productId,
      { stock },
      { new: true }
    );

    if (!product) {
      return NextResponse.json(
        { error: "Product not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { 
        message: "Inventory updated successfully", 
        inventory: {
          productId: product._id,
          productName: product.name,
          stock: product.stock,
          stockStatus: product.stockStatus,
          lastUpdated: product.updatedAt,
        }
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Update inventory error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
