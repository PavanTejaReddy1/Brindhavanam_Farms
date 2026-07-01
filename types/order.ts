export type SubscriptionPlanType = "15" | "30" | "custom";

export interface QuantityOption {
  id: string;
  label: string;
  pricePerDay: number;
}

export interface ProductDetail {
  slug: string;
  name: string;
  image: string;
  shortDescription: string;
  description: string;
  freshnessBadge: string;
  availability: string;
  deliveryTime: string;
  quantities: QuantityOption[];
  deliveryCharges: number;
  featured?: boolean;
  displayPrice: string;
  sizes: string[];
  stock?: number;
  stockStatus?: string;
}

export interface CustomerDetails {
  fullName: string;
  phone: string;
  email: string;
  houseNumber: string;
  street: string;
  area: string;
  landmark: string;
  city: string;
  district: string;
  pincode: string;
  startDate: string;
}

export interface OrderSelection {
  productSlug: string;
  productName: string;
  productImage: string;
  quantityId: string;
  quantityLabel: string;
  pricePerDay: number;
  plan: SubscriptionPlanType;
  customDays: number;
  subscriptionDays: number;
  deliveryCharges: number;
  deliveryWindow: string;
  grandTotal: number;
}

export interface OrderState extends OrderSelection, CustomerDetails {}

export const EMPTY_CUSTOMER: CustomerDetails = {
  fullName: "",
  phone: "",
  email: "",
  houseNumber: "",
  street: "",
  area: "",
  landmark: "",
  city: "",
  district: "",
  pincode: "",
  startDate: "",
};

export const EMPTY_ORDER: OrderState = {
  productSlug: "",
  productName: "",
  productImage: "",
  quantityId: "",
  quantityLabel: "",
  pricePerDay: 0,
  plan: "30",
  customDays: 30,
  subscriptionDays: 30,
  deliveryCharges: 0,
  deliveryWindow: "Morning (5 AM - 7 AM)",
  grandTotal: 0,
  ...EMPTY_CUSTOMER,
};
