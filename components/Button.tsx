"use client";

import { motion } from "framer-motion";
import clsx from "clsx";

interface ButtonProps {
  children: React.ReactNode;
  href?: string;
  onClick?: () => void;
  variant?: "primary" | "ghost" | "whatsapp" | "outline";
  className?: string;
  target?: string;
}

export default function Button({
  children,
  href,
  onClick,
  variant = "primary",
  className,
  target,
}: ButtonProps) {
  const base =
    "inline-flex items-center gap-2 px-6 py-3 rounded-full font-semibold text-sm transition-all duration-300 cursor-pointer";

  const variants = {
    primary:
      "bg-gold text-[#163728] hover:bg-gold-light hover:shadow-[0_8px_32px_rgba(212,175,55,0.4)] hover:-translate-y-0.5",
    ghost:
      "border border-white/50 text-white backdrop-blur-sm hover:bg-white/12 hover:border-white/80",
    whatsapp:
      "text-white hover:-translate-y-0.5 hover:shadow-lg",
    outline:
      "border border-green text-green hover:bg-green hover:text-white",
  };

  const waStyle =
    variant === "whatsapp" ? { background: "#25d366" } : undefined;

  const Comp = motion.a;
  const MotionButton = motion.button;

  if (href) {
    return (
      <Comp
        href={href}
        target={target}
        rel={target === "_blank" ? "noopener noreferrer" : undefined}
        className={clsx(base, variants[variant], className)}
        style={waStyle}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.97 }}
      >
        {children}
      </Comp>
    );
  }

  return (
    <MotionButton
      onClick={onClick}
      className={clsx(base, variants[variant], className)}
      style={waStyle}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.97 }}
    >
      {children}
    </MotionButton>
  );
}