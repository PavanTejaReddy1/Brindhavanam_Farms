"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import SectionHeader from "./SectionHeader";
import { useState, useEffect } from "react";
import { usePolling } from "@/lib/hooks/usePolling";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";

interface Product {
  _id: string;
  name: string;
  slug: string;
  image: string;
  description: string;
  sizes: string[];
  displayPrice: string;
  stock: number;
  stockStatus: string;
  active: boolean;
  featured: boolean;
}

export default function Products() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  const { isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch("/api/products");
      const data = await response.json();
      setProducts(data.products || []);
    } catch (error) {
      console.error("Error fetching products:", error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  // Use polling to auto-refresh products every 30 seconds
  usePolling(fetchProducts, { interval: 30000, immediate: false });

  if (loading) {
    return (
      <section id="products" className="py-24 px-[5%] bg-cream">
        <SectionHeader
          eyebrow="Our Products"
          title="From Farm to Your Table"
          subtitle="A carefully curated range of dairy, crafted with care and delivered fresh every morning."
        />
        <div className="flex items-center justify-center py-20">
          <p className="text-gray-500">Loading products...</p>
        </div>
      </section>
    );
  }

  const handleOrderClick = (e: React.MouseEvent) => {
    if (!isAuthenticated) {
      e.preventDefault();
      router.push("/login?redirect=/#products");
    }
  };

  return (
    <section id="products" className="py-24 px-[5%] bg-cream">
      <SectionHeader
        eyebrow="Our Products"
        title="From Farm to Your Table"
        subtitle="A carefully curated range of dairy, crafted with care and delivered fresh every morning."
      />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products
          .sort((a, b) => {
            // Featured products first
            if (a.featured && !b.featured) return -1;
            if (!a.featured && b.featured) return 1;
            return 0;
          })
          .map((product, index) => (
            <motion.div
              key={product._id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.12, ease: [0.25, 0.46, 0.45, 0.94] }}
              whileHover={{ y: -8, scale: 1.02, transition: { duration: 0.3, ease: "easeOut" } }}
            >
              <div
                className="rounded-[28px] p-6 h-full relative"
                style={{
                  background: "#FFFFFF",
                  boxShadow: "0 12px 40px rgba(0,0,0,.08)",
                }}
              >
                {product.stockStatus === "out_of_stock" && (
                  <div className="absolute top-4 right-4 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full z-10">
                    Out of Stock
                  </div>
                )}

                <div className="product-image relative h-[200px] flex items-center justify-center pt-6 px-6 mb-4">
                  <motion.div
                    whileHover={{ scale: 1.06, rotate: 2 }}
                    transition={{ duration: 0.5 }}
                    className="w-full h-full flex items-center justify-center"
                  >
                    <Link href={"/products/" + product.slug}>
                      <Image
                        src={product.image}
                        alt={product.name}
                        width={280}
                        height={220}
                        className="object-contain rounded-xl cursor-pointer"
                        loading="lazy"
                      />
                    </Link>
                  </motion.div>
                </div>

                <h3
                  className="font-semibold text-lg mb-2"
                  style={{
                    color: "#0F291D",
                    fontWeight: 500,
                  }}
                >
                  {product.name}
                </h3>

                <p
                  className="text-sm leading-relaxed mb-4"
                  style={{
                    color: "#666666",
                    lineHeight: "1.6",
                  }}
                >
                  {product.description}
                </p>

                <div className="flex flex-wrap gap-2 mb-4">
                  {product.sizes.map((size) => (
                    <span
                      key={size}
                      className="text-xs font-medium px-3 py-1 rounded-full"
                      style={{
                        background: "rgba(15,41,29,0.08)",
                        border: "1px solid rgba(15,41,29,0.15)",
                        color: "#0F291D",
                      }}
                    >
                      {size}
                    </span>
                  ))}
                </div>

                <div className="flex items-center justify-between">
                  <span
                    className="font-bold text-xl"
                    style={{
                      color: "#0F291D",
                    }}
                  >
                    {product.displayPrice}
                  </span>
                  {(product.stockStatus === "out_of_stock" || product.stock === 0) ? (
                    <span
                      className="text-sm font-semibold px-5 py-2.5 rounded-full"
                      style={{
                        background: "#ccc",
                        color: "#666",
                        cursor: "not-allowed",
                      }}
                    >
                      Out of Stock
                    </span>
                  ) : (
                    <Link href={"/products/" + product.slug} onClick={handleOrderClick}>
                      <motion.span
                        className="text-sm font-semibold px-5 py-2.5 rounded-full transition-all flex items-center gap-2 cursor-pointer"
                        style={{
                          background: "#0F291D",
                          color: "#FFFFFF",
                        }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        Order{" "}
                        <motion.span
                          whileHover={{ x: 4 }}
                          transition={{ duration: 0.2 }}
                        >
                          {"->"}
                        </motion.span>
                      </motion.span>
                    </Link>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
      </div>
    </section>
  );
}
