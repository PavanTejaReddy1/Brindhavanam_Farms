import type { Metadata } from "next";
import AdminNotificationsClient from "@/components/admin/AdminNotificationsClient";

export const metadata: Metadata = {
  title: "Notifications – Admin",
  description: "Send notifications to customers",
};

export default function AdminNotificationsPage() {
  return <AdminNotificationsClient />;
}
