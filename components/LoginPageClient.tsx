"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";

type Step = "login" | "forgot-email" | "forgot-otp" | "forgot-success";

export default function LoginPageClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login } = useAuth();

  // Login state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Forgot-password state
  const [step, setStep] = useState<Step>("login");
  const [fpEmail, setFpEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [fpError, setFpError] = useState("");
  const [fpLoading, setFpLoading] = useState(false);
  const [fpMessage, setFpMessage] = useState("");

  const redirectTo = searchParams.get("redirect") || "/profile";

  // ── Login ──────────────────────────────────────────────
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(email, password);
      router.push(redirectTo);
    } catch {
      setError("Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  // ── Forgot: send OTP ───────────────────────────────────
  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setFpError("");
    setFpLoading(true);
    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: fpEmail, type: "user" }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to send OTP");
      setFpMessage(data.message);
      setStep("forgot-otp");
    } catch (err: any) {
      setFpError(err.message);
    } finally {
      setFpLoading(false);
    }
  };

  // ── Forgot: verify OTP & reset password ───────────────
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setFpError("");
    if (newPassword !== confirmPassword) {
      setFpError("Passwords do not match");
      return;
    }
    if (newPassword.length < 6) {
      setFpError("Password must be at least 6 characters");
      return;
    }
    setFpLoading(true);
    try {
      const res = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: fpEmail, otp, newPassword, type: "user" }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to reset password");
      setStep("forgot-success");
    } catch (err: any) {
      setFpError(err.message);
    } finally {
      setFpLoading(false);
    }
  };

  const resetForgotFlow = () => {
    setStep("login");
    setFpEmail("");
    setOtp("");
    setNewPassword("");
    setConfirmPassword("");
    setFpError("");
    setFpMessage("");
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
          <AnimatePresence mode="wait">
            {/* ── Login form ── */}
            {step === "login" && (
              <motion.div
                key="login"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
              >
                <h1 className="font-serif text-3xl font-semibold text-[#10271C] mb-2">
                  Welcome Back
                </h1>
                <p className="text-[#666] mb-8">
                  Login to manage your subscriptions and orders.
                </p>

                <form onSubmit={handleLogin} className="space-y-5">
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
                      placeholder="your@email.com"
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="block text-sm font-medium text-[#10271C]">
                        Password
                      </label>
                      <button
                        type="button"
                        onClick={() => { setStep("forgot-email"); setFpEmail(email); }}
                        className="text-xs text-[#D4AF37] font-medium hover:underline"
                      >
                        Forgot password?
                      </button>
                    </div>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="w-full px-4 py-3 rounded-xl border border-[#10271C]/10 focus:outline-none focus:border-[#D4AF37] transition-colors"
                      placeholder="••••••••"
                    />
                  </div>

                  {error && <p className="text-red-500 text-sm">{error}</p>}

                  <motion.button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3.5 rounded-full font-semibold text-sm bg-[#10271C] text-white transition-all hover:bg-[#0F291D] disabled:opacity-60"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {loading ? "Logging in..." : "Login"}
                  </motion.button>
                </form>

                <p className="mt-6 text-center text-sm text-[#666]">
                  Don&apos;t have an account?{" "}
                  <Link href="/signup" className="text-[#D4AF37] font-medium hover:underline">
                    Sign Up
                  </Link>
                </p>
              </motion.div>
            )}

            {/* ── Forgot: enter email ── */}
            {step === "forgot-email" && (
              <motion.div
                key="forgot-email"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <button
                  onClick={resetForgotFlow}
                  className="text-sm text-[#666] hover:text-[#10271C] mb-6 flex items-center gap-1"
                >
                  ← Back to Login
                </button>
                <h1 className="font-serif text-2xl font-semibold text-[#10271C] mb-2">
                  Forgot Password
                </h1>
                <p className="text-[#666] mb-8 text-sm">
                  Enter your registered email and we&apos;ll send you a 6-digit OTP.
                </p>

                <form onSubmit={handleSendOTP} className="space-y-5">
                  <div>
                    <label className="block text-sm font-medium text-[#10271C] mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={fpEmail}
                      onChange={(e) => setFpEmail(e.target.value)}
                      required
                      className="w-full px-4 py-3 rounded-xl border border-[#10271C]/10 focus:outline-none focus:border-[#D4AF37] transition-colors"
                      placeholder="your@email.com"
                    />
                  </div>

                  {fpError && <p className="text-red-500 text-sm">{fpError}</p>}

                  <motion.button
                    type="submit"
                    disabled={fpLoading}
                    className="w-full py-3.5 rounded-full font-semibold text-sm bg-[#10271C] text-white disabled:opacity-60"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {fpLoading ? "Sending OTP..." : "Send OTP"}
                  </motion.button>
                </form>
              </motion.div>
            )}

            {/* ── Forgot: enter OTP + new password ── */}
            {step === "forgot-otp" && (
              <motion.div
                key="forgot-otp"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <button
                  onClick={() => setStep("forgot-email")}
                  className="text-sm text-[#666] hover:text-[#10271C] mb-6 flex items-center gap-1"
                >
                  ← Back
                </button>
                <h1 className="font-serif text-2xl font-semibold text-[#10271C] mb-2">
                  Reset Password
                </h1>
                <p className="text-[#666] mb-1 text-sm">
                  We sent a 6-digit OTP to
                </p>
                <p className="text-[#10271C] font-semibold text-sm mb-6">{fpEmail}</p>

                <form onSubmit={handleResetPassword} className="space-y-5">
                  <div>
                    <label className="block text-sm font-medium text-[#10271C] mb-2">
                      OTP Code
                    </label>
                    <input
                      type="text"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                      required
                      maxLength={6}
                      className="w-full px-4 py-3 rounded-xl border border-[#10271C]/10 focus:outline-none focus:border-[#D4AF37] transition-colors text-center text-xl font-mono tracking-[0.4em]"
                      placeholder="••••••"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#10271C] mb-2">
                      New Password
                    </label>
                    <input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      required
                      className="w-full px-4 py-3 rounded-xl border border-[#10271C]/10 focus:outline-none focus:border-[#D4AF37] transition-colors"
                      placeholder="Min. 6 characters"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#10271C] mb-2">
                      Confirm New Password
                    </label>
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      className="w-full px-4 py-3 rounded-xl border border-[#10271C]/10 focus:outline-none focus:border-[#D4AF37] transition-colors"
                      placeholder="••••••••"
                    />
                  </div>

                  {fpError && <p className="text-red-500 text-sm">{fpError}</p>}

                  <motion.button
                    type="submit"
                    disabled={fpLoading}
                    className="w-full py-3.5 rounded-full font-semibold text-sm bg-[#10271C] text-white disabled:opacity-60"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {fpLoading ? "Resetting..." : "Reset Password"}
                  </motion.button>

                  <p className="text-center text-xs text-[#666]">
                    Didn&apos;t receive it?{" "}
                    <button
                      type="button"
                      onClick={() => setStep("forgot-email")}
                      className="text-[#D4AF37] font-medium hover:underline"
                    >
                      Resend OTP
                    </button>
                  </p>
                </form>
              </motion.div>
            )}

            {/* ── Success ── */}
            {step === "forgot-success" && (
              <motion.div
                key="forgot-success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
                className="text-center py-4"
              >
                <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">✓</span>
                </div>
                <h2 className="font-serif text-2xl font-semibold text-[#10271C] mb-2">
                  Password Reset!
                </h2>
                <p className="text-[#666] text-sm mb-8">
                  Your password has been updated successfully. You can now log in with your new password.
                </p>
                <motion.button
                  onClick={resetForgotFlow}
                  className="w-full py-3.5 rounded-full font-semibold text-sm bg-[#10271C] text-white"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Back to Login
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {step === "login" && (
          <p className="mt-6 text-center text-sm text-[#666]">
            <Link href="/" className="text-[#10271C] hover:underline">
              ← Back to Home
            </Link>
          </p>
        )}
      </motion.div>
    </motion.main>
  );
}
