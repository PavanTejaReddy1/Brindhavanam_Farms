"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import BrandLogo from "./BrandLogo";

interface SubscriptionHeaderProps {
  backHref?: string;
  backLabel?: string;
}

export default function SubscriptionHeader({
  backHref = "/#products",
  backLabel = "Back to Products",
}: SubscriptionHeaderProps) {
  return (
    <motion.header
      className="sticky top-0 z-50 bg-[#F8F6F0]/95 backdrop-blur-xl border-b border-[#10271C]/8"
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <div className="max-w-6xl mx-auto px-[5%] py-4 flex items-center justify-between">
        <Link
          href="/"
          className="group flex-shrink-0"
          aria-label="Brindhavanam Farms — Home"
        >
          <BrandLogo variant="dark" />
        </Link>
        <Link
          href={backHref}
          className="flex items-center gap-2 text-sm font-medium text-[#10271C]/70 hover:text-[#10271C] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          {backLabel}
        </Link>
      </div>
    </motion.header>
  );
}
