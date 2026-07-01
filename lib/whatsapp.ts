import { WHATSAPP_NUMBER } from "@/lib/constants";
import { formatDisplayDate, formatPlanLabel } from "@/lib/products";
import type { OrderState } from "@/types/order";

export function buildWhatsAppMessage(order: OrderState): string {
  const planLabel = formatPlanLabel(order.plan, order.subscriptionDays);
  const startDate = formatDisplayDate(order.startDate);
  const address = [
    order.houseNumber,
    order.street,
    order.area,
    order.landmark,
    order.city,
    order.district,
    order.pincode,
  ]
    .filter(Boolean)
    .join(", ");

  return [
    "Hello Brindhavanam Farms,",
    "",
    "I would like to subscribe.",
    "",
    `Product: ${order.productName}`,
    `Quantity: ${order.quantityLabel}`,
    `Plan: ${planLabel}`,
    `Total: ₹${order.grandTotal.toLocaleString("en-IN")}`,
    `Start Date: ${startDate}`,
    "",
    "Customer",
    `Name: ${order.fullName}`,
    `Phone: ${order.phone}`,
    `Address: ${address}`,
    "",
    "Please confirm my subscription.",
  ].join("\n");
}

export function buildWhatsAppUrl(order: OrderState): string {
  const message = encodeURIComponent(buildWhatsAppMessage(order));
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${message}`;
}
