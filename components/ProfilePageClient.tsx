"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Edit2, LogOut, RefreshCw, ChevronDown, ChevronUp,
  Package, Calendar, Repeat,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

// ─── helpers ────────────────────────────────────────────────────────────────
function fmt(date: string | Date) {
  return new Date(date).toLocaleDateString("en-IN", {
    day: "numeric", month: "short", year: "numeric",
  });
}

// ─── status colour maps ──────────────────────────────────────────────────────
const ORDER_STATUS_COLORS: Record<string, string> = {
  Delivered:          "bg-green-100 text-green-700",
  "Out for Delivery": "bg-blue-100 text-blue-700",
  Preparing:          "bg-yellow-100 text-yellow-700",
  Confirmed:          "bg-purple-100 text-purple-700",
  Pending:            "bg-gray-100 text-gray-600",
  Cancelled:          "bg-red-100 text-red-600",
};

const SUB_STATUS_COLORS: Record<string, string> = {
  Active:    "bg-green-100 text-green-700",
  Paused:    "bg-yellow-100 text-yellow-700",
  Cancelled: "bg-red-100 text-red-600",
  Expired:   "bg-gray-100 text-gray-600",
};

const DAY_STATUS_COLORS: Record<string, string> = {
  Pending:            "bg-gray-100 text-gray-500",
  "Out for Delivery": "bg-blue-100 text-blue-700",
  Delivered:          "bg-green-100 text-green-700",
  Skipped:            "bg-orange-100 text-orange-600",
};

const ORDER_STEPS = ["Pending", "Confirmed", "Preparing", "Out for Delivery", "Delivered"];

// ─── One-time order status tracker ──────────────────────────────────────────
function StatusTracker({ status }: { status: string }) {
  if (status === "Cancelled") {
    return (
      <span className="text-xs px-3 py-1 rounded-full bg-red-100 text-red-600 font-medium">
        Order Cancelled
      </span>
    );
  }
  const current = ORDER_STEPS.indexOf(status);
  return (
    <div>
      <div className="flex items-center gap-1">
        {ORDER_STEPS.map((step, idx) => {
          const done   = idx <= current;
          const active = idx === current;
          return (
            <div key={step} className="flex items-center gap-1 flex-1 min-w-0">
              <div className={`w-2.5 h-2.5 rounded-full border-2 flex-shrink-0 transition-all ${
                done
                  ? active ? "bg-[#10271C] border-[#10271C] scale-125" : "bg-[#10271C] border-[#10271C]"
                  : "bg-white border-[#10271C]/20"
              }`} />
              {idx < ORDER_STEPS.length - 1 && (
                <div className={`h-0.5 flex-1 rounded ${idx < current ? "bg-[#10271C]" : "bg-[#10271C]/15"}`} />
              )}
            </div>
          );
        })}
      </div>
      <div className="flex justify-between mt-1">
        {ORDER_STEPS.map(s => (
          <span key={s} className="text-[9px] text-[#999] text-center" style={{ width: "20%" }}>{s}</span>
        ))}
      </div>
    </div>
  );
}

