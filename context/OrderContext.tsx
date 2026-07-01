"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  calculateGrandTotal,
  getSubscriptionDays,
} from "@/lib/products";
import type {
  CustomerDetails,
  OrderSelection,
  OrderState,
  SubscriptionPlanType,
} from "@/types/order";
import { EMPTY_ORDER } from "@/types/order";

interface OrderContextValue {
  order: OrderState;
  hasProductSelection: boolean;
  setProductSelection: (selection: Omit<OrderSelection, "grandTotal" | "subscriptionDays"> & {
    subscriptionDays?: number;
    grandTotal?: number;
  }) => void;
  updatePlan: (plan: SubscriptionPlanType, customDays?: number) => void;
  updateQuantity: (quantityId: string, quantityLabel: string, pricePerDay: number) => void;
  updateCustomer: (details: Partial<CustomerDetails>) => void;
  resetOrder: () => void;
}

const OrderContext = createContext<OrderContextValue | null>(null);

function computeTotals(
  pricePerDay: number,
  plan: SubscriptionPlanType,
  customDays: number,
  deliveryCharges: number
) {
  const subscriptionDays = getSubscriptionDays(plan, customDays);
  const grandTotal = calculateGrandTotal(
    pricePerDay,
    subscriptionDays,
    deliveryCharges
  );
  return { subscriptionDays, grandTotal };
}

export function OrderProvider({ children }: { children: ReactNode }) {
  const [order, setOrder] = useState<OrderState>(EMPTY_ORDER);

  const setProductSelection = useCallback(
    (
      selection: Omit<OrderSelection, "grandTotal" | "subscriptionDays"> & {
        subscriptionDays?: number;
        grandTotal?: number;
      }
    ) => {
      const { subscriptionDays, grandTotal } = computeTotals(
        selection.pricePerDay,
        selection.plan,
        selection.customDays,
        selection.deliveryCharges
      );

      setOrder((prev) => ({
        ...prev,
        ...selection,
        subscriptionDays,
        grandTotal,
      }));
    },
    []
  );

  const updatePlan = useCallback(
    (plan: SubscriptionPlanType, customDays?: number) => {
      setOrder((prev) => {
        const days = customDays ?? prev.customDays;
        const { subscriptionDays, grandTotal } = computeTotals(
          prev.pricePerDay,
          plan,
          days,
          prev.deliveryCharges
        );
        return {
          ...prev,
          plan,
          customDays: days,
          subscriptionDays,
          grandTotal,
        };
      });
    },
    []
  );

  const updateQuantity = useCallback(
    (quantityId: string, quantityLabel: string, pricePerDay: number) => {
      setOrder((prev) => {
        const { subscriptionDays, grandTotal } = computeTotals(
          pricePerDay,
          prev.plan,
          prev.customDays,
          prev.deliveryCharges
        );
        return {
          ...prev,
          quantityId,
          quantityLabel,
          pricePerDay,
          subscriptionDays,
          grandTotal,
        };
      });
    },
    []
  );

  const updateCustomer = useCallback((details: Partial<CustomerDetails>) => {
    setOrder((prev) => ({ ...prev, ...details }));
  }, []);

  const resetOrder = useCallback(() => {
    setOrder(EMPTY_ORDER);
  }, []);

  const hasProductSelection = Boolean(order.productSlug && order.quantityId);

  const value = useMemo(
    () => ({
      order,
      hasProductSelection,
      setProductSelection,
      updatePlan,
      updateQuantity,
      updateCustomer,
      resetOrder,
    }),
    [
      order,
      hasProductSelection,
      setProductSelection,
      updatePlan,
      updateQuantity,
      updateCustomer,
      resetOrder,
    ]
  );

  return (
    <OrderContext.Provider value={value}>{children}</OrderContext.Provider>
  );
}

export function useOrder() {
  const context = useContext(OrderContext);
  if (!context) {
    throw new Error("useOrder must be used within OrderProvider");
  }
  return context;
}
