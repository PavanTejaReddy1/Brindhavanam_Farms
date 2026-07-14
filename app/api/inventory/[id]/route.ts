import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Product from "@/models/Product";
import { requireAuth } from "@/lib/auth";

export const dynamic = 'force-dynamic';

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const authCheck = await requireAuth("admin")(req);
    if (authCheck.status !== 200) return authCheck;

    const body = await req.json();
    const { stock } = body;

    await connectDB();

    // Update stock in Product collection (single source of truth)
    const product = await Product.findById(params.id);
    
    if (!product) {
      return NextResponse.json(
        { error: "Product not found" },
        { status: 404 }
      );
    }

    product.stock = stock;
    
    // Manually update stockStatus and availability based on new stock
    if (stock === 0) {
      product.stockStatus = "out_of_stock";
      product.availability = "Out of Stock";
    } else if (stock < 10) {
      product.stockStatus = "low_stock";
      product.availability = "In Stock";
    } else {
      product.stockStatus = "in_stock";
      product.availability = "In Stock";
    }

    await product.save();

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

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const authCheck = await requireAuth("admin")(req);
    if (authCheck.status !== 200) return authCheck;

    await connectDB();

    // Note: We don't delete inventory items, we just update stock in Product
    // This endpoint is kept for compatibility but will return an error
    return NextResponse.json(
      { error: "Cannot delete inventory. Use Product management to update stock." },
      { status: 400 }
    );
  } catch (error) {
    console.error("Delete inventory error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
