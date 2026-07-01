import type { Metadata } from "next";
import AdminDashboardClient from "@/components/admin/AdminDashboardClient";

export const metadata: Metadata = {
  title: "Dashboard – Admin",
  description: "Admin dashboard overview",
};

export default function AdminDashboardPage() {
  return <AdminDashboardClient />;
}
