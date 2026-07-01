"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

const STEPS = [
  { n: "1", text: "Share your unique referral link with friends & family" },
  { n: "2", text: "They place their first subscription order" },
  { n: "3", text: "You receive 1 litre of fresh milk — free, no limits" },
];

export default function Referral() {
  return (
    <section
      id="referral"
      data-nav-theme="dark"
      className="py-24 px-[5%] relative overflow-hidden"
      style={{
        background: "linear-gradient(135deg,#0F291D 0%,#1F4D3A 50%,#3a6b4a 100%)",
      }}
    >
      {/* Decorative circle */}
      <div
        className="absolute -top-1/2 -right-10 w-[600px] h-[600px] rounded-full pointer-events-none"
        style={{ background: "rgba(212,175,55,0.05)" }}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center relative">
        {/* Left */}
        <div className="reveal">
          <span
            className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest px-4 py-1.5 rounded-full mb-6"
            style={{
              background: "rgba(212,175,55,0.1)",
              border: "1px solid rgba(212,175,55,0.3)",
              color: "#D4AF37",
            }}
          >
            🎁 Referral Program
          </span>
          <h2 className="font-serif text-3xl md:text-4xl font-semibold text-white mb-4 leading-tight">
            Refer One Family.
            <br />
            Get{" "}
            <em style={{ color: "#D4AF37", fontStyle: "italic" }}>
              One Litre Free.
            </em>
          </h2>
          <p className="text-base text-white/70 font-light leading-relaxed mb-8 max-w-lg">
            Love our milk as much as we do? Share it with a neighbour, a friend, or family — and we'll
            thank you with a free litre every time someone you refer subscribes.
          </p>

          <div className="flex flex-col gap-4 mb-8">
            {STEPS.map((step) => (
              <div key={step.n} className="flex items-center gap-4 text-white/90">
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                  style={{
                    background: "rgba(212,175,55,0.2)",
                    border: "1px solid rgba(212,175,55,0.4)",
                    color: "#D4AF37",
                  }}
                >
                  {step.n}
                </div>
                <span className="text-sm">{step.text}</span>
              </div>
            ))}
          </div>

          <Link href="/referral">
            <motion.span
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full font-semibold text-sm cursor-pointer"
              style={{ background: "#D4AF37", color: "#163728" }}
              whileHover={{ scale: 1.04, y: -2 }}
              whileTap={{ scale: 0.97 }}
            >
              Get My Referral Link →
            </motion.span>
          </Link>
        </div>

        {/* Right - Reward Card */}
        <motion.div
          className="reveal flex justify-center w-full"
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
        >
          <div
            className="relative w-full max-w-xs h-[460px] overflow-hidden rounded-[28px]"
          >
            <Image
              src="/referral.png"
              alt="Refer One Family Get One Litre Free"
              fill
              className="object-cover rounded hover:scale-105 transition-transform duration-500"
              priority
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}