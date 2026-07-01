"use client";

import { motion, AnimatePresence } from "framer-motion";
import clsx from "clsx";
import type { SubscriptionPlanType } from "@/types/order";

const PLANS: { id: SubscriptionPlanType; label: string; subtitle: string }[] = [
  { id: "15", label: "15 Days", subtitle: "Perfect to try us out" },
  { id: "30", label: "30 Days", subtitle: "Most popular plan" },
  { id: "custom", label: "Custom", subtitle: "Choose your own duration" },
];

interface SubscriptionSelectorProps {
  plan: SubscriptionPlanType;
  customDays: number;
  onPlanChange: (plan: SubscriptionPlanType) => void;
  onCustomDaysChange: (days: number) => void;
}

export default function SubscriptionSelector({
  plan,
  customDays,
  onPlanChange,
  onCustomDaysChange,
}: SubscriptionSelectorProps) {
  return (
    <div>
      <h3 className="font-serif text-lg font-semibold text-[#10271C] mb-4">
        Subscription Plan
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {PLANS.map((item) => {
          const selected = plan === item.id;
          return (
            <motion.button
              key={item.id}
              type="button"
              onClick={() => onPlanChange(item.id)}
              className={clsx(
                "relative p-4 rounded-2xl border-2 text-left transition-colors",
                selected
                  ? "border-[#D4AF37] bg-[#D4AF37]/10 shadow-md"
                  : "border-[#10271C]/10 bg-white hover:border-[#D4AF37]/40 hover:shadow-md"
              )}
              whileHover={{ y: -3 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex items-start gap-2">
                <span
                  className={clsx(
                    "mt-0.5 w-4 h-4 rounded-full border-2 flex-shrink-0",
                    selected
                      ? "border-[#10271C] bg-[#10271C]"
                      : "border-[#10271C]/30"
                  )}
                />
                <div>
                  <p className="font-semibold text-[#10271C]">{item.label}</p>
                  <p className="text-xs text-[#666] mt-0.5">{item.subtitle}</p>
                </div>
              </div>
            </motion.button>
          );
        })}
      </div>

      <AnimatePresence>
        {plan === "custom" && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="mt-4 p-4 rounded-2xl bg-[#F8F6F0] border border-[#10271C]/10">
              <label
                htmlFor="custom-days"
                className="block text-sm font-medium text-[#10271C] mb-2"
              >
                Delivery Days
              </label>
              <input
                id="custom-days"
                type="number"
                min={1}
                max={365}
                value={customDays}
                onChange={(e) => {
                  const val = parseInt(e.target.value, 10);
                  if (!isNaN(val)) {
                    onCustomDaysChange(Math.min(365, Math.max(1, val)));
                  }
                }}
                className="w-full px-4 py-3 rounded-xl border border-[#10271C]/15 bg-white text-[#10271C] focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/50"
              />
              <p className="text-xs text-[#666] mt-2">Minimum 1 · Maximum 365 days</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
