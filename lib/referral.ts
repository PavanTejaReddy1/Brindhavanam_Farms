export const REFERRAL_BASE_URL = "https://brindhavanamfarms.com/ref";

export function generateReferralCode(): string {
  const suffix = Math.floor(10000 + Math.random() * 90000);
  return `BRIND${suffix}`;
}

export function getReferralLink(code: string): string {
  return `${REFERRAL_BASE_URL}/${code}`;
}

export function getWhatsAppShareUrl(link: string): string {
  const text = encodeURIComponent(
    `Join Brindhavanam Farms for farm-fresh milk delivered every morning! Use my referral link: ${link}`
  );
  return `https://wa.me/?text=${text}`;
}

export function getFacebookShareUrl(link: string): string {
  return `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(link)}`;
}

export function getTelegramShareUrl(link: string): string {
  const text = encodeURIComponent(
    `Join Brindhavanam Farms for farm-fresh milk! ${link}`
  );
  return `https://t.me/share/url?url=${encodeURIComponent(link)}&text=${text}`;
}

export const REFERRAL_STEPS = [
  {
    step: "Step 1",
    title: "Share your referral link",
    desc: "Send your unique link to friends and family via WhatsApp, social media, or copy-paste.",
  },
  {
    step: "Step 2",
    title: "Friend subscribes",
    desc: "When they sign up and place their first subscription, your referral is tracked automatically.",
  },
  {
    step: "Step 3",
    title: "Both receive rewards",
    desc: "You earn free milk litres, and your friend gets a warm welcome to farm-fresh dairy.",
  },
];

export const REFERRAL_REWARDS = [
  { count: "1 Referral", reward: "→ 1 Litre Milk Free" },
  { count: "5 Referrals", reward: "→ 2L Milk" },
  { count: "10 Referrals", reward: "→ Special Gift Hamper" },
];

export const REFERRAL_PROGRESS = [
  { label: "Friends Referred", value: 0 },
  { label: "Successful Referrals", value: 0 },
  { label: "Free Litres Earned", value: 0 },
];
