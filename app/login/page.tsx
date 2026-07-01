import type { Metadata } from "next";
import LoginPageClient from "@/components/LoginPageClient";

export const metadata: Metadata = {
  title: "Login – Brindhavanam Farms",
  description: "Login to your Brindhavanam Farms account to manage subscriptions and orders.",
};

export default function LoginPage() {
  return <LoginPageClient />;
}
