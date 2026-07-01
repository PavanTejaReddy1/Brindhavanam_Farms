import type { Metadata } from "next";
import ReferralPageClient from "@/components/ReferralPageClient";

export const metadata: Metadata = {
  title: "Referral Program – Brindhavanam Farms",
  description:
    "Refer one family and get one litre of farm-fresh milk free. Share your link and earn rewards.",
};

export default function ReferralPage() {
  return <ReferralPageClient />;
}
