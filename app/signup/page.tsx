import type { Metadata } from "next";
import SignupPageClient from "@/components/SignupPageClient";

export const metadata: Metadata = {
  title: "Sign Up – Brindhavanam Farms",
  description: "Create your Brindhavanam Farms account to start ordering fresh milk.",
};

export default function SignupPage() {
  return <SignupPageClient />;
}
