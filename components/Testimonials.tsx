"use client";

import { motion } from "framer-motion";
import SectionHeader from "../components/SectionHeader";
import { TESTIMONIALS } from "../lib/constants";

export default function Testimonials() {
  return (
    <section id="testimonials" className="py-24 px-[5%] bg-white">
      <SectionHeader
        eyebrow="What Families Say"
        title="Trusted by 2,000+ Homes"
      />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 stagger">
        {TESTIMONIALS.map((t) => (
          <motion.div
            key={t.name}
            className="reveal rounded-2xl p-8"
            style={{ background: "#F8F6F0" }}
            whileHover={{ y: -4, boxShadow: "0 12px 48px rgba(31,77,58,0.16)" }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            <div className="text-gold mb-4 tracking-widest" style={{ color: "#D4AF37" }}>
              {"★".repeat(t.rating)}
            </div>
            <p className="text-sm leading-relaxed italic mb-6" style={{ color: "#6b6b6b" }}>
              &ldquo;{t.text}&rdquo;
            </p>
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
                style={{
                  background: "linear-gradient(135deg,#1F4D3A,#6B8E23)",
                }}
              >
                {t.initials}
              </div>
              <div>
                <div className="text-sm font-semibold" style={{ color: "#1a1a1a" }}>
                  {t.name}
                </div>
                <div className="text-xs mt-0.5" style={{ color: "#9a9a9a" }}>
                  {t.location}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}