"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Edit2, LogOut, RefreshCw, ChevronDown, ChevronUp, Package } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const STATUS_COLORS: Record<string, string> = {
  Delivered: "bg-green-100 text-green-700",
  "Out for Delivery": "bg-blue-100 text-blue-700",
  Preparing: "bg-yellow-100 text-yellow-700",
  Confirmed: "bg-purple-100 text-purple-700",
  Pending: "bg-gray-100 text-gray-600",
  Cancelled: "bg-red-100 text-red-600",
};

const STATUS_STEPS = [
  "Pending",
  "Confirmed",
  "Preparing",
  "Out for Delivery",
  "Delivered",
];

function StatusTracker({ status }: { status: string }) {
  if (status === "Cancelled") {
    return (
      <div className="flex items-center gap-2 mt-3">
        <span className="text-xs px-3 py-1 rounded-full bg-red-100 text-red-600 font-medium">
          Order Cancelled
        </span>
      </div>
    );
  }
  const currentIdx = STATUS_STEPS.indexOf(status);
  return (
    <div className="mt-3 flex items-center gap-1">
      {STATUS_STEPS.map((step, idx) => {
        const done = idx <= currentIdx;
        const active = idx === currentIdx;
        return (
          <div key={step} className="flex items-center gap-1 flex-1 min-w-0">
            <div className="flex flex-col items-center flex-shrink-0">
              <div
                className={`w-3 h-3 rounded-full border-2 transition-all ${
                  done
                    ? active
                      ? "bg-[#10271C] border-[#10271C] scale-125"
                      : "bg-[#10271C] border-[#10271C]"
                    : "bg-white border-[#10271C]/20"
                }`}
              />
            </div>
            {idx < STATUS_STEPS.length - 1 && (
              <div
                className={`h-0.5 flex-1 rounded transition-all ${
                  idx < currentIdx ? "bg-[#10271C]" : "bg-[#10271C]/15"
                }`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

function OrderCard({ order }: { order: any }) {
  const [expanded, setExpanded] = useState(false);
  const statusClass = STATUS_COLORS[order.status] || "bg-gray-100 text-gray-600";

  return (
    <motion.div
      layout
      className="rounded-2xl border border-[#10271C]/10 bg-white overflow-hidden"
    >
      {/* Header row */}
      <button
        className="w-full flex items-start justify-between gap-4 p-4 text-left hover:bg-[#F8F6F0]/60 transition-colors"
        onClick={() => setExpanded((v) => !v)}
      >
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-9 h-9 rounded-xl bg-[#10271C]/8 flex items-center justify-center flex-shrink-0">
            <Package className="w-4 h-4 text-[#10271C]" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-mono text-xs font-bold text-[#10271C] bg-[#10271C]/8 px-2 py-0.5 rounded-lg">
                {order.orderId}
              </span>
              <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusClass}`}>
                {order.status}
              </span>
            </div>
            <p className="text-sm font-medium text-[#10271C] mt-0.5 truncate">
              {order.productName}
            </p>
            <p className="text-xs text-[#888]">
              {order.quantity}
              {order.plan ? ` · ${order.plan}` : ""}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3 flex-shrink-0">
          <div className="text-right">
            <p className="font-semibold text-[#10271C] text-sm">
              ₹{order.amount?.toLocaleString("en-IN")}
            </p>
            <p className="text-xs text-[#888]">
              {new Date(order.createdAt).toLocaleDateString("en-IN", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })}
            </p>
          </div>
          {expanded ? (
            <ChevronUp className="w-4 h-4 text-[#666]" />
          ) : (
            <ChevronDown className="w-4 h-4 text-[#666]" />
          )}
        </div>
      </button>

      {/* Expanded detail */}
      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            key="detail"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 border-t border-[#10271C]/6 pt-3 space-y-3">
              {/* Status tracker */}
              <div>
                <p className="text-xs font-semibold text-[#666] uppercase tracking-wider mb-1">
                  Order Progress
                </p>
                <StatusTracker status={order.status} />
                <div className="flex justify-between mt-1">
                  {STATUS_STEPS.map((s) => (
                    <span key={s} className="text-[9px] text-[#999] text-center leading-tight" style={{ width: "20%" }}>
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              {/* Details grid */}
              <div className="grid grid-cols-2 gap-3">
                {order.startDate && (
                  <div>
                    <p className="text-xs text-[#888]">Start Date</p>
                    <p className="text-sm font-medium text-[#10271C]">
                      {new Date(order.startDate).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                )}
                <div>
                  <p className="text-xs text-[#888]">Order Type</p>
                  <p className="text-sm font-medium text-[#10271C] capitalize">
                    {order.orderType || "—"}
                  </p>
                </div>
                {order.deliveryCharge > 0 && (
                  <div>
                    <p className="text-xs text-[#888]">Delivery Charge</p>
                    <p className="text-sm font-medium text-[#10271C]">
                      ₹{order.deliveryCharge}
                    </p>
                  </div>
                )}
                <div>
                  <p className="text-xs text-[#888]">Grand Total</p>
                  <p className="text-sm font-bold text-[#10271C]">
                    ₹{order.amount?.toLocaleString("en-IN")}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function ProfilePageClient() {
  const router = useRouter();
  const { user, logout, updateProfile, isLoading } = useAuth();
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [orders, setOrders] = useState<any[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        phone: user.phone || "",
        email: user.email || "",
        address: user.address || "",
      });
    }
  }, [user]);

  const fetchOrders = useCallback(async () => {
    const token = localStorage.getItem("token");
    if (!token) return;
    setOrdersLoading(true);
    try {
      const res = await fetch("/api/orders/user", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setOrders(data.orders || []);
    } catch {
      setOrders([]);
    } finally {
      setOrdersLoading(false);
    }
  }, []);

  useEffect(() => {
    if (user) fetchOrders();
  }, [user, fetchOrders]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F8F6F0] flex items-center justify-center">
        <p className="text-[#666]">Loading…</p>
      </div>
    );
  }

  if (!user) {
    router.push("/login?redirect=/profile");
    return null;
  }

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  const handleSaveProfile = async () => {
    setSaving(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("/api/users/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });
      if (!res.ok) throw new Error("Update failed");
      await updateProfile(formData);
      setEditing(false);
    } catch {
      alert("Failed to update profile. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <motion.main
      className="min-h-screen bg-[#F8F6F0]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="px-[5%] py-12">
        <div className="max-w-3xl mx-auto space-y-6">
          {/* Back */}
          <motion.button
            onClick={() => router.push("/")}
            className="flex items-center gap-2 text-[#10271C] font-medium hover:text-[#D4AF37] transition-colors text-sm"
            whileHover={{ x: -4 }}
          >
            ← Back to Home
          </motion.button>

          {/* Profile header */}
          <motion.div
            className="rounded-[28px] bg-white p-8 shadow-[0_20px_60px_rgba(0,0,0,.08)]"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
              <div className="w-20 h-20 rounded-full bg-[#10271C] flex items-center justify-center text-white text-3xl font-serif flex-shrink-0">
                {user.name?.[0]?.toUpperCase() || "U"}
              </div>
              <div className="flex-1">
                <h1 className="font-serif text-2xl font-semibold text-[#10271C]">
                  {user.name}
                </h1>
                <p className="text-[#666] text-sm mt-0.5">{user.email}</p>
                <p className="text-[#888] text-sm">{user.phone}</p>
              </div>
              <motion.button
                onClick={() => setEditing((v) => !v)}
                className="flex items-center gap-2 px-4 py-2 rounded-full border border-[#10271C]/20 text-[#10271C] text-sm font-medium hover:bg-[#10271C]/5 transition-all"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Edit2 className="w-4 h-4" />
                {editing ? "Cancel" : "Edit Profile"}
              </motion.button>
            </div>
          </motion.div>

          {/* Personal information */}
          <motion.div
            className="rounded-[28px] bg-white p-8 shadow-[0_20px_60px_rgba(0,0,0,.08)]"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
          >
            <h2 className="font-serif text-xl font-semibold text-[#10271C] mb-6">
              Personal Information
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {[
                { label: "Full Name", field: "name", type: "text" },
                { label: "Phone Number", field: "phone", type: "tel" },
                { label: "Email", field: "email", type: "email" },
              ].map(({ label, field, type }) => (
                <div key={field}>
                  <label className="block text-sm font-medium text-[#666] mb-1.5">
                    {label}
                  </label>
                  <input
                    type={type}
                    value={formData[field as keyof typeof formData]}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, [field]: e.target.value }))
                    }
                    disabled={!editing}
                    className="w-full px-4 py-3 rounded-xl border border-[#10271C]/10 focus:outline-none focus:border-[#D4AF37] transition-colors disabled:bg-[#F8F6F0] text-sm"
                  />
                </div>
              ))}
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-[#666] mb-1.5">
                  Address
                </label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, address: e.target.value }))
                  }
                  disabled={!editing}
                  className="w-full px-4 py-3 rounded-xl border border-[#10271C]/10 focus:outline-none focus:border-[#D4AF37] transition-colors disabled:bg-[#F8F6F0] text-sm"
                />
              </div>
            </div>

            <AnimatePresence>
              {editing && (
                <motion.button
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 6 }}
                  onClick={handleSaveProfile}
                  disabled={saving}
                  className="mt-6 px-6 py-3 rounded-full bg-[#10271C] text-white font-semibold text-sm disabled:opacity-50"
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.97 }}
                >
                  {saving ? "Saving…" : "Save Changes"}
                </motion.button>
              )}
            </AnimatePresence>
          </motion.div>

          {/* My Orders */}
          <motion.div
            className="rounded-[28px] bg-white p-8 shadow-[0_20px_60px_rgba(0,0,0,.08)]"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="font-serif text-xl font-semibold text-[#10271C]">
                  My Orders
                </h2>
                <p className="text-sm text-[#888] mt-0.5">
                  {orders.length} order{orders.length !== 1 ? "s" : ""}
                </p>
              </div>
              <button
                onClick={fetchOrders}
                disabled={ordersLoading}
                className="flex items-center gap-1.5 text-sm text-[#10271C] font-medium hover:text-[#D4AF37] transition-colors disabled:opacity-50"
              >
                <RefreshCw className={`w-4 h-4 ${ordersLoading ? "animate-spin" : ""}`} />
                Refresh
              </button>
            </div>

            {ordersLoading ? (
              <div className="flex items-center justify-center py-12">
                <RefreshCw className="w-5 h-5 animate-spin text-[#666]" />
              </div>
            ) : orders.length === 0 ? (
              <div className="text-center py-12">
                <Package className="w-12 h-12 text-[#10271C]/20 mx-auto mb-3" />
                <p className="font-medium text-[#666]">No orders yet</p>
                <p className="text-sm text-[#999] mt-1 mb-5">
                  Your orders will appear here after checkout
                </p>
                <motion.button
                  onClick={() => router.push("/#products")}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#10271C] text-white font-semibold text-sm"
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.97 }}
                >
                  Browse Products
                </motion.button>
              </div>
            ) : (
              <div className="space-y-3">
                {orders.map((order) => (
                  <OrderCard key={order._id} order={order} />
                ))}
              </div>
            )}
          </motion.div>

          {/* Settings / Logout */}
          <motion.div
            className="rounded-[28px] bg-white p-8 shadow-[0_20px_60px_rgba(0,0,0,.08)]"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
          >
            <h2 className="font-serif text-xl font-semibold text-[#10271C] mb-6">
              Settings
            </h2>
            <div className="space-y-2">
              {[
                "Notification Preferences",
                "Privacy Settings",
              ].map((label) => (
                <motion.button
                  key={label}
                  className="w-full flex items-center justify-between p-4 rounded-xl border border-[#10271C]/8 text-left hover:bg-[#F8F6F0] transition-colors text-sm font-medium text-[#10271C]"
                  whileHover={{ x: 4 }}
                >
                  {label}
                  <span className="text-[#999]">→</span>
                </motion.button>
              ))}
            </div>

            <div className="mt-6 pt-5 border-t border-[#10271C]/8">
              <motion.button
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-2 py-3.5 rounded-full border-2 border-red-500 text-red-500 font-semibold text-sm transition-all hover:bg-red-500 hover:text-white"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <LogOut className="w-4 h-4" />
                Logout
              </motion.button>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.main>
  );
}
