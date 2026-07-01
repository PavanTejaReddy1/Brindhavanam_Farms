import type { Metadata } from "next";
import AdminProductsClient from "@/components/admin/AdminProductsClient";

export const metadata: Metadata = {
  title: "Products – Admin",
  description: "Manage all products",
};

export default function AdminProductsPage() {
  return <AdminProductsClient />;
}
