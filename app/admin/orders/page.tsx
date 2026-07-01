import type { Metadata } from "next";
import AdminOrdersClient from "@/components/admin/AdminOrdersClient";

export const metadata: Metadata = {
  title: "Orders – Admin",
  description: "Manage all orders",
};

export default function AdminOrdersPage() {
  return <AdminOrdersClient />;
}
