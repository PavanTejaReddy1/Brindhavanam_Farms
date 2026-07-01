"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import SubscriptionHeader from "@/components/SubscriptionHeader";
import CheckoutForm from "@/components/CheckoutForm";
import OrderSummary from "@/components/OrderSummary";
import { useOrder } from "@/context/OrderContext";

export default function CheckoutPage() {
  const router = useRouter();
  const { order, hasProductSelection } = useOrder();

  useEffect(() => {
    if (!hasProductSelection) {
      router.replace("/#products");
    }
  }, [hasProductSelection, router]);

  if (!hasProductSelection) {
    return (
      <div className="min-h-screen bg-[#F8F6F0] flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
          className="w-8 h-8 border-2 border-[#10271C]/20 border-t-[#10271C] rounded-full"
        />
      </div>
    );
  }

  return (
    <>
      <SubscriptionHeader backHref="/#products" backLabel="Back to Products" />
      <motion.main
        className="min-h-screen bg-[#F8F6F0] pb-16"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <div className="max-w-6xl mx-auto px-[5%] py-8 lg:py-12">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-8"
          >
            <h1 className="font-serif text-3xl lg:text-4xl font-semibold text-[#10271C] mb-2">
              Checkout
            </h1>
            <p className="text-[#666]">
              Complete your details to confirm your subscription.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
            <div className="lg:col-span-3">
              <CheckoutForm />
            </div>
            <div className="hidden lg:block lg:col-span-2">
              <div className="sticky top-24">
                <OrderSummary order={order} variant="checkout" />
              </div>
            </div>
          </div>
        </div>
      </motion.main>
    </>
  );
}
