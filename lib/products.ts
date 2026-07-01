import type { ProductDetail, SubscriptionPlanType } from "@/types/order";

// Utility functions for subscription calculations
export function getSubscriptionDays(
  plan: SubscriptionPlanType,
  customDays: number
): number {
  if (plan === "15") return 15;
  if (plan === "30") return 30;
  return Math.min(365, Math.max(1, customDays));
}

export function calculateGrandTotal(
  pricePerDay: number,
  days: number,
  deliveryCharges: number
): number {
  return pricePerDay * days + deliveryCharges;
}

export function formatPlanLabel(
  plan: SubscriptionPlanType,
  days: number
): string {
  if (plan === "15") return "15 Days";
  if (plan === "30") return "30 Days";
  return `Custom (${days} Days)`;
}

export function formatCurrency(amount: number): string {
  return `₹${amount.toLocaleString("en-IN")}`;
}

export function formatDisplayDate(isoDate: string): string {
  if (!isoDate) return "";
  const date = new Date(isoDate + "T00:00:00");
  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function getMinStartDate(): string {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  return d.toISOString().split("T")[0];
}

export function getMaxStartDate(): string {
  const d = new Date();
  d.setDate(d.getDate() + 90);
  return d.toISOString().split("T")[0];
}
