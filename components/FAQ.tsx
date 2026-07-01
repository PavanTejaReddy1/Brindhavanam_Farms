"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import SectionHeader from "../components/SectionHeader";
import { FAQS } from "../lib/constants";

export default function FAQ() {
  const [openIdx, setOpenIdx] = useState<number | null>(null);

  return (
    <section id="faq" className="py-24 px-[5%] bg-white max-w-3xl mx-auto">
      <SectionHeader
        eyebrow="Questions"
        title="Things People Often Ask"
      />
      <div className="space-y-0">
        {FAQS.map((faq, i) => (
          <div
            key={i}
            className="border-b"
            style={{ borderColor: "rgba(0,0,0,0.06)" }}
          >
            <button
              className="w-full flex items-center justify-between gap-4 py-5 text-left bg-none border-none cursor-pointer"
              onClick={() => setOpenIdx(openIdx === i ? null : i)}
            >
              <span className="text-sm font-semibold" style={{ color: "#1a1a1a" }}>
                {faq.q}
              </span>
              <motion.div
                className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold"
                style={{
                  background: openIdx === i ? "#1F4D3A" : "rgba(31,77,58,0.07)",
                  color: openIdx === i ? "#fff" : "#1F4D3A",
                }}
                animate={{ rotate: openIdx === i ? 45 : 0 }}
                transition={{ duration: 0.2 }}
              >
                +
              </motion.div>
            </button>
            <AnimatePresence>
              {openIdx === i && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25, ease: "easeInOut" }}
                  style={{ overflow: "hidden" }}
                >
                  <p
                    className="text-sm leading-relaxed font-light pb-5"
                    style={{ color: "#6b6b6b" }}
                  >
                    {faq.a}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </section>
  );
}