import type { Metadata } from "next";
import AdminCustomersClient from "@/components/admin/AdminCustomersClient";

export const metadata: Metadata = {
  title: "Customers – Admin",
  description: "Manage all customers",
};

export default function AdminCustomersPage() {
  return <AdminCustomersClient />;
}
