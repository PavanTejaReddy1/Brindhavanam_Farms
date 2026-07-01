import type { Metadata } from "next";
import AdminInventoryClient from "@/components/admin/AdminInventoryClient";

export const metadata: Metadata = {
  title: "Inventory – Admin",
  description: "Manage inventory and stock",
};

export default function AdminInventoryPage() {
  return <AdminInventoryClient />;
}
