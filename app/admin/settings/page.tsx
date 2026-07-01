import type { Metadata } from "next";
import AdminSettingsClient from "@/components/admin/AdminSettingsClient";

export const metadata: Metadata = {
  title: "Settings – Admin",
  description: "Manage admin settings",
};

export default function AdminSettingsPage() {
  return <AdminSettingsClient />;
}
