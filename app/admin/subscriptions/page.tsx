import type { Metadata } from "next";
import AdminSubscriptionsClient from "@/components/admin/AdminSubscriptionsClient";

export const metadata: Metadata = {
  title: "Subscriptions – Admin",
  description: "Manage all subscriptions",
};

export default function AdminSubscriptionsPage() {
  return <AdminSubscriptionsClient />;
}
