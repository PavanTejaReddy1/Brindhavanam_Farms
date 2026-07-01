"use client";

import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import Features from "../components/Features";
import Products from "../components/Products";
import HowItWorks from "../components/HowItWorks";
import Referral from "../components/Referral";
import Compare from "../components/Compare";
import Testimonials from "../components/Testimonials";
import FAQ from "../components/FAQ";
import Contact from "../components/Contact";
import WhatsAppFloat from "../components/WhatsAppFloat";
import ScrollRevealInit from "../components/ScrollRevealInit";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <ScrollRevealInit />
      <Navbar />
      <main>
        <Hero />
        <Features />
        <Products />
        <HowItWorks />
        <Referral />
        <Compare />
        <Testimonials />
        <FAQ />
        <Contact />
      </main>
      <WhatsAppFloat />
      <Footer />
    </>
  );
}