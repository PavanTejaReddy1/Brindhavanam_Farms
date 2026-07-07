"use client";

import { useCallback, useMemo, useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  Check,
  Copy,
  Facebook,
  Send,
  Share2,
} from "lucide-react";
import SubscriptionHeader from "@/components/SubscriptionHeader";
import { useAuth } from "@/contexts/AuthContext";
import { fetchWithAuth } from "@/lib/api";
import {
  REFERRAL_REWARDS,
  REFERRAL_STEPS,
  getFacebookShareUrl,
  getReferralLink,
  getTelegramShareUrl,
  getWhatsAppShareUrl,
} from "@/lib/referral";

export default function ReferralPageClient() {
  const { user } = useAuth();
  const [referralData, setReferralData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [copyAnimating, setCopyAnimating] = useState(false);

  const referralCode = user?.referralCode || "";
  const referralLink = useMemo(
    () => getReferralLink(referralCode),
    [referralCode]
  );

  useEffect(() => {
    fetchReferralData();
  }, []);

  const fetchReferralData = async () => {
    try {
      setLoading(true);
      const data = await fetchWithAuth("/api/referrals/my");
      setReferralData(data);
    } catch (error) {
      console.error("Error fetching referral data:", error);
      setReferralData(null);
    } finally {
      setLoading(false);
    }
  };

  const showToast = useCallback(() => {
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2500);
  }, []);

  const copyLink = useCallback(async () => {
    setCopyAnimating(true);
    try {
      await navigator.clipboard.writeText(referralLink);
      showToast();
    } catch {
      showToast();
    }
    window.setTimeout(() => setCopyAnimating(false), 400);
  }, [referralLink, showToast]);

  const handleNativeShare = useCallback(async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Brindhavanam Farms Referral",
          text: "Join Brindhavanam Farms for farm-fresh milk delivered every morning!",
          url: referralLink,
        });
      } catch {
        /* user cancelled */
      }
    } else {
      copyLink();
    }
  }, [referralLink, copyLink]);

  if (loading) {
    return (
      <>
        <SubscriptionHeader backHref="/#referral" backLabel="Back to Home" />
        <div className="min-h-screen bg-[#F8F6F0] flex items-center justify-center">
          <p className="text-[#666]">Loading referral data...</p>
        </div>
      </>
    );
  }

  return (
    <>
      <SubscriptionHeader backHref="/#referral" backLabel="Back to Home" />
      <motion.main
        className="min-h-screen bg-[#F8F6F0]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* Hero */}
        <section className="px-[5%] pt-10 pb-16">
          <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <span
                className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest px-4 py-1.5 rounded-full mb-6"
                style={{
                  background: "rgba(16,39,28,0.08)",
                  border: "1px solid rgba(212,175,55,0.35)",
                  color: "#10271C",
                }}
              >
                🎁 Referral Program
              </span>
              <h1 className="font-serif text-4xl md:text-5xl font-semibold text-[#10271C] leading-tight mb-4">
                Refer One Family,
                <br />
                Get One Litre{" "}
                <em className="text-[#D4AF37] not-italic">Milk Free.</em>
              </h1>
              <p className="text-[#666] leading-relaxed max-w-lg">
                Share farm-fresh goodness with people you care about. Every
                successful referral earns you free milk — the more you share,
                the more you earn.
              </p>
            </motion.div>

            <motion.div
              className="relative w-full h-[360px] md:h-[460px] overflow-hidden rounded-[28px] shadow-[0_20px_60px_rgba(0,0,0,.18)]"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.15, duration: 0.6 }}
              whileHover={{
                scale: 1.03,
                boxShadow: "0 30px 80px rgba(0,0,0,.25)",
              }}
              style={{ transition: "all .4s ease" }}
            >
              <Image
                src="/referral-offer.png"
                alt="Refer One Family Get One Litre Free"
                fill
                className="object-contain rounded-[28px]"
                priority
              />
            </motion.div>
          </div>
        </section>

        {/* How it works */}
        <section className="px-[5%] py-16 bg-white">
          <div className="max-w-6xl mx-auto">
            <motion.h2
              className="font-serif text-3xl font-semibold text-[#10271C] mb-10 text-center"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              How It Works
            </motion.h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {REFERRAL_STEPS.map((item, index) => (
                <motion.div
                  key={item.step}
                  className="p-6 rounded-[28px] bg-[#F8F6F0] border border-[#10271C]/8"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -4, boxShadow: "0 12px 40px rgba(16,39,28,0.1)" }}
                >
                  <span className="text-xs font-bold uppercase tracking-widest text-[#D4AF37]">
                    {item.step}
                  </span>
                  <h3 className="font-serif text-xl font-semibold text-[#10271C] mt-2 mb-2">
                    {item.title}
                  </h3>
                  <p className="text-sm text-[#666] leading-relaxed">{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Referral Link */}
        <section className="px-[5%] py-16">
          <div className="max-w-3xl mx-auto">
            <motion.div
              className="rounded-[28px] bg-[#10271C] p-8 md:p-10 text-center shadow-[0_20px_60px_rgba(16,39,28,0.25)]"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <p className="text-[#D4AF37] text-xs font-semibold uppercase tracking-widest mb-3">
                Your Referral Code
              </p>
              <p className="font-serif text-3xl font-bold text-white mb-6 tracking-wide">
                {referralCode}
              </p>
              <div className="bg-white/10 rounded-2xl px-4 py-3 mb-6 break-all">
                <p className="text-white/90 text-sm font-mono">{referralLink}</p>
              </div>

              <motion.button
                type="button"
                onClick={copyLink}
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full font-semibold text-sm bg-[#D4AF37] text-[#10271C]"
                whileHover={{ scale: 1.04, y: -2 }}
                whileTap={{ scale: 0.97 }}
                animate={copyAnimating ? { scale: [1, 0.95, 1.05, 1] } : {}}
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4" /> Copied!
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" /> Copy Link
                  </>
                )}
              </motion.button>
            </motion.div>
          </div>
        </section>

        {/* Share Buttons */}
        <section className="px-[5%] pb-16">
          <div className="max-w-3xl mx-auto">
            <h2 className="font-serif text-2xl font-semibold text-[#10271C] mb-6 text-center">
              Share Your Link
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <ShareButton
                label="WhatsApp"
                href={getWhatsAppShareUrl(referralLink)}
                external
                color="#25d366"
              />
              <ShareButton
                label="Facebook"
                href={getFacebookShareUrl(referralLink)}
                external
                color="#1877F2"
              />
              <ShareButton
                label="Telegram"
                href={getTelegramShareUrl(referralLink)}
                external
                color="#0088cc"
              />
              <ShareButton
                label="Copy Link"
                onClick={copyLink}
                color="#10271C"
              />
            </div>
            <div className="mt-4 md:hidden">
              <motion.button
                type="button"
                onClick={handleNativeShare}
                className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl font-semibold text-sm text-white bg-[#10271C]"
                whileTap={{ scale: 0.98 }}
              >
                <Share2 className="w-4 h-4" />
                Share
              </motion.button>
            </div>
          </div>
        </section>

        {/* Progress */}
        <section className="px-[5%] py-16 bg-white">
          <div className="max-w-4xl mx-auto">
            <h2 className="font-serif text-2xl font-semibold text-[#10271C] mb-8 text-center">
              Your Referral Progress
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <motion.div
                className="p-6 rounded-[28px] bg-[#F8F6F0] text-center border border-[#10271C]/8"
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0 }}
                whileHover={{ y: -3 }}
              >
                <p className="text-4xl font-serif font-bold text-[#10271C] mb-2">
                  {referralData?.totalReferrals || 0}
                </p>
                <p className="text-sm text-[#666]">Friends Referred</p>
              </motion.div>
              <motion.div
                className="p-6 rounded-[28px] bg-[#F8F6F0] text-center border border-[#10271C]/8"
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.08 }}
                whileHover={{ y: -3 }}
              >
                <p className="text-4xl font-serif font-bold text-[#10271C] mb-2">
                  {referralData?.successfulReferrals || 0}
                </p>
                <p className="text-sm text-[#666]">Successful Referrals</p>
              </motion.div>
              <motion.div
                className="p-6 rounded-[28px] bg-[#F8F6F0] text-center border border-[#10271C]/8"
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.16 }}
                whileHover={{ y: -3 }}
              >
                <p className="text-4xl font-serif font-bold text-[#10271C] mb-2">
                  ₹{referralData?.totalEarnings || 0}
                </p>
                <p className="text-sm text-[#666]">Rewards Earned</p>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Rewards */}
        <section className="px-[5%] py-16">
          <div className="max-w-4xl mx-auto">
            <h2 className="font-serif text-2xl font-semibold text-[#10271C] mb-8 text-center">
              Rewards
            </h2>
            <div className="space-y-4">
              {REFERRAL_REWARDS.map((item, index) => (
                <motion.div
                  key={item.count}
                  className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 p-5 rounded-2xl bg-white border border-[#10271C]/10 shadow-sm"
                  initial={{ opacity: 0, x: -12 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.08 }}
                  whileHover={{ x: 4, boxShadow: "0 8px 24px rgba(16,39,28,0.08)" }}
                >
                  <span className="font-semibold text-[#10271C]">{item.count}</span>
                  <span className="text-[#D4AF37] font-medium">{item.reward}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="px-[5%] pb-20">
          <div className="max-w-2xl mx-auto flex flex-col sm:flex-row gap-4 justify-center">
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
              <Link
                href="/#products"
                className="inline-flex w-full sm:w-auto items-center justify-center px-8 py-3.5 rounded-full font-semibold text-sm bg-[#10271C] text-white"
              >
                Start Referring
              </Link>
            </motion.div>
            <motion.a
              href={getWhatsAppShareUrl(referralLink)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex w-full sm:w-auto items-center justify-center gap-2 px-8 py-3.5 rounded-full font-semibold text-sm bg-[#25d366] text-white"
              whileHover={{ scale: 1.03, y: -2 }}
              whileTap={{ scale: 0.97 }}
            >
              <Send className="w-4 h-4" />
              Share on WhatsApp
            </motion.a>
          </div>
        </section>
      </motion.main>

      {/* Toast */}
      <AnimatePresence>
        {copied && (
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[100] px-6 py-3.5 rounded-full bg-[#10271C] text-white text-sm font-semibold shadow-[0_12px_40px_rgba(0,0,0,.25)] flex items-center gap-2"
          >
            <Check className="w-4 h-4 text-[#D4AF37]" />
            Referral link copied!
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function ShareButton({
  label,
  href,
  onClick,
  external,
  color,
}: {
  label: string;
  href?: string;
  onClick?: () => void;
  external?: boolean;
  color: string;
}) {
  const className =
    "flex items-center justify-center gap-2 py-3.5 rounded-2xl font-semibold text-sm text-white transition-all";

  if (onClick) {
    return (
      <motion.button
        type="button"
        onClick={onClick}
        className={className}
        style={{ background: color }}
        whileHover={{ y: -2, scale: 1.02 }}
        whileTap={{ scale: 0.97 }}
      >
        <Copy className="w-4 h-4" />
        {label}
      </motion.button>
    );
  }

  return (
    <motion.a
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
      className={className}
      style={{ background: color }}
      whileHover={{ y: -2, scale: 1.02 }}
      whileTap={{ scale: 0.97 }}
    >
      {label === "Facebook" && <Facebook className="w-4 h-4" />}
      {label === "WhatsApp" && <Send className="w-4 h-4" />}
      {label === "Telegram" && <Send className="w-4 h-4" />}
      {label}
    </motion.a>
  );
}
