"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import AnimatedPrice from "./AnimatedPrice";
import { formatCurrency, formatPlanLabel } from "@/lib/products";
import type { OrderState } from "@/types/order";

interface OrderSummaryProps {
  order: OrderState;
  variant?: "compact" | "checkout";
  showDeliveryCharges?: boolean;
}

export default function OrderSummary({
  order,
  variant = "compact",
  showDeliveryCharges = true,
}: OrderSummaryProps) {
  const planLabel = formatPlanLabel(order.plan, order.subscriptionDays);

  return (
    <motion.div
      layout
      className="rounded-3xl border border-[#10271C]/10 bg-white p-6 shadow-[0_8px_32px_rgba(16,39,28,0.08)]"
      whileHover={{ y: variant === "compact" ? -4 : 0 }}
      transition={{ duration: 0.3 }}
    >
      {variant === "checkout" && order.productImage && (
        <div className="flex items-center gap-4 mb-6 pb-6 border-b border-[#10271C]/10">
          <div className="relative w-20 h-20 rounded-2xl bg-[#F8F6F0] flex items-center justify-center overflow-hidden">
            <Image
              src={order.productImage}
              alt={order.productName}
              width={80}
              height={80}
              className="object-cover rounded"
            />
          </div>
          <div>
            <h3 className="font-serif text-lg font-semibold text-[#10271C]">
              {order.productName}
            </h3>
            <p className="text-sm text-[#666]">{order.quantityLabel}</p>
          </div>
        </div>
      )}

      <h3
        className={`font-serif font-semibold text-[#10271C] ${
          variant === "checkout" ? "text-base mb-4" : "text-lg mb-4"
        }`}
      >
        {variant === "checkout" ? "Order Summary" : "Summary"}
      </h3>

      <div className="space-y-3 text-sm">
        {variant === "compact" && (
          <SummaryRow label="Product" value={order.productName} />
        )}
        <SummaryRow label="Quantity" value={order.quantityLabel} />
        <SummaryRow
          label="Price per Day"
          value={
            <AnimatedPrice value={order.pricePerDay} className="font-semibold" />
          }
        />
        <SummaryRow label="Plan" value={planLabel} />
        {showDeliveryCharges && (
          <SummaryRow
            label="Delivery Charges"
            value={
              order.deliveryCharges === 0
                ? "Free"
                : formatCurrency(order.deliveryCharges)
            }
          />
        )}
        <SummaryRow label="Delivery" value={order.deliveryWindow} />
      </div>

      {variant === "compact" && (
        <motion.div
          layout
          className="mt-6 pt-4 border-t border-[#10271C]/10"
        >
          <div className="flex items-center justify-center gap-2 text-[#666] text-sm mb-2">
            <AnimatedPrice value={order.pricePerDay} />
            <span>×</span>
            <motion.span
              key={order.subscriptionDays}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              {order.subscriptionDays} Days
            </motion.span>
            <span>=</span>
          </div>
        </motion.div>
      )}

      <motion.div
        layout
        className="mt-4 pt-4 border-t border-[#10271C]/10 flex items-center justify-between"
      >
        <span className="font-medium text-[#10271C]">Grand Total</span>
        <span className="font-serif text-2xl font-bold text-[#10271C]">
          <AnimatedPrice value={order.grandTotal} />
        </span>
      </motion.div>
    </motion.div>
  );
}

function SummaryRow({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) {
  return (
    <motion.div layout className="flex items-center justify-between gap-4">
      <span className="text-[#666]">{label}</span>
      <span className="font-medium text-[#10271C] text-right">{value}</span>
    </motion.div>
  );
}
