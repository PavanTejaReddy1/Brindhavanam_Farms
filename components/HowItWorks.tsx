"use client";

import { motion } from "framer-motion";
import SectionHeader from "../components/SectionHeader";
import { STEPS } from "../lib/constants";

export default function HowItWorks() {
  return (
    <section id="how" className="py-24 px-[5%] bg-white">
      <SectionHeader
        eyebrow="The Process"
        title="Farm to Family, Every Morning"
        subtitle="Four simple steps that bring the purest milk from our partner farms straight to your door before you wake up."
      />

      {/* Steps grid */}
      <div className="relative mt-4">
        {/* Horizontal connector line — desktop only */}
        <div
          className="hidden lg:block absolute top-10 left-0 right-0 h-px"
          style={{
            background:
              "linear-gradient(90deg, transparent 6%, #D4AF37 20%, #D4AF37 80%, transparent 94%)",
            opacity: 0.35,
            zIndex: 0,
          }}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-12 stagger">
          {STEPS.map((step, i) => (
            <motion.div
              key={step.title}
              className="reveal flex flex-col items-center text-center relative z-10"
              whileHover={{ y: -6 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              {/* Icon circle */}
              <div className="relative mb-6 flex-shrink-0">
                {/* Outer gradient ring */}
                <div
                  className="w-20 h-20 rounded-full flex items-center justify-center"
                  style={{
                    background: "linear-gradient(135deg, #1F4D3A, #6B8E23)",
                    padding: "2px",
                  }}
                >
                  <div className="w-full h-full rounded-full bg-white flex items-center justify-center text-3xl">
                    {step.icon}
                  </div>
                </div>
                {/* Step badge */}
                <span
                  className="absolute -top-2 -right-1 text-[0.55rem] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full shadow-sm"
                  style={{ background: "#D4AF37", color: "#163728" }}
                >
                  {step.step}
                </span>
              </div>

              {/* Text */}
              <h3
                className="font-serif text-base font-semibold mb-2 leading-snug"
                style={{ color: "#1F4D3A" }}
              >
                {step.title}
              </h3>
              <p
                className="text-sm leading-relaxed max-w-[200px]"
                style={{ color: "#888" }}
              >
                {step.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
