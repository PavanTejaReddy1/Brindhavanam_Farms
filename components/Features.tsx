"use client";

import { motion } from "framer-motion";
import SectionHeader from "../components/SectionHeader";
import { FEATURES } from "../lib/constants";

export default function Features() {
  return (
    <section id="features" className="py-24 px-[5%] bg-cream">
      <SectionHeader
        eyebrow="Why Brindhavanam"
        title="Pure. Simple. Responsible."
        subtitle="We've rethought every step of dairy delivery to bring you something truly exceptional."
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 stagger">
        {FEATURES.map((feat, i) => (
          <motion.div
            key={feat.title}
            className="reveal bg-white rounded-2xl p-8 shadow-card relative overflow-hidden group cursor-default"
            whileHover={{ y: -6, boxShadow: "0 12px 48px rgba(31,77,58,0.16)" }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            {/* Top accent bar */}
            <div
              className="absolute top-0 left-0 right-0 h-[3px] origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300"
              style={{
                background: "linear-gradient(90deg,#1F4D3A,#6B8E23)",
              }}
            />
            <div
              className="w-13 h-13 rounded-2xl flex items-center justify-center mb-5 text-2xl"
              style={{ width: 52, height: 52, background: "rgba(31,77,58,0.07)" }}
            >
              {feat.icon}
            </div>
            <h3 className="font-serif text-lg font-semibold mb-2" style={{ color: "#1F4D3A" }}>
              {feat.title}
            </h3>
            <p className="text-sm leading-relaxed" style={{ color: "#9a9a9a" }}>
              {feat.desc}
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}