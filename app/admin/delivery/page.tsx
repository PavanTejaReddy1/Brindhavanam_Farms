import type { Metadata } from "next";
import AdminDeliveryClient from "@/components/admin/AdminDeliveryClient";

export const metadata: Metadata = {
  title: "Delivery – Admin",
  description: "Manage delivery operations",
};

export default function AdminDeliveryPage() {
  return <AdminDeliveryClient />;
}
