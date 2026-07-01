"use client";

import { AnimatePresence, motion } from "framer-motion";

const LOGO_ASPECT = 898 / 281;

interface BrandLogoProps {
  variant: "light" | "dark";
  className?: string;
}

function LogoImage({ variant }: { variant: "light" | "dark" }) {
  const src = variant === "light" ? "/logo-light.svg" : "/logo-dark.svg";

  return (
    <img
      src={src}
      srcSet={`/logo-${variant}.png 1x, /logo-${variant}@2x.png 2x`}
      alt=""
      width={Math.round(64 * LOGO_ASPECT)}
      height={64}
      className="block h-10 md:h-12 lg:h-16 w-auto object-contain"
      draggable={false}
      aria-hidden
    />
  );
}

export default function BrandLogo({ variant, className = "" }: BrandLogoProps) {
  return (
    <div
      className={`relative h-10 md:h-12 lg:h-16 transition-transform duration-300 ease-out group-hover:scale-[1.03] ${className}`}
      style={{ aspectRatio: `${LOGO_ASPECT}` }}
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={variant}
          className="absolute inset-0 flex items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        >
          <LogoImage variant={variant} />
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

export function NavbarLogoLink({ theme }: { theme: "dark" | "light" }) {
  const variant = theme === "dark" ? "light" : "dark";

  return (
    <a
      href="#home"
      className="group flex-shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D4AF37]/60 focus-visible:ring-offset-2 rounded-sm"
      aria-label="Brindhavanam Farms — Home"
    >
      <BrandLogo variant={variant} />
    </a>
  );
}
