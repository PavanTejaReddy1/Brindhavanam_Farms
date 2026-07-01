"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { WHATSAPP_URL } from "../lib/constants";

export default function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

  return (
    <section
      ref={ref}
      id="home"
      data-nav-theme="dark"
      className="relative h-screen min-h-[640px] flex items-center overflow-hidden lg:items-center md:items-center"
    >
      {/* Background */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat lg:bg-center md:bg-center"
        style={{
          backgroundImage: "url('/hero-bg.png')",
        }}
      />
      <div
        className="absolute inset-0"
      />
      {/* Mobile overlay for better readability */}
      <div
        className="absolute inset-0 lg:hidden md:hidden"
        style={{
          background: "rgba(16,39,28,0.3)",
        }}
      />

      {/* Content */}
      <motion.div
        className="relative z-10 px-[5%] lg:pl-[120px]"
        style={{
          maxWidth: "620px",
        }}
      >
        {/* Badge */}
        <motion.div
          className="inline-flex items-center gap-2 mb-6 px-4 py-1.5 rounded-full text-xs font-semibold tracking-widest uppercase"
          style={{
            background: "rgba(212,175,55,0.18)",
            border: "1px solid rgba(212,175,55,0.4)",
            color: "#D4AF37",
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.1 }}
        >
          <span
            className="badge-dot w-1.5 h-1.5 rounded-full"
            style={{ background: "#D4AF37" }}
          />
          🌿 100% Organic · Farm Fresh
        </motion.div>

        <motion.h1
          className="font-serif text-5xl md:text-6xl lg:text-7xl font-semibold text-white leading-[1.08] mb-5 tracking-tight"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          Farm Fresh Milk,
          <br />
          Delivered Every{" "}
          <em style={{ color: "#D4AF37", fontStyle: "italic" }}>Morning.</em>
        </motion.h1>

        <motion.p
          className="text-base md:text-lg text-white/80 leading-relaxed mb-10 font-light max-w-lg"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          Freshly sourced from trusted local farms and delivered in eco-friendly
          glass bottles to your doorstep before sunrise.
        </motion.p>

        <motion.div
          className="flex flex-wrap gap-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full font-semibold text-sm transition-all duration-300 hover:-translate-y-0.5"
            style={{ background: "#25d366", color: "#fff" }}
          >
            💬 Order on WhatsApp
          </a>
          <a
            href="#products"
            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full font-medium text-sm text-white transition-all duration-300 hover:bg-white/12"
            style={{ border: "1.5px solid rgba(255,255,255,0.5)" }}
          >
            Explore Products →
          </a>
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
        <div className="scroll-arrow" />
        <span className="text-white/40 text-[0.6rem] tracking-[0.15em] uppercase">
          Scroll
        </span>
      </div>
    </section>
  );
}