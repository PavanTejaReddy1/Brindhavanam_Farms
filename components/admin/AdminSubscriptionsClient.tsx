"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import AdminLayout from "./AdminLayout";
import AdminProtectedRoute from "./AdminProtectedRoute";
import { fetchWithAdminAuth } from "@/lib/api";
import {
  Search, Filter, RefreshCw, X, ChevronDown, ChevronUp,
  Play, Pause, Calendar, User, Phone, MapPin, Package,
} from "lucide-react";

const SUB_STATUS_COLORS: Record<string, string> = {
  Active:    "bg-green-100 text-green-700",
  Paused:    "bg-yellow-100 text-yellow-700",
  Cancelled: "bg-red-100 text-red-700",
  Expired:   "bg-gray-100 text-gray-600",
};

const DAY_STATUS_COLORS: Record<string, string> = {
  Pending:          "bg-gray-100 text-gray-600",
  "Out for Delivery": "bg-blue-100 text-blue-700",
  Delivered:        "bg-green-100 text-green-700",
  Skipped:          "bg-orange-100 text-orange-600",
};

const DAY_STATUS_OPTIONS = ["Pending", "Out for Delivery", "Delivered", "Skipped"];

function fmt(date: string | Date) {
  return new Date(date).toLocaleDateString("en-IN", {
    day: "numeric", month: "short", year: "numeric",
  });
}

