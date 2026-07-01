import type { Metadata } from "next";
import AdminReferralsClient from "@/components/admin/AdminReferralsClient";

export const metadata: Metadata = {
  title: "Referral Program – Admin",
  description: "Manage referral program",
};

export default function AdminReferralsPage() {
  return <AdminReferralsClient />;
}
