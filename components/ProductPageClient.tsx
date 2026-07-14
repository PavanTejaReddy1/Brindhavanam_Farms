"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { motion } from "framer-motion";
import { Leaf, Clock, CheckCircle, XCircle } from "lucide-react";
import SubscriptionHeader from "@/components/SubscriptionHeader";
import ProductSelector from "@/components/ProductSelector";
import SubscriptionSelector from "@/components/SubscriptionSelector";
import OrderSummary from "@/components/OrderSummary";
import AnimatedPrice from "@/components/AnimatedPrice";
import { useOrder } from "@/context/OrderContext";
import { fetchWithAuth } from "@/lib/api";
import {
  calculateGrandTotal,
  getSubscriptionDays,
} from "@/lib/products";
import type { ProductDetail, SubscriptionPlanType } from "@/types/order";
import { usePolling } from "@/lib/hooks/usePolling";
import { useAuth } from "@/contexts/AuthContext";

interface ProductPageClientProps {
  productSlug: string;
}

export default function ProductPageClient({ productSlug }: ProductPageClientProps) {
  const router = useRouter();
  const { order, setProductSelection, updatePlan, updateQuantity } = useOrder();
  const [product, setProduct] = useState<ProductDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantityId, setQuantityId] = useState("");
  const [plan, setPlan] = useState<SubscriptionPlanType>("30");
  const [customDays, setCustomDays] = useState(30);
  const [orderType, setOrderType] = useState<"subscription" | "one-time">("subscription");
  const [oneTimeQuantity, setOneTimeQuantity] = useState(1);

  const { isAuthenticated } = useAuth();

  useEffect(() => {
    fetchProduct();
  }, [productSlug]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const data = await fetchWithAuth(`/api/products/slug/${productSlug}`);
      // Map MongoDB variants to quantities format
      const mongoProduct = data.product;
      const mappedProduct = {
        ...mongoProduct,
        quantities: mongoProduct.variants.map((v: any) => ({
          id: v.id,
          label: v.label,
          pricePerDay: v.pricePerDay,
        })),
        // Always calculate availability from stockStatus to ensure accuracy
        availability: mongoProduct.stock === 0 || mongoProduct.stockStatus === "out_of_stock" ? "Out of Stock" : "In Stock",
      };
      setProduct(mappedProduct);
    } catch (error) {
      console.error("Error fetching product from API:", error);
      setProduct(null);
    } finally {
      setLoading(false);
    }
  };

  // Use polling to auto-refresh product every 30 seconds
  usePolling(fetchProduct, { interval: 30000, immediate: false });

  // Initialize state when product loads
  useEffect(() => {
    if (!product) return;

    const defaultQty = product.quantities[0];
    const shouldUseOrderState = order.productSlug === product.slug;

    setQuantityId(shouldUseOrderState ? order.quantityId : defaultQty.id);
    setPlan(shouldUseOrderState ? order.plan : "30");
    setCustomDays(shouldUseOrderState ? order.customDays : 30);

    // Only set order type if not already set in order state
    if (!order.orderType) {
      const isDailyProduct = ["milk", "curd", "buttermilk"].includes(product.category?.toLowerCase() || "");
      setOrderType(isDailyProduct ? "subscription" : "one-time");
    }
  }, [product, order.productSlug, order.quantityId, order.plan, order.customDays, order.orderType]);

  const selectedQty = product?.quantities.find((q) => q.id === quantityId) ?? product?.quantities[0];
  const subscriptionDays = getSubscriptionDays(plan, customDays);
  const grandTotal = calculateGrandTotal(
    selectedQty?.pricePerDay || 0,
    subscriptionDays,
    product?.deliveryCharges || 0
  );

  const handleSubscribe = useCallback((e: React.MouseEvent) => {
      if (!isAuthenticated) {
        e.preventDefault();
        router.push("/login?redirect=/#products");

        return;
      }

    if (!product || !selectedQty) return;

    setProductSelection({
      productSlug: product.slug,
      productName: product.name,
      productImage: product.image,
      quantityId: selectedQty.id,
      quantityLabel: selectedQty.label,
      pricePerDay: selectedQty.pricePerDay,
      plan,
      customDays,
      deliveryCharges: product.deliveryCharges,
      deliveryWindow: "Daily Morning",
      orderType,
      subscriptionDays,
      grandTotal,
      oneTimeQuantity: orderType === "one-time" ? oneTimeQuantity : undefined,
    });
    router.push("/checkout");
  }, [product, selectedQty, quantityId, plan, customDays, orderType, oneTimeQuantity, subscriptionDays, grandTotal, setProductSelection, router]);

  useEffect(() => {
    if (!product) return;
    if (order.productSlug === product.slug) return;

    const defaultQty = product.quantities[0];
    setQuantityId(defaultQty.id);
    setPlan("30");
    setCustomDays(30);
    setOneTimeQuantity(1);

    // Reset order type based on product category when switching products
    const isDailyProduct = ["milk", "curd", "buttermilk"].includes(product.category?.toLowerCase() || "");
    setOrderType(isDailyProduct ? "subscription" : "one-time");
  }, [product, order.productSlug]);

  if (loading || !product) {
    return (
      <>
        <SubscriptionHeader />
        <div className="min-h-screen bg-[#F8F6F0] flex items-center justify-center">
          <p className="text-[#666]">Loading product...</p>
        </div>
      </>
    );
  }

  const isOutOfStock = (product.stockStatus === "out_of_stock" || product.stock === 0);

  const liveOrder = {
    ...order,
    productSlug: product.slug,
    productName: product.name,
    productImage: product.image,
    quantityId: selectedQty?.id || "",
    quantityLabel: selectedQty?.label || "",
    pricePerDay: selectedQty?.pricePerDay || 0,
    plan,
    customDays,
    subscriptionDays,
    deliveryCharges: orderType === "subscription" ? product.deliveryCharges : 30,
    deliveryWindow: "Daily Morning",
    grandTotal: orderType === "subscription" ? grandTotal : ((selectedQty?.pricePerDay || 0) * oneTimeQuantity) + 30,
    orderType,
    oneTimeQuantity: orderType === "one-time" ? oneTimeQuantity : undefined,
  };

  return (
    <>
      <SubscriptionHeader />
      <motion.main
        className="min-h-screen bg-[#F8F6F0] pb-28 lg:pb-16"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <div className="max-w-6xl mx-auto px-[5%] py-8 lg:py-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14">
            {/* Product Image */}
            <motion.div
              className="relative"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1, duration: 0.5 }}
            >
              <div className="sticky top-24 rounded-[32px] bg-white p-8 lg:p-12 shadow-[0_16px_48px_rgba(16,39,28,0.1)] flex items-center justify-center min-h-[320px] lg:min-h-[480px]">
                <motion.div
                  whileHover={{ scale: 1.04, rotate: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <Image
                    src={product.image}
                    alt={product.name}
                    width={400}
                    height={400}
                    className="object-contain max-h-[360px] w-auto rounded-xl"
                    priority
                  />
                </motion.div>
              </div>
            </motion.div>

            {/* Product Details */}
            <div className="space-y-8">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.15, duration: 0.5 }}
              >
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#D4AF37]/15 text-[#10271C] border border-[#D4AF37]/30 mb-4">
                  <Leaf className="w-3.5 h-3.5" />
                  {product.freshnessBadge}
                </span>
                <h1 className="font-serif text-3xl lg:text-4xl font-semibold text-[#10271C] mb-3">
                  {product.name}
                </h1>
                <p className="text-[#666] leading-relaxed mb-6">
                  {product.shortDescription}
                </p>

                <div className="flex flex-wrap gap-4 mb-2">
                  <MetaBadge
                    icon={product.availability === "Out of Stock" ? <XCircle className="w-4 h-4 text-red-600" /> : <CheckCircle className="w-4 h-4 text-[#25d366]" />}
                    label="Availability"
                    value={product.availability}
                  />
                  <MetaBadge
                    icon={<Clock className="w-4 h-4 text-[#D4AF37]" />}
                    label="Delivery"
                    value={product.deliveryTime}
                  />
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
              >
                {/* Order Type Toggle */}
                <div className="flex gap-2 mb-4">
                  <button
                    onClick={() => setOrderType("subscription")}
                    className={`flex-1 py-3 px-4 rounded-xl font-medium text-sm transition-all ${orderType === "subscription"
                        ? "bg-[#10271C] text-white"
                        : "bg-white text-[#666] border border-[#10271C]/20"
                      }`}
                  >
                    Subscription
                  </button>
                  <button
                    onClick={() => setOrderType("one-time")}
                    className={`flex-1 py-3 px-4 rounded-xl font-medium text-sm transition-all ${orderType === "one-time"
                        ? "bg-[#10271C] text-white"
                        : "bg-white text-[#666] border border-[#10271C]/20"
                      }`}
                  >
                    One-Time Order
                  </button>
                </div>

                <ProductSelector
                  quantities={product.quantities}
                  selectedId={quantityId}
                  onSelect={(option) => {
                    setQuantityId(option.id);
                  }}
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25, duration: 0.5 }}
              >
                {orderType === "subscription" ? (
                  <SubscriptionSelector
                    plan={plan}
                    customDays={customDays}
                    onPlanChange={(p) => {
                      setPlan(p);
                    }}
                    onCustomDaysChange={(days) => {
                      setCustomDays(days);
                    }}
                  />
                ) : (
                  /* One-Time Quantity Selector */
                  <div className="flex items-center justify-between p-4 rounded-xl bg-white border border-[#10271C]/10">
                    <span className="text-sm font-medium text-[#666]">Quantity</span>
                    <div className="flex items-center gap-4">
                      <button
                        onClick={() => setOneTimeQuantity(Math.max(1, oneTimeQuantity - 1))}
                        className="w-10 h-10 rounded-full bg-[#10271C]/5 flex items-center justify-center text-[#10271C] font-semibold hover:bg-[#10271C]/10 transition-colors"
                      >
                        -
                      </button>
                      <span className="text-xl font-semibold text-[#10271C] w-8 text-center">{oneTimeQuantity}</span>
                      <button
                        onClick={() => setOneTimeQuantity(oneTimeQuantity + 1)}
                        className="w-10 h-10 rounded-full bg-[#10271C]/5 flex items-center justify-center text-[#10271C] font-semibold hover:bg-[#10271C]/10 transition-colors"
                      >
                        +
                      </button>
                    </div>
                  </div>
                )}
              </motion.div>

              {/* Price Calculator */}
              <motion.div
                layout
                className="p-5 rounded-2xl bg-white border border-[#10271C]/10"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
              >
                <p className="text-sm font-medium text-[#666] mb-3">
                  Price Calculator
                </p>
                {orderType === "subscription" ? (
                  <div className="flex flex-wrap items-center justify-center gap-2 text-lg font-semibold text-[#10271C]">
                    <AnimatedPrice value={selectedQty?.pricePerDay || 0} />
                    <span className="text-[#666] font-normal">×</span>
                    <motion.span
                      key={subscriptionDays}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                    >
                      {subscriptionDays} Days
                    </motion.span>
                    <span className="text-[#666] font-normal">=</span>
                    <AnimatedPrice
                      value={grandTotal}
                      className="font-serif text-2xl text-[#10271C]"
                    />
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-[#666]">Price per unit</span>
                      <span className="font-semibold text-[#10271C]">₹{selectedQty?.pricePerDay || 0}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-[#666]">Quantity</span>
                      <span className="font-semibold text-[#10271C]">{oneTimeQuantity}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-[#666]">Subtotal</span>
                      <span className="font-semibold text-[#10271C]">₹{((selectedQty?.pricePerDay || 0) * oneTimeQuantity).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-[#666]">Delivery Charge</span>
                      <span className="font-semibold text-[#10271C]">₹30</span>
                    </div>
                    <div className="border-t border-[#10271C]/10 pt-2 mt-2">
                      <div className="flex justify-between text-lg">
                        <span className="font-semibold text-[#10271C]">Grand Total</span>
                        <span className="font-serif font-bold text-[#10271C]">₹{(((selectedQty?.pricePerDay || 0) * oneTimeQuantity) + 30).toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>

              {/* Summary - desktop inline, mobile above sticky button area */}
              <div className="hidden lg:block">
                <OrderSummary order={liveOrder} variant="compact" />
              </div>

              {isOutOfStock ? (
                <motion.button
                  type="button"
                  disabled
                  className="hidden lg:flex w-full py-4 rounded-2xl font-semibold text-gray-400 text-lg items-center justify-center gap-2 cursor-not-allowed bg-gray-200"
                >
                  Out of Stock
                </motion.button>
              ) : (
                <motion.button
                  type="button"
                  onClick={handleSubscribe}
                  className="hidden lg:flex w-full py-4 rounded-2xl font-semibold text-white text-lg items-center justify-center gap-2"
                  style={{ background: "#10271C" }}
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {orderType === "subscription" ? "Subscribe" : "Order Now"}
                  <span>→</span>
                </motion.button>
              )}
            </div>
          </div>

          {/* Mobile summary */}
          <div className="lg:hidden mt-8">
            <OrderSummary order={liveOrder} variant="compact" />
          </div>
        </div>
      </motion.main>

      {/* Sticky bottom Subscribe - mobile */}
      <motion.div
        className="lg:hidden fixed bottom-0 left-0 right-0 z-40 p-4 bg-[#F8F6F0]/95 backdrop-blur-xl border-t border-[#10271C]/10"
        initial={{ y: 80 }}
        animate={{ y: 0 }}
        transition={{ delay: 0.4, type: "spring", stiffness: 300, damping: 30 }}
      >
        <div className="flex items-center justify-between gap-4 mb-3 px-1">
          <div>
            <p className="text-xs text-[#666]">Total</p>
            <AnimatedPrice
              value={grandTotal}
              className="font-serif text-xl font-bold text-[#10271C]"
            />
          </div>
          <p className="text-xs text-[#666] text-right">
            {selectedQty?.label || ""} · {subscriptionDays} days
          </p>
        </div>
        {isOutOfStock ? (
          <motion.button
            type="button"
            disabled
            className="w-full py-3.5 rounded-2xl font-semibold text-gray-400 cursor-not-allowed bg-gray-200"
          >
            Out of Stock
          </motion.button>
        ) : (
          <motion.button
            type="button"
            onClick={handleSubscribe}
            className="w-full py-3.5 rounded-2xl font-semibold text-white"
            style={{ background: "#10271C" }}
            whileTap={{ scale: 0.98 }}
          >
            {orderType === "subscription" ? "Subscribe" : "Order Now"}
          </motion.button>
        )}
      </motion.div>
    </>
  );
}

function MetaBadge({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-2 px-4 py-3 rounded-xl bg-white border border-[#10271C]/8">
      {icon}
      <div>
        <p className="text-xs text-[#999]">{label}</p>
        <p className="text-sm font-medium text-[#10271C]">{value}</p>
      </div>
    </div>
  );
}
