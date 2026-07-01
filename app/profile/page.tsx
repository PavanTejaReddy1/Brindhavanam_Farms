import type { Metadata } from "next";
import ProfilePageClient from "@/components/ProfilePageClient";

export const metadata: Metadata = {
  title: "Profile – Brindhavanam Farms",
  description: "Manage your profile, subscriptions, and orders.",
};

export default function ProfilePage() {
  return <ProfilePageClient />;
}
