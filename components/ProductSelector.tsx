"use client";

import { motion } from "framer-motion";
import clsx from "clsx";
import AnimatedPrice from "./AnimatedPrice";
import type { QuantityOption } from "@/types/order";

interface ProductSelectorProps {
  quantities: QuantityOption[];
  selectedId: string;
  onSelect: (option: QuantityOption) => void;
}

export default function ProductSelector({
  quantities,
  selectedId,
  onSelect,
}: ProductSelectorProps) {
  return (
    <div>
      <h3 className="font-serif text-lg font-semibold text-[#10271C] mb-4">
        Select Quantity
      </h3>
      <div className="flex flex-col gap-3">
        {quantities.map((option) => {
          const selected = selectedId === option.id;
          return (
            <motion.label
              key={option.id}
              className={clsx(
                "flex items-center justify-between p-4 rounded-2xl border-2 cursor-pointer transition-colors",
                selected
                  ? "border-[#10271C] bg-[#10271C]/5"
                  : "border-[#10271C]/10 bg-white hover:border-[#D4AF37]/50 hover:shadow-md"
              )}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.99 }}
            >
              <div className="flex items-center gap-3">
                <input
                  type="radio"
                  name="quantity"
                  value={option.id}
                  checked={selected}
                  onChange={() => onSelect(option)}
                  className="w-4 h-4 accent-[#10271C]"
                />
                <span className="font-medium text-[#10271C]">{option.label}</span>
              </div>
              <span className="font-semibold text-[#10271C]">
                <AnimatedPrice value={option.pricePerDay} />
                <span className="text-sm font-normal text-[#666]"> / day</span>
              </span>
            </motion.label>
          );
        })}
      </div>
    </div>
  );
}