// ─── One-time order card ─────────────────────────────────────────────────────
function OrderCard({ order }: { order: any }) {
  const [open, setOpen] = useState(false);
  return (
    <motion.div layout className="rounded-2xl border border-[#10271C]/10 bg-white overflow-hidden">
      <button
        className="w-full flex items-start justify-between gap-3 p-4 text-left hover:bg-[#F8F6F0]/60 transition-colors"
        onClick={() => setOpen(v => !v)}
      >
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-9 h-9 rounded-xl bg-[#10271C]/8 flex items-center justify-center flex-shrink-0">
            <Package className="w-4 h-4 text-[#10271C]" />
          </div>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-1.5 mb-0.5">
              <span className="font-mono text-xs font-bold text-[#10271C] bg-[#10271C]/8 px-2 py-0.5 rounded-lg">
                {order.orderId}
              </span>
              <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${ORDER_STATUS_COLORS[order.status] || "bg-gray-100 text-gray-600"}`}>
                {order.status}
              </span>
            </div>
            <p className="text-sm font-medium text-[#10271C] truncate">{order.productName}</p>
            <p className="text-xs text-[#888]">{order.quantity}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <div className="text-right">
            <p className="font-semibold text-[#10271C] text-sm">₹{order.amount?.toLocaleString("en-IN")}</p>
            <p className="text-xs text-[#888]">{fmt(order.createdAt)}</p>
          </div>
          {open ? <ChevronUp className="w-4 h-4 text-[#666]" /> : <ChevronDown className="w-4 h-4 text-[#666]" />}
        </div>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="detail"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22 }}
            className="overflow-hidden border-t border-[#10271C]/6"
          >
            <div className="px-4 pb-4 pt-3 space-y-3">
              <StatusTracker status={order.status} />
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-xs text-[#888]">Order Type</p>
                  <p className="font-medium text-[#10271C] capitalize">{order.orderType || "—"}</p>
                </div>
                {order.deliveryCharge > 0 && (
                  <div>
                    <p className="text-xs text-[#888]">Delivery Charge</p>
                    <p className="font-medium text-[#10271C]">₹{order.deliveryCharge}</p>
                  </div>
                )}
                <div>
                  <p className="text-xs text-[#888]">Grand Total</p>
                  <p className="font-bold text-[#10271C]">₹{order.amount?.toLocaleString("en-IN")}</p>
                </div>
                <div>
                  <p className="text-xs text-[#888]">Placed On</p>
                  <p className="font-medium text-[#10271C]">{fmt(order.createdAt)}</p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ─── Subscription delivery calendar ─────────────────────────────────────────
function SubDeliveryCalendar({ deliveries }: { deliveries: any[] }) {
  const [page, setPage] = useState(0);
  const PAGE = 10;
  const pages   = Math.ceil(deliveries.length / PAGE);
  const visible = deliveries.slice(page * PAGE, page * PAGE + PAGE);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (deliveries.length === 0) {
    return <p className="text-xs text-[#888] py-2">No delivery schedule yet.</p>;
  }

  return (
    <div className="space-y-2 mt-2">
      <div className="overflow-x-auto rounded-xl border border-[#10271C]/8">
        <table className="w-full text-xs">
          <thead>
            <tr className="bg-[#F8F6F0] border-b border-[#10271C]/8">
              <th className="px-3 py-2 text-left font-semibold text-[#666] uppercase tracking-wider">Day</th>
              <th className="px-3 py-2 text-left font-semibold text-[#666] uppercase tracking-wider">Date</th>
              <th className="px-3 py-2 text-left font-semibold text-[#666] uppercase tracking-wider">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#10271C]/5">
            {visible.map((d: any) => {
              const dDate = new Date(d.deliveryDate);
              dDate.setHours(0, 0, 0, 0);
              const isToday = dDate.getTime() === today.getTime();
              return (
                <tr key={d._id} className={isToday ? "bg-[#D4AF37]/8" : ""}>
                  <td className="px-3 py-2 font-mono font-semibold text-[#10271C]">
                    {isToday && <span className="text-[#D4AF37] mr-1 text-[9px] font-bold uppercase">Today</span>}
                    #{d.dayNumber}
                  </td>
                  <td className="px-3 py-2 text-[#555] whitespace-nowrap">{fmt(d.deliveryDate)}</td>
                  <td className="px-3 py-2">
                    <span className={`text-[11px] px-2 py-0.5 rounded-full font-medium ${DAY_STATUS_COLORS[d.status] || "bg-gray-100 text-gray-500"}`}>
                      {d.status}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {pages > 1 && (
        <div className="flex items-center justify-between text-xs text-[#666]">
          <span>Days {page * PAGE + 1}–{Math.min((page + 1) * PAGE, deliveries.length)} of {deliveries.length}</span>
          <div className="flex gap-1.5">
            <button disabled={page === 0} onClick={() => setPage(p => p - 1)}
              className="px-2.5 py-1 rounded-lg border border-[#10271C]/10 disabled:opacity-40 hover:bg-[#F8F6F0]">←</button>
            <button disabled={page === pages - 1} onClick={() => setPage(p => p + 1)}
              className="px-2.5 py-1 rounded-lg border border-[#10271C]/10 disabled:opacity-40 hover:bg-[#F8F6F0]">→</button>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Subscription card ───────────────────────────────────────────────────────
function SubscriptionCard({ sub }: { sub: any }) {
  const [open, setOpen] = useState(false);
  const deliveries: any[] = sub.deliveries || [];
  const completed = deliveries.filter((d: any) => d.status === "Delivered").length;
  const total     = sub.totalDays || deliveries.length;
  const progress  = total > 0 ? Math.round((completed / total) * 100) : 0;

  return (
    <motion.div layout className="rounded-2xl border border-[#10271C]/10 bg-white overflow-hidden">
      <button
        className="w-full flex items-start justify-between gap-3 p-4 text-left hover:bg-[#F8F6F0]/60 transition-colors"
        onClick={() => setOpen(v => !v)}
      >
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-9 h-9 rounded-xl bg-[#D4AF37]/15 flex items-center justify-center flex-shrink-0">
            <Repeat className="w-4 h-4 text-[#856A20]" />
          </div>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-1.5 mb-0.5">
              <span className="font-mono text-xs font-bold text-[#10271C] bg-[#10271C]/8 px-2 py-0.5 rounded-lg">
                #{sub._id?.slice(-6).toUpperCase()}
              </span>
              <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${SUB_STATUS_COLORS[sub.status] || "bg-gray-100 text-gray-600"}`}>
                {sub.status}
              </span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-[#D4AF37]/15 text-[#856A20] font-medium">
                {sub.plan}
              </span>
            </div>
            <p className="text-sm font-medium text-[#10271C] truncate">{sub.productName}</p>
            <p className="text-xs text-[#888]">{sub.quantity}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <div className="text-right">
            <p className="font-semibold text-[#10271C] text-sm">₹{sub.amount?.toLocaleString("en-IN")}</p>
            <p className="text-xs text-[#888]">{total} days</p>
          </div>
          {open ? <ChevronUp className="w-4 h-4 text-[#666]" /> : <ChevronDown className="w-4 h-4 text-[#666]" />}
        </div>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="subdetail"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22 }}
            className="overflow-hidden border-t border-[#10271C]/6"
          >
            <div className="px-4 pb-4 pt-3 space-y-4">
              {/* Dates + progress */}
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-xs text-[#888]">Start Date</p>
                  <p className="font-medium text-[#10271C]">{fmt(sub.startDate)}</p>
                </div>
                <div>
                  <p className="text-xs text-[#888]">End Date</p>
                  <p className="font-medium text-[#10271C]">{fmt(sub.endDate)}</p>
                </div>
              </div>

              {/* Progress bar */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-[#888]">Delivery Progress</span>
                  <span className="text-xs font-semibold text-[#10271C]">{completed}/{total} delivered</span>
                </div>
                <div className="h-2 rounded-full bg-[#10271C]/10 overflow-hidden">
                  <motion.div
                    className="h-full rounded-full bg-[#10271C]"
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                  />
                </div>
              </div>

              {/* Delivery schedule */}
              <div>
                <div className="flex items-center gap-1.5 mb-1">
                  <Calendar className="w-3.5 h-3.5 text-[#10271C]" />
                  <span className="text-xs font-semibold text-[#10271C] uppercase tracking-wider">
                    Daily Delivery Schedule
                  </span>
                </div>
                <SubDeliveryCalendar deliveries={deliveries} />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ─── Main profile page ───────────────────────────────────────────────────────
export default function ProfilePageClient() {
  const router = useRouter();
  const { user, logout, updateProfile, isLoading } = useAuth();

  const [editing, setEditing] = useState(false);
  const [saving,  setSaving]  = useState(false);
  const [formData, setFormData] = useState({ name: "", phone: "", email: "", address: "" });

  // Orders + subscriptions
  const [activeTab,       setActiveTab]       = useState<"one-time" | "subscription">("subscription");
  const [orders,          setOrders]          = useState<any[]>([]);
  const [subscriptions,   setSubscriptions]   = useState<any[]>([]);
  const [ordersLoading,   setOrdersLoading]   = useState(false);
  const [subsLoading,     setSubsLoading]     = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({ name: user.name || "", phone: user.phone || "", email: user.email || "", address: user.address || "" });
      fetchOrders();
      fetchSubscriptions();
    }
  }, [user]);

  const fetchOrders = useCallback(async () => {
    const token = localStorage.getItem("token");
    if (!token) return;
    setOrdersLoading(true);
    try {
      const res = await fetch("/api/orders/user", { headers: { Authorization: `Bearer ${token}` } });
      const data = await res.json();
      // Filter to one-time only; subscriptions handled separately
      setOrders((data.orders || []).filter((o: any) => o.orderType === "one-time"));
    } catch { setOrders([]); }
    finally { setOrdersLoading(false); }
  }, []);

  const fetchSubscriptions = useCallback(async () => {
    const token = localStorage.getItem("token");
    if (!token) return;
    setSubsLoading(true);
    try {
      const res = await fetch("/api/subscriptions/user", { headers: { Authorization: `Bearer ${token}` } });
      const data = await res.json();
      setSubscriptions(data.subscriptions || []);
    } catch { setSubscriptions([]); }
    finally { setSubsLoading(false); }
  }, []);

  const handleRefresh = () => {
    fetchOrders();
    fetchSubscriptions();
  };

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

  const handleLogout = () => { logout(); router.push("/"); };

  const handleSave = async () => {
    setSaving(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("/api/users/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(formData),
      });
      if (!res.ok) throw new Error();
      await updateProfile(formData);
      setEditing(false);
    } catch { alert("Failed to update profile."); }
    finally { setSaving(false); }
  };

  const totalOrders = orders.length;
  const totalSubs   = subscriptions.length;

  return (
    <motion.main className="min-h-screen bg-[#F8F6F0]" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="px-[5%] py-12">
        <div className="max-w-3xl mx-auto space-y-6">

          {/* Back */}
          <motion.button onClick={() => router.push("/")}
            className="flex items-center gap-2 text-[#10271C] font-medium hover:text-[#D4AF37] transition-colors text-sm"
            whileHover={{ x: -4 }}>
            ← Back to Home
          </motion.button>

          {/* Profile header */}
          <motion.div className="rounded-[28px] bg-white p-8 shadow-[0_20px_60px_rgba(0,0,0,.08)]"
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
              <div className="w-20 h-20 rounded-full bg-[#10271C] flex items-center justify-center text-white text-3xl font-serif flex-shrink-0">
                {user.name?.[0]?.toUpperCase() || "U"}
              </div>
              <div className="flex-1">
                <h1 className="font-serif text-2xl font-semibold text-[#10271C]">{user.name}</h1>
                <p className="text-[#666] text-sm mt-0.5">{user.email}</p>
                <p className="text-[#888] text-sm">{user.phone}</p>
              </div>
              <motion.button onClick={() => setEditing(v => !v)}
                className="flex items-center gap-2 px-4 py-2 rounded-full border border-[#10271C]/20 text-[#10271C] text-sm font-medium hover:bg-[#10271C]/5"
                whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Edit2 className="w-4 h-4" />
                {editing ? "Cancel" : "Edit Profile"}
              </motion.button>
            </div>
          </motion.div>

          {/* Personal info */}
          <motion.div className="rounded-[28px] bg-white p-8 shadow-[0_20px_60px_rgba(0,0,0,.08)]"
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
            <h2 className="font-serif text-xl font-semibold text-[#10271C] mb-6">Personal Information</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {[
                { label: "Full Name",     field: "name",    type: "text"  },
                { label: "Phone Number",  field: "phone",   type: "tel"   },
                { label: "Email",         field: "email",   type: "email" },
              ].map(({ label, field, type }) => (
                <div key={field}>
                  <label className="block text-sm font-medium text-[#666] mb-1.5">{label}</label>
                  <input type={type} value={formData[field as keyof typeof formData]}
                    onChange={e => setFormData(p => ({ ...p, [field]: e.target.value }))}
                    disabled={!editing}
                    className="w-full px-4 py-3 rounded-xl border border-[#10271C]/10 focus:outline-none focus:border-[#D4AF37] transition-colors disabled:bg-[#F8F6F0] text-sm" />
                </div>
              ))}
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-[#666] mb-1.5">Address</label>
                <input type="text" value={formData.address}
                  onChange={e => setFormData(p => ({ ...p, address: e.target.value }))}
                  disabled={!editing}
                  className="w-full px-4 py-3 rounded-xl border border-[#10271C]/10 focus:outline-none focus:border-[#D4AF37] transition-colors disabled:bg-[#F8F6F0] text-sm" />
              </div>
            </div>
            <AnimatePresence>
              {editing && (
                <motion.button initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 6 }}
                  onClick={handleSave} disabled={saving}
                  className="mt-6 px-6 py-3 rounded-full bg-[#10271C] text-white font-semibold text-sm disabled:opacity-50"
                  whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
                  {saving ? "Saving…" : "Save Changes"}
                </motion.button>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Orders + Subscriptions */}
          <motion.div className="rounded-[28px] bg-white p-8 shadow-[0_20px_60px_rgba(0,0,0,.08)]"
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>

            {/* Section header */}
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-serif text-xl font-semibold text-[#10271C]">My Orders</h2>
              <button onClick={handleRefresh} disabled={ordersLoading || subsLoading}
                className="flex items-center gap-1.5 text-sm text-[#10271C] font-medium hover:text-[#D4AF37] disabled:opacity-50">
                <RefreshCw className={`w-4 h-4 ${(ordersLoading || subsLoading) ? "animate-spin" : ""}`} />
                Refresh
              </button>
            </div>

            {/* Tabs */}
            <div className="flex gap-1 p-1 rounded-xl bg-[#F8F6F0] mb-6">
              {([
                { key: "subscription", label: "Subscriptions", icon: Repeat,  count: totalSubs },
                { key: "one-time",     label: "One-Time",       icon: Package, count: totalOrders },
              ] as const).map(({ key, label, icon: Icon, count }) => (
                <button key={key}
                  onClick={() => setActiveTab(key)}
                  className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all ${
                    activeTab === key
                      ? "bg-white text-[#10271C] shadow-sm"
                      : "text-[#666] hover:text-[#10271C]"
                  }`}>
                  <Icon className="w-4 h-4" />
                  {label}
                  <span className={`text-xs px-1.5 py-0.5 rounded-full font-semibold ${
                    activeTab === key ? "bg-[#10271C] text-white" : "bg-[#10271C]/10 text-[#10271C]"
                  }`}>
                    {count}
                  </span>
                </button>
              ))}
            </div>

            {/* Subscription tab */}
            <AnimatePresence mode="wait">
              {activeTab === "subscription" && (
                <motion.div key="subs"
                  initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.2 }}>
                  {subsLoading ? (
                    <div className="flex justify-center py-12">
                      <RefreshCw className="w-5 h-5 animate-spin text-[#666]" />
                    </div>
                  ) : subscriptions.length === 0 ? (
                    <div className="text-center py-12">
                      <Repeat className="w-12 h-12 text-[#10271C]/15 mx-auto mb-3" />
                      <p className="font-medium text-[#666]">No subscriptions yet</p>
                      <p className="text-sm text-[#999] mt-1 mb-5">Subscribe to daily milk delivery</p>
                      <motion.button onClick={() => router.push("/#products")}
                        className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#10271C] text-white font-semibold text-sm"
                        whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
                        Browse Products
                      </motion.button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {subscriptions.map(sub => (
                        <SubscriptionCard key={sub._id} sub={sub} />
                      ))}
                    </div>
                  )}
                </motion.div>
              )}

              {/* One-time tab */}
              {activeTab === "one-time" && (
                <motion.div key="orders"
                  initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.2 }}>
                  {ordersLoading ? (
                    <div className="flex justify-center py-12">
                      <RefreshCw className="w-5 h-5 animate-spin text-[#666]" />
                    </div>
                  ) : orders.length === 0 ? (
                    <div className="text-center py-12">
                      <Package className="w-12 h-12 text-[#10271C]/15 mx-auto mb-3" />
                      <p className="font-medium text-[#666]">No one-time orders yet</p>
                      <p className="text-sm text-[#999] mt-1 mb-5">Place a one-time order from our products</p>
                      <motion.button onClick={() => router.push("/#products")}
                        className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#10271C] text-white font-semibold text-sm"
                        whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
                        Browse Products
                      </motion.button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {orders.map(order => (
                        <OrderCard key={order._id} order={order} />
                      ))}
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Settings */}
          <motion.div className="rounded-[28px] bg-white p-8 shadow-[0_20px_60px_rgba(0,0,0,.08)]"
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
            <h2 className="font-serif text-xl font-semibold text-[#10271C] mb-6">Settings</h2>
            <div className="space-y-2">
              {["Notification Preferences", "Privacy Settings"].map(label => (
                <motion.button key={label}
                  className="w-full flex items-center justify-between p-4 rounded-xl border border-[#10271C]/8 text-left hover:bg-[#F8F6F0] text-sm font-medium text-[#10271C]"
                  whileHover={{ x: 4 }}>
                  {label}<span className="text-[#999]">→</span>
                </motion.button>
              ))}
            </div>
            <div className="mt-6 pt-5 border-t border-[#10271C]/8">
              <motion.button onClick={handleLogout}
                className="w-full flex items-center justify-center gap-2 py-3.5 rounded-full border-2 border-red-500 text-red-500 font-semibold text-sm hover:bg-red-500 hover:text-white transition-all"
                whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <LogOut className="w-4 h-4" />Logout
              </motion.button>
            </div>
          </motion.div>

        </div>
      </div>
    </motion.main>
  );
}
