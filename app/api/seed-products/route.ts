import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Product from "@/models/Product";

export async function POST() {
  try {
    await connectDB();
    
    // Delete all existing products to ensure clean state with correct schema
    await Product.deleteMany({});
    
    // Seed products with proper schema
    const products = await Product.insertMany([
      {
        name: "Glass Bottle Milk",
        slug: "glass-bottle-milk",
        description: "Our signature fresh cow's milk, delivered in premium reusable glass bottles. Collected at dawn, gently pasteurised, and at your doorstep before 7 AM.",
        shortDescription: "Farm-fresh cow's milk in premium reusable glass bottles.",
        category: "dairy",
        image: "/milk.png",
        galleryImages: [],
        variants: [
          { id: "250ml", label: "250ml", pricePerDay: 20 },
          { id: "500ml", label: "500ml", pricePerDay: 35 },
          { id: "1l", label: "1 Litre", pricePerDay: 65 },
        ],
        stock: 100,
        stockStatus: "in_stock",
        featured: true,
        active: true,
        freshnessBadge: "Delivered within 12 hours of milking",
        availability: "In Stock",
        deliveryTime: "Daily Morning · 5 AM – 7 AM",
        deliveryCharges: 0,
        displayPrice: "₹35 / 500ml",
        sizes: ["250 ml", "500 ml", "1 Litre"],
      },
      {
        name: "Fresh Curd",
        slug: "fresh-curd",
        description: "Set overnight from farm-fresh milk. Thick, creamy, no additives — the way curd should taste.",
        shortDescription: "Thick, creamy curd set overnight from farm-fresh milk.",
        category: "dairy",
        image: "/curd.png",
        galleryImages: [],
        variants: [
          { id: "250g", label: "250g", pricePerDay: 25 },
          { id: "500g", label: "500g", pricePerDay: 45 },
        ],
        stock: 100,
        stockStatus: "in_stock",
        featured: false,
        active: true,
        freshnessBadge: "Made fresh every evening",
        availability: "In Stock",
        deliveryTime: "Daily Morning · 5 AM – 7 AM",
        deliveryCharges: 0,
        displayPrice: "₹45 / 500g",
        sizes: ["250 g", "500 g"],
      },
      {
        name: "Artisan Paneer",
        slug: "paneer",
        description: "Soft, fresh-pressed paneer made daily from full-fat whole milk. Perfect for curries, grills, and everyday cooking.",
        shortDescription: "Soft, fresh-pressed paneer from full-fat whole milk.",
        category: "dairy",
        image: "/paneer.png",
        galleryImages: [],
        variants: [
          { id: "200g", label: "200g", pricePerDay: 120 },
          { id: "500g", label: "500g", pricePerDay: 280 },
        ],
        stock: 100,
        stockStatus: "in_stock",
        featured: false,
        active: true,
        freshnessBadge: "Made fresh every morning",
        availability: "In Stock",
        deliveryTime: "Daily Morning · 5 AM – 7 AM",
        deliveryCharges: 0,
        displayPrice: "₹120 / 200g",
        sizes: ["200 g", "500 g"],
      },
      {
        name: "Pure Desi Ghee",
        slug: "ghee",
        description: "Slow-churned, clarified butter made from cultured cream. Golden, aromatic, and pure — a staple for every Indian kitchen.",
        shortDescription: "Slow-churned golden ghee from cultured cream.",
        category: "dairy",
        image: "/ghee.png",
        galleryImages: [],
        variants: [
          { id: "250ml", label: "250ml", pricePerDay: 380 },
          { id: "500ml", label: "500ml", pricePerDay: 720 },
        ],
        stock: 100,
        stockStatus: "in_stock",
        featured: false,
        active: true,
        freshnessBadge: "Small-batch crafted weekly",
        availability: "In Stock",
        deliveryTime: "Daily Morning · 5 AM – 7 AM",
        deliveryCharges: 0,
        displayPrice: "₹380 / 250ml",
        sizes: ["250 ml", "500 ml"],
      },
      {
        name: "Spiced Buttermilk",
        slug: "buttermilk",
        description: "Freshly churned, lightly spiced buttermilk. Nature's best summer cooler — probiotic-rich and refreshing.",
        shortDescription: "Freshly churned, lightly spiced summer cooler.",
        category: "dairy",
        image: "/buttermilk.png",
        galleryImages: [],
        variants: [
          { id: "300ml", label: "300ml", pricePerDay: 25 },
          { id: "500ml", label: "500ml", pricePerDay: 40 },
        ],
        stock: 100,
        stockStatus: "in_stock",
        featured: false,
        active: true,
        freshnessBadge: "Churned fresh every morning",
        availability: "In Stock",
        deliveryTime: "Daily Morning · 5 AM – 7 AM",
        deliveryCharges: 0,
        displayPrice: "₹25 / 300ml",
        sizes: ["300 ml", "500 ml"],
      },
    ]);
    
    return NextResponse.json(
      { message: "Products seeded successfully", count: products.length },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error seeding products:", error);
    return NextResponse.json(
      { error: "Failed to seed products", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}
