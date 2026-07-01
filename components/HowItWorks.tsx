"use client";



import { motion } from "framer-motion";

import SectionHeader from "../components/SectionHeader";

import { STEPS } from "../lib/constants";



export default function HowItWorks() {

  return (

    <section id="how" className="py-24 px-[5%] bg-white">

      <SectionHeader

        eyebrow="The Process"

        title="From Sunrise to Your Doorstep"

        subtitle="A seamless circle of freshness that begins at your local farm and ends at your door."

      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 relative stagger">

        {/* Timeline container (desktop) */}

        <div className="hidden lg:block absolute left-0 right-0 top-1/2 -translate-y-1/2" style={{ zIndex: 1 }}>

          {/* Gray background line */}

          <div className="absolute left-[12.5%] right-[12.5%] h-px opacity-20" style={{

            background: "linear-gradient(90deg,transparent,#1F4D3A,#6B8E23,#1F4D3A,transparent)",

          }} />

        </div>



        {STEPS.map((step, i) => (

          <motion.div

            key={step.title}

            className="reveal text-center relative z-10"

            whileHover={{ y: -4 }}

            transition={{ type: "spring", stiffness: 300, damping: 20 }}

          >

            <div className="relative inline-block mb-6">

              <div

                className="w-20 h-20 rounded-full flex items-center justify-center text-3xl relative z-20"

                style={{ background: "#FFFFFF", padding: "8px" }}

              >

                {step.icon}

              </div>

              {/* Gradient ring */}

              <div

                className="absolute inset-[-2px] rounded-full -z-10"

                style={{

                  background: "linear-gradient(135deg,#1F4D3A,#6B8E23)",

                }}

              />

              {/* Step badge */}

              <span

                className="absolute -top-2 right-0 text-[0.55rem] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full"

                style={{ background: "#D4AF37", color: "#163728" }}

              >

                {step.step}

              </span>

            </div>

            <h3 className="font-serif text-base font-semibold mb-2" style={{ color: "#1F4D3A" }}>

              {step.title}

            </h3>

            <p className="text-sm leading-relaxed" style={{ color: "#9a9a9a" }}>

              {step.desc}

            </p>

          </motion.div>

        ))}

      </div>

    </section>

  );

}