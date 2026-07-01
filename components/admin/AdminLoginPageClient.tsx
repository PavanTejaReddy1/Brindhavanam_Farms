"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useAdmin } from "@/contexts/AdminContext";

export default function AdminLoginPageClient() {
  const router = useRouter();
  const { login, isAuthenticated } = useAdmin();
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (isAuthenticated) {
    router.push("/admin/dashboard");
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const success = await login(email, password);
    
    if (success) {
      router.push("/admin/dashboard");
    } else {
      setError("Invalid Admin Credentials");
    }
    
    setLoading(false);
  };

  return (
    <motion.main
      className="min-h-screen bg-[#F8F6F0] flex items-center justify-center px-[5%]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        className="w-full max-w-md"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="rounded-[28px] bg-white p-8 md:p-10 shadow-[0_20px_60px_rgba(0,0,0,.08)]">
          {/* Logo */}
          <div className="text-center mb-8">
            <h1 className="font-serif text-3xl font-bold text-[#10271C] mb-2">
              Brindhavanam Farms
            </h1>
            <p className="text-[#D4AF37] text-sm font-semibold tracking-widest uppercase">
              Founder Login
            </p>
          </div>

          <p className="text-center text-[#666] mb-8">
            Authorized Access Only
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-[#10271C] mb-2">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-xl border border-[#10271C]/10 focus:outline-none focus:border-[#D4AF37] transition-colors"
                placeholder="pavantejareddy85@gmail.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#10271C] mb-2">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-xl border border-[#10271C]/10 focus:outline-none focus:border-[#D4AF37] transition-colors"
                placeholder="••••••••"
              />
            </div>

            {error && (
              <p className="text-red-500 text-sm text-center">{error}</p>
            )}

            <motion.button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-full font-semibold text-sm bg-[#10271C] text-white transition-all hover:bg-[#0F291D]"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {loading ? "Logging in..." : "Login"}
            </motion.button>
          </form>
        </div>

        <p className="mt-6 text-center text-sm text-[#666]">
          <a href="/" className="text-[#10271C] hover:underline">
            ← Back to Website
          </a>
        </p>
      </motion.div>
    </motion.main>
  );
}
