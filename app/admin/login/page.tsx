import type { Metadata } from "next";
import AdminLoginPageClient from "@/components/admin/AdminLoginPageClient";

export const metadata: Metadata = {
  title: "Admin Login – Brindhavanam Farms",
  description: "Founder-only admin dashboard access.",
};

export default function AdminLoginPage() {
  return <AdminLoginPageClient />;
}
