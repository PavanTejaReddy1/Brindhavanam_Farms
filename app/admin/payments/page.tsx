import type { Metadata } from "next";
import AdminPaymentsClient from "@/components/admin/AdminPaymentsClient";

export const metadata: Metadata = {
  title: "Payments – Admin",
  description: "Manage all payments",
};

export default function AdminPaymentsPage() {
  return <AdminPaymentsClient />;
}
