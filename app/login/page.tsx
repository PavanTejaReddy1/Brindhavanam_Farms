import type { Metadata } from "next";
import { Suspense } from "react";
import LoginPageClient from "@/components/LoginPageClient";

export const metadata: Metadata = {
  title: "Login – Brindhavanam Farms",
  description: "Login to your Brindhavanam Farms account to manage subscriptions and orders.",
};

export default function LoginPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LoginPageClient />
    </Suspense>
  );
}
