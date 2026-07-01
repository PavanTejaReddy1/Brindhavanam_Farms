"use client";

import { motion } from "framer-motion";
import { WHATSAPP_URL } from "../lib/constants";

export default function WhatsAppFloat() {
  return (
    <motion.a
      href={WHATSAPP_URL}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      title="Order on WhatsApp"
      className="wa-float fixed bottom-8 right-8 z-50 w-14 h-14 rounded-full flex items-center justify-center text-2xl"
      style={{ background: "#25d366" }}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 1.5, type: "spring", stiffness: 200 }}
      whileHover={{ scale: 1.12, background: "#20ba5a" }}
      whileTap={{ scale: 0.95 }}
    >
      💬
    </motion.a>
  );
}