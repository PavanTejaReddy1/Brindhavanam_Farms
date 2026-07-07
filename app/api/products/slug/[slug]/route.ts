import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Product from "@/models/Product";

export async function GET(
  req: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    await connectDB();

    if (!params.slug || params.slug === "undefined") {
      return NextResponse.json(
        { error: "Invalid product slug" },
        { status: 400 }
      );
    }

    const product = await Product.findOne({ slug: params.slug });

    if (!product) {
      return NextResponse.json(
        { error: "Product not found" },
        { status: 404 }
      );
    }

    // Ensure availability is always correct based on stockStatus and stock
    const productWithCorrectAvailability = {
      ...product.toObject(),
      availability: (product.stock === 0 || product.stockStatus === "out_of_stock") ? "Out of Stock" : "In Stock",
    };

    return NextResponse.json({ product: productWithCorrectAvailability }, { status: 200 });
  } catch (error) {
    console.error("Get product by slug error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
