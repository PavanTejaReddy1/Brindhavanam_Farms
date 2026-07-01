"use client";

import { motion } from "framer-motion";

interface AnimatedPriceProps {
  value: number;
  className?: string;
}

export default function AnimatedPrice({ value, className }: AnimatedPriceProps) {
  return (
    <motion.span
      key={value}
      className={className}
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
    >
      ₹{value.toLocaleString("en-IN")}
    </motion.span>
  );
}