function DeliveryCalendar({
  subId,
  deliveries: initial,
}: {
  subId: string;
  deliveries: any[];
}) {
  const [deliveries, setDeliveries] = useState<any[]>(initial);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [page, setPage]             = useState(0);
  const PAGE = 10;
  const pages = Math.ceil(deliveries.length / PAGE);
  const visible = deliveries.slice(page * PAGE, page * PAGE + PAGE);

  const updateStatus = async (dayId: string, status: string) => {
    setUpdatingId(dayId);
    try {
      const res = await fetchWithAdminAuth(
        `/api/subscriptions/${subId}/deliveries/${dayId}`,
        { method: "PUT", body: JSON.stringify({ status }) }
      );
      setDeliveries(prev =>
        prev.map(d => d._id === dayId ? { ...d, status } : d)
      );
    } catch (e) {
      console.error("Failed to update delivery day:", e);
    } finally {
      setUpdatingId(null);
    }
  };

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return (
    <div className="mt-4 space-y-3">
      {/* Delivery grid */}
      <div className="overflow-x-auto rounded-2xl border border-[#10271C]/8">
        <table className="w-full text-xs">
          <thead>
            <tr className="bg-[#F8F6F0] border-b border-[#10271C]/8">
              <th className="px-4 py-2.5 text-left font-semibold text-[#666] uppercase tracking-wider">Day</th>
              <th className="px-4 py-2.5 text-left font-semibold text-[#666] uppercase tracking-wider">Date</th>
              <th className="px-4 py-2.5 text-left font-semibold text-[#666] uppercase tracking-wider">Status</th>
              <th className="px-4 py-2.5 text-left font-semibold text-[#666] uppercase tracking-wider">Note</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#10271C]/5">
            {visible.map((d: any) => {
              const dDate = new Date(d.deliveryDate);
              dDate.setHours(0, 0, 0, 0);
              const isPast   = dDate < today;
              const isToday  = dDate.getTime() === today.getTime();
              return (
                <tr
                  key={d._id}
                  className={`transition-colors ${isToday ? "bg-[#D4AF37]/8" : "hover:bg-[#F8F6F0]/60"}`}
                >
                  <td className="px-4 py-2.5 font-mono font-semibold text-[#10271C]">
                    {isToday && (
                      <span className="mr-1 text-[#D4AF37] text-[9px] font-bold uppercase tracking-wider">Today</span>
                    )}
                    #{d.dayNumber}
                  </td>
                  <td className="px-4 py-2.5 text-[#555] whitespace-nowrap">{fmt(d.deliveryDate)}</td>
                  <td className="px-4 py-2.5">
                    <select
                      value={d.status}
                      onChange={e => updateStatus(d._id, e.target.value)}
                      disabled={updatingId === d._id}
                      className={`text-[11px] font-semibold px-2.5 py-1 rounded-full border-0 cursor-pointer
                        focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/40 disabled:opacity-50
                        ${DAY_STATUS_COLORS[d.status] || "bg-gray-100 text-gray-600"}`}
                    >
                      {DAY_STATUS_OPTIONS.map(s => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </td>
                  <td className="px-4 py-2.5 text-[#888]">
                    {d.note || <span className="text-[#bbb]">—</span>}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {pages > 1 && (
        <div className="flex items-center justify-between text-xs text-[#666]">
          <span>Showing days {page * PAGE + 1}–{Math.min((page + 1) * PAGE, deliveries.length)} of {deliveries.length}</span>
          <div className="flex gap-2">
            <button
              disabled={page === 0}
              onClick={() => setPage(p => p - 1)}
              className="px-3 py-1 rounded-lg border border-[#10271C]/10 disabled:opacity-40 hover:bg-[#F8F6F0]"
            >
              ←
            </button>
            <button
              disabled={page === pages - 1}
              onClick={() => setPage(p => p + 1)}
              className="px-3 py-1 rounded-lg border border-[#10271C]/10 disabled:opacity-40 hover:bg-[#F8F6F0]"
            >
              →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function SubscriptionCard({ sub, onStatusChange, onDelete }: {
  sub: any;
  onStatusChange: (id: string, status: string) => void;
  onDelete: (id: string) => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const [deliveries, setDeliveries] = useState<any[] | null>(null);
  const [loadingDeliveries, setLoadingDeliveries] = useState(false);

  const loadDeliveries = useCallback(async () => {
    if (deliveries !== null) return; // already loaded
    setLoadingDeliveries(true);
    try {
      const data = await fetchWithAdminAuth(`/api/subscriptions/${sub._id}/deliveries`);
      setDeliveries(data.deliveries || []);
    } catch {
      setDeliveries([]);
    } finally {
      setLoadingDeliveries(false);
    }
  }, [sub._id, deliveries]);

  const handleExpand = () => {
    setExpanded(v => !v);
    if (!expanded) loadDeliveries();
  };

  const completed  = (deliveries || []).filter((d: any) => d.status === "Delivered").length;
  const total      = sub.totalDays || 0;
  const progress   = total > 0 ? Math.round((completed / total) * 100) : 0;

  return (
    <motion.div
      layout
      className="rounded-[20px] bg-white shadow-[0_4px_20px_rgba(0,0,0,.06)] overflow-hidden"
    >
      {/* Card header */}
      <div className="p-5 flex flex-col sm:flex-row sm:items-start gap-4">
        {/* Left: sub info */}
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span className="font-mono text-xs font-bold bg-[#10271C]/8 text-[#10271C] px-2 py-0.5 rounded-lg">
              #{sub._id?.slice(-6).toUpperCase()}
            </span>
            <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${SUB_STATUS_COLORS[sub.status] || "bg-gray-100 text-gray-600"}`}>
              {sub.status}
            </span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-[#D4AF37]/15 text-[#856A20] font-medium">
              {sub.plan}
            </span>
          </div>

          <h3 className="font-semibold text-[#10271C] text-sm">{sub.productName}</h3>
          <p className="text-xs text-[#666] mt-0.5">{sub.quantity}</p>

          {/* Customer */}
          <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2">
            <span className="flex items-center gap-1 text-xs text-[#555]">
              <User className="w-3 h-3" />{sub.customerName}
            </span>
            <span className="flex items-center gap-1 text-xs text-[#555]">
              <Phone className="w-3 h-3" />{sub.customerPhone}
            </span>
          </div>

          {/* Dates */}
          <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1.5">
            <span className="flex items-center gap-1 text-xs text-[#888]">
              <Calendar className="w-3 h-3" />
              {fmt(sub.startDate)} → {fmt(sub.endDate)}
            </span>
            <span className="flex items-center gap-1 text-xs text-[#888]">
              <Package className="w-3 h-3" />
              {total} days · ₹{sub.amount?.toLocaleString("en-IN")}
            </span>
          </div>

          {/* Delivery progress bar */}
          {total > 0 && (
            <div className="mt-3">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] text-[#888]">Delivery Progress</span>
                <span className="text-[10px] font-semibold text-[#10271C]">{completed}/{total} delivered</span>
              </div>
              <div className="h-1.5 rounded-full bg-[#10271C]/10 overflow-hidden">
                <div
                  className="h-full rounded-full bg-[#10271C] transition-all"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Right: actions */}
        <div className="flex sm:flex-col items-center gap-2 flex-shrink-0">
          {sub.status === "Active" ? (
            <button
              onClick={() => onStatusChange(sub._id, "Paused")}
              title="Pause"
              className="p-2 rounded-xl hover:bg-yellow-50 transition-colors"
            >
              <Pause className="w-4 h-4 text-yellow-600" />
            </button>
          ) : sub.status === "Paused" ? (
            <button
              onClick={() => onStatusChange(sub._id, "Active")}
              title="Resume"
              className="p-2 rounded-xl hover:bg-green-50 transition-colors"
            >
              <Play className="w-4 h-4 text-green-600" />
            </button>
          ) : null}
          <button
            onClick={() => onDelete(sub._id)}
            title="Cancel / Delete"
            className="p-2 rounded-xl hover:bg-red-50 transition-colors"
          >
            <X className="w-4 h-4 text-red-400" />
          </button>
          <button
            onClick={handleExpand}
            title="View deliveries"
            className="p-2 rounded-xl hover:bg-[#F8F6F0] transition-colors"
          >
            {expanded
              ? <ChevronUp className="w-4 h-4 text-[#666]" />
              : <ChevronDown className="w-4 h-4 text-[#666]" />}
          </button>
        </div>
      </div>

      {/* Delivery calendar (expandable) */}
      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            key="calendar"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden border-t border-[#10271C]/8"
          >
            <div className="px-5 pb-5">
              <div className="flex items-center justify-between mt-4 mb-2">
                <span className="text-xs font-semibold text-[#10271C] uppercase tracking-wider">
                  Daily Delivery Schedule
                </span>
                <span className="text-xs text-[#888]">
                  Click a status to update it instantly
                </span>
              </div>

              {loadingDeliveries ? (
                <p className="text-xs text-[#888] py-4 text-center">Loading schedule…</p>
              ) : deliveries && deliveries.length > 0 ? (
                <DeliveryCalendar subId={sub._id} deliveries={deliveries} />
              ) : (
                <p className="text-xs text-[#888] py-4 text-center">No delivery days found</p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function AdminSubscriptionsClient() {
  const [subscriptions, setSubscriptions] = useState<any[]>([]);
  const [searchTerm,    setSearchTerm]    = useState("");
  const [statusFilter,  setStatusFilter]  = useState("All");
  const [loading,       setLoading]       = useState(true);

  useEffect(() => { fetchSubscriptions(); }, [statusFilter]);

  const fetchSubscriptions = async () => {
    setLoading(true);
    try {
      const url = statusFilter === "All"
        ? "/api/subscriptions"
        : `/api/subscriptions?status=${statusFilter}`;
      const data = await fetchWithAdminAuth(url);
      setSubscriptions(data.subscriptions || []);
    } catch (e) {
      console.error("fetchSubscriptions error:", e);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id: string, status: string) => {
    try {
      await fetchWithAdminAuth(`/api/subscriptions/${id}`, {
        method: "PUT",
        body: JSON.stringify({ status }),
      });
      setSubscriptions(prev =>
        prev.map(s => s._id === id ? { ...s, status } : s)
      );
    } catch (e) {
      console.error("handleStatusChange error:", e);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this subscription and all its delivery records? This cannot be undone.")) return;
    try {
      await fetchWithAdminAuth(`/api/subscriptions/${id}`, { method: "DELETE" });
      setSubscriptions(prev => prev.filter(s => s._id !== id));
    } catch (e) {
      console.error("handleDelete error:", e);
    }
  };

  const filtered = subscriptions.filter(s =>
    s.productName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.customerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.customerPhone?.includes(searchTerm)
  );

  return (
    <AdminProtectedRoute>
      <AdminLayout>
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="font-serif text-2xl font-bold text-[#10271C]">Subscriptions</h1>
              <p className="text-sm text-[#666]">
                {filtered.length} subscription{filtered.length !== 1 ? "s" : ""}
              </p>
            </div>
            <button
              onClick={fetchSubscriptions}
              className="flex items-center gap-2 px-3 py-2 rounded-xl border border-[#10271C]/10 text-[#10271C] text-sm hover:bg-[#10271C]/5 transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              Refresh
            </button>
          </div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#666]" />
              <input
                type="text"
                placeholder="Search by customer, product or phone…"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 rounded-xl border border-[#10271C]/10 focus:outline-none focus:border-[#D4AF37] text-sm"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-[#666]" />
              <select
                value={statusFilter}
                onChange={e => setStatusFilter(e.target.value)}
                className="px-3 py-2 rounded-xl border border-[#10271C]/10 focus:outline-none focus:border-[#D4AF37] text-sm"
              >
                {["All", "Active", "Paused", "Cancelled", "Expired"].map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Content */}
          {loading ? (
            <div className="flex items-center justify-center h-48">
              <RefreshCw className="w-5 h-5 animate-spin text-[#666]" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-16">
              <p className="font-medium text-[#666]">No subscriptions found</p>
              <p className="text-sm text-[#999] mt-1">
                {searchTerm ? "Try a different search term" : "Subscriptions appear here after checkout"}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filtered.map(sub => (
                <SubscriptionCard
                  key={sub._id}
                  sub={sub}
                  onStatusChange={handleStatusChange}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          )}
        </div>
      </AdminLayout>
    </AdminProtectedRoute>
  );
}
