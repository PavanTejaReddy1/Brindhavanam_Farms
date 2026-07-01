"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import clsx from "clsx";
import { useOrder } from "@/context/OrderContext";
import { getMinStartDate, getMaxStartDate } from "@/lib/products";
import { buildWhatsAppUrl } from "@/lib/whatsapp";
import OrderSummary from "./OrderSummary";
import { CheckCircle2, Loader2 } from "lucide-react";

interface FormErrors {
  [key: string]: string;
}

export default function CheckoutForm() {
  const { order, updateCustomer } = useOrder();
  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const minDate = getMinStartDate();
  const maxDate = getMaxStartDate();

  function validate(): FormErrors {
    const next: FormErrors = {};

    if (!order.fullName.trim()) next.fullName = "Full name is required";
    if (!order.phone.trim()) {
      next.phone = "Phone number is required";
    } else if (!/^\d{10}$/.test(order.phone)) {
      next.phone = "Phone must be exactly 10 digits";
    }
    if (!order.houseNumber.trim()) next.houseNumber = "House number is required";
    if (!order.street.trim()) next.street = "Street is required";
    if (!order.area.trim()) next.area = "Area is required";
    if (!order.city.trim()) next.city = "City is required";
    if (!order.district.trim()) next.district = "District is required";
    if (!order.pincode.trim()) {
      next.pincode = "Pincode is required";
    } else if (!/^\d{6}$/.test(order.pincode)) {
      next.pincode = "Pincode must be 6 digits";
    }
    if (!order.startDate) {
      next.startDate = "Start date is required";
    } else if (order.startDate < minDate || order.startDate > maxDate) {
      next.startDate = "Please select a date between tomorrow and 90 days from now";
    }

    return next;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const validationErrors = validate();
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
      setTimeout(() => {
        window.open(buildWhatsAppUrl(order), "_blank");
      }, 1200);
    }, 800);
  }

  function handleChange(field: keyof typeof order, value: string) {
    updateCustomer({ [field]: value });
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  }

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-8">
        <section>
          <h2 className="font-serif text-2xl font-semibold text-[#10271C] mb-6">
            Customer Details
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field
              label="Full Name"
              required
              error={errors.fullName}
              className="sm:col-span-2"
            >
              <input
                type="text"
                value={order.fullName}
                onChange={(e) => handleChange("fullName", e.target.value)}
                className={inputClass(errors.fullName)}
                placeholder="Your full name"
              />
            </Field>

            <Field label="Phone Number" required error={errors.phone}>
              <input
                type="tel"
                value={order.phone}
                onChange={(e) =>
                  handleChange("phone", e.target.value.replace(/\D/g, "").slice(0, 10))
                }
                className={inputClass(errors.phone)}
                placeholder="10-digit mobile number"
              />
            </Field>

            <Field label="Email" error={errors.email}>
              <input
                type="email"
                value={order.email}
                onChange={(e) => handleChange("email", e.target.value)}
                className={inputClass()}
                placeholder="Optional"
              />
            </Field>

            <Field label="House Number" required error={errors.houseNumber}>
              <input
                type="text"
                value={order.houseNumber}
                onChange={(e) => handleChange("houseNumber", e.target.value)}
                className={inputClass(errors.houseNumber)}
                placeholder="Flat / House no."
              />
            </Field>

            <Field label="Street" required error={errors.street}>
              <input
                type="text"
                value={order.street}
                onChange={(e) => handleChange("street", e.target.value)}
                className={inputClass(errors.street)}
                placeholder="Street name"
              />
            </Field>

            <Field label="Area" required error={errors.area}>
              <input
                type="text"
                value={order.area}
                onChange={(e) => handleChange("area", e.target.value)}
                className={inputClass(errors.area)}
                placeholder="Locality / Area"
              />
            </Field>

            <Field label="Landmark" error={errors.landmark}>
              <input
                type="text"
                value={order.landmark}
                onChange={(e) => handleChange("landmark", e.target.value)}
                className={inputClass()}
                placeholder="Optional"
              />
            </Field>

            <Field label="Village / City" required error={errors.city}>
              <input
                type="text"
                value={order.city}
                onChange={(e) => handleChange("city", e.target.value)}
                className={inputClass(errors.city)}
                placeholder="City"
              />
            </Field>

            <Field label="District" required error={errors.district}>
              <input
                type="text"
                value={order.district}
                onChange={(e) => handleChange("district", e.target.value)}
                className={inputClass(errors.district)}
                placeholder="District"
              />
            </Field>

            <Field label="Pincode" required error={errors.pincode}>
              <input
                type="text"
                value={order.pincode}
                onChange={(e) =>
                  handleChange("pincode", e.target.value.replace(/\D/g, "").slice(0, 6))
                }
                className={inputClass(errors.pincode)}
                placeholder="6-digit pincode"
              />
            </Field>
          </div>
        </section>

        <section>
          <h2 className="font-serif text-xl font-semibold text-[#10271C] mb-4">
            Start Date
          </h2>
          <Field label="Select delivery start date" required error={errors.startDate}>
            <input
              type="date"
              value={order.startDate}
              min={minDate}
              max={maxDate}
              onChange={(e) => handleChange("startDate", e.target.value)}
              className={inputClass(errors.startDate)}
            />
          </Field>
          <p className="text-xs text-[#666] mt-2">
            Earliest: tomorrow · Latest: 90 days from today
          </p>
        </section>

        <section>
          <h2 className="font-serif text-xl font-semibold text-[#10271C] mb-4">
            Delivery Time
          </h2>
          <div className="p-4 rounded-2xl border-2 border-[#10271C] bg-[#10271C]/5">
            <div className="flex items-center gap-3">
              <span className="w-4 h-4 rounded-full bg-[#10271C]" />
              <div>
                <p className="font-semibold text-[#10271C]">Morning</p>
                <p className="text-sm text-[#666]">5 AM – 7 AM</p>
              </div>
            </div>
          </div>
        </section>

        <div className="lg:hidden">
          <OrderSummary order={order} variant="checkout" />
        </div>

        <motion.button
          type="submit"
          disabled={loading || success}
          className="w-full py-4 rounded-2xl font-semibold text-white text-lg disabled:opacity-70"
          style={{ background: "#10271C" }}
          whileHover={{ scale: loading ? 1 : 1.02, y: loading ? 0 : -2 }}
          whileTap={{ scale: loading ? 1 : 0.98 }}
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <Loader2 className="w-5 h-5 animate-spin" />
              Processing...
            </span>
          ) : (
            "Proceed to Pay"
          )}
        </motion.button>
      </form>

      <AnimatePresence>
        {success && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-[#10271C]/60 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="bg-white rounded-3xl p-10 text-center shadow-2xl mx-4"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 400 }}
              >
                <CheckCircle2 className="w-16 h-16 text-[#25d366] mx-auto mb-4" />
              </motion.div>
              <h3 className="font-serif text-2xl font-semibold text-[#10271C] mb-2">
                Order Ready!
              </h3>
              <p className="text-[#666]">Redirecting you to WhatsApp...</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function Field({
  label,
  required,
  error,
  children,
  className,
}: {
  label: string;
  required?: boolean;
  error?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={className}>
      <label className="block text-sm font-medium text-[#10271C] mb-1.5">
        {label}
        {required && <span className="text-[#D4AF37] ml-0.5">*</span>}
      </label>
      {children}
      {error && (
        <motion.p
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-xs text-red-600 mt-1"
        >
          {error}
        </motion.p>
      )}
    </div>
  );
}

function inputClass(error?: string) {
  return clsx(
    "w-full px-4 py-3 rounded-xl border bg-white text-[#10271C] placeholder:text-[#999] focus:outline-none focus:ring-2 transition-shadow",
    error
      ? "border-red-400 focus:ring-red-200"
      : "border-[#10271C]/15 focus:ring-[#D4AF37]/40"
  );
}
