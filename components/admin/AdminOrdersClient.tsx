"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import AdminLayout from "./AdminLayout";
import AdminProtectedRoute from "./AdminProtectedRoute";
import { fetchWithAdminAuth } from "@/lib/api";
import {
  Search, Filter, Download, Trash2, RefreshCw, Eye, X,
  User, Phone, Mail, MapPin, Package, Calendar, CreditCard, Tag
} from "lucide-react";

const STATUS_OPTIONS = [
  "Pending", "Confirmed", "Preparing", "Out for Delivery", "Delivered", "Cancelled",
];

const STATUS_COLORS: Record<string, string> = {
  Delivered: "bg-green-100 text-green-700",
  "Out for Delivery": "bg-blue-100 text-blue-700",
  Preparing: "bg-yellow-100 text-yellow-700",
  Confirmed: "bg-purple-100 text-purple-700",
  Pending: "bg-gray-100 text-gray-700",
  Cancelled: "bg-red-100 text-red-700",
};

const STATUS_STEPS = ["Pending", "Confirmed", "Preparing", "Out for Delivery", "Delivered"];

function DetailRow({ icon: Icon, label, value }: { icon: any; label: string; value: string | number | undefined }) {
  if (!value && value !== 0) return null;
  return (
    <div className="flex items-start gap-3">
      <div className="w-8 h-8 rounded-lg bg-[#10271C]/8 flex items-center justify-center flex-shrink-0 mt-0.5">
        <Icon className="w-4 h-4 text-[#10271C]" />
      </div>
      <div>
        <p className="text-xs text-[#888] uppercase tracking-wider">{label}</p>
        <p className="text-sm font-medium text-[#10271C] mt-0.5">{value}</p>
      </div>
    </div>
  );
}

function OrderDrawer({
  order,
  onClose,
  onStatusChange,
  updating,
}: {
  order: any;
  onClose: () => void;
  onStatusChange: (id: string, status: string) => void;
  updating: boolean;
}) {
  const currentIdx = STATUS_STEPS.indexOf(order.status);

  return (
    <AnimatePresence>
      {order && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed right-0 top-0 bottom-0 z-50 w-full max-w-md bg-white shadow-2xl flex flex-col"
          >
            {/* Drawer header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-[#10271C]/8">
              <div>
                <h2 className="font-serif text-lg font-semibold text-[#10271C]">
                  Order Details
                </h2>
                <span className="font-mono text-xs font-bold text-[#10271C] bg-[#10271C]/8 px-2 py-0.5 rounded-lg">
                  {order.orderId || `#${order._id?.slice(-6).toUpperCase()}`}
                </span>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-xl hover:bg-[#F8F6F0] transition-colors text-[#666]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable body */}
            <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6">

              {/* Status update */}
              <div className="rounded-2xl border border-[#10271C]/10 p-4">
                <p className="text-xs font-semibold text-[#666] uppercase tracking-wider mb-3">
                  Update Status
                </p>

                {/* Progress bar */}
                {order.status !== "Cancelled" && (
                  <div className="mb-4">
                    <div className="flex items-center gap-1">
                      {STATUS_STEPS.map((step, idx) => {
                        const done = idx <= currentIdx;
                        const active = idx === currentIdx;
                        return (
                          <div key={step} className="flex items-center gap-1 flex-1 min-w-0">
                            <div
                              className={`w-3 h-3 rounded-full border-2 flex-shrink-0 transition-all ${
                                done
                                  ? active
                                    ? "bg-[#10271C] border-[#10271C] scale-125"
                                    : "bg-[#10271C] border-[#10271C]"
                                  : "bg-white border-[#10271C]/20"
                              }`}
                            />
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
                    <div className="flex justify-between mt-1">
                      {STATUS_STEPS.map((s) => (
                        <span key={s} className="text-[9px] text-[#999]" style={{ width: "20%", textAlign: "center" }}>
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-3">
                  <select
                    value={order.status}
                    onChange={(e) => onStatusChange(order._id, e.target.value)}
                    disabled={updating}
                    className="flex-1 px-3 py-2.5 rounded-xl border border-[#10271C]/10 focus:outline-none focus:border-[#D4AF37] text-sm font-medium disabled:opacity-50"
                  >
                    {STATUS_OPTIONS.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                  <span
                    className={`text-xs px-3 py-1.5 rounded-full font-semibold whitespace-nowrap ${
                      STATUS_COLORS[order.status] || "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {updating ? "Saving…" : order.status}
                  </span>
                </div>
              </div>

              {/* Customer info */}
              <div className="rounded-2xl border border-[#10271C]/10 p-4 space-y-4">
                <p className="text-xs font-semibold text-[#666] uppercase tracking-wider">
                  Customer
                </p>
                <DetailRow icon={User} label="Name" value={order.customerName} />
                <DetailRow icon={Phone} label="Phone" value={order.customerPhone} />
                {order.customerEmail && (
                  <DetailRow icon={Mail} label="Email" value={order.customerEmail} />
                )}
                <DetailRow icon={MapPin} label="Delivery Address" value={order.customerAddress} />
              </div>

              {/* Order info */}
              <div className="rounded-2xl border border-[#10271C]/10 p-4 space-y-4">
                <p className="text-xs font-semibold text-[#666] uppercase tracking-wider">
                  Order
                </p>
                <DetailRow icon={Package} label="Product" value={order.productName} />
                <DetailRow icon={Tag} label="Quantity" value={order.quantity} />
                <DetailRow icon={Tag} label="Plan" value={order.plan || order.orderType} />
                {order.startDate && (
                  <DetailRow
                    icon={Calendar}
                    label="Start Date"
                    value={new Date(order.startDate).toLocaleDateString("en-IN", {
                      day: "numeric", month: "long", year: "numeric",
                    })}
                  />
                )}
                <DetailRow
                  icon={Calendar}
                  label="Order Placed"
                  value={new Date(order.createdAt).toLocaleDateString("en-IN", {
                    day: "numeric", month: "long", year: "numeric",
                  })}
                />
              </div>

              {/* Payment info */}
              <div className="rounded-2xl border border-[#10271C]/10 p-4 space-y-3">
                <p className="text-xs font-semibold text-[#666] uppercase tracking-wider">
                  Payment
                </p>
                <div className="flex justify-between text-sm">
                  <span className="text-[#666]">Subtotal</span>
                  <span className="font-medium text-[#10271C]">
                    ₹{(order.subtotal || order.amount)?.toLocaleString("en-IN")}
                  </span>
                </div>
                {order.deliveryCharge > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-[#666]">Delivery Charge</span>
                    <span className="font-medium text-[#10271C]">
                      ₹{order.deliveryCharge?.toLocaleString("en-IN")}
                    </span>
                  </div>
                )}
                <div className="flex justify-between text-sm font-bold border-t border-[#10271C]/8 pt-3 mt-1">
                  <span className="text-[#10271C]">Grand Total</span>
                  <span className="text-[#10271C]">
                    ₹{order.amount?.toLocaleString("en-IN")}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

export default function AdminOrdersClient() {
  const [orders, setOrders] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);

  useEffect(() => { fetchOrders(); }, [statusFilter]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const url = statusFilter === "All" ? "/api/orders" : `/api/orders?status=${statusFilter}`;
      const data = await fetchWithAdminAuth(url);
      setOrders(data.orders || []);
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (orderId: string, newStatus: string) => {
    setUpdatingId(orderId);
    try {
      await fetchWithAdminAuth(`/api/orders/${orderId}`, {
        method: "PUT",
        body: JSON.stringify({ status: newStatus }),
      });
      setOrders((prev) =>
        prev.map((o) => (o._id === orderId ? { ...o, status: newStatus } : o))
      );
      // Update drawer order too
      setSelectedOrder((prev: any) =>
        prev?._id === orderId ? { ...prev, status: newStatus } : prev
      );
    } catch (error) {
      console.error("Error updating order status:", error);
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDelete = async (orderId: string) => {
    if (!confirm("Delete this order? This cannot be undone.")) return;
    try {
      await fetchWithAdminAuth(`/api/orders/${orderId}`, { method: "DELETE" });
      setOrders((prev) => prev.filter((o) => o._id !== orderId));
      if (selectedOrder?._id === orderId) setSelectedOrder(null);
    } catch (error) {
      console.error("Error deleting order:", error);
    }
  };

  const filteredOrders = orders.filter(
    (o) =>
      o.customerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.productName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.orderId?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <AdminProtectedRoute>
      <AdminLayout>
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="font-serif text-2xl font-bold text-[#10271C]">Orders</h1>
              <p className="text-[#666] text-sm">
                {filteredOrders.length} order{filteredOrders.length !== 1 ? "s" : ""}
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={fetchOrders}
                className="flex items-center gap-2 px-3 py-2 rounded-xl border border-[#10271C]/10 text-[#10271C] text-sm hover:bg-[#10271C]/5 transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
                Refresh
              </button>
              <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#10271C] text-white text-sm font-medium hover:bg-[#0F291D] transition-colors">
                <Download className="w-4 h-4" />
                Export CSV
              </button>
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
            <div className="relative flex-1 w-full">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#666]" />
              <input
                type="text"
                placeholder="Search by name, product or order ID…"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 rounded-xl border border-[#10271C]/10 focus:outline-none focus:border-[#D4AF37] text-sm"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-[#666]" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 rounded-xl border border-[#10271C]/10 focus:outline-none focus:border-[#D4AF37] text-sm"
              >
                <option value="All">All Statuses</option>
                {STATUS_OPTIONS.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Table */}
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <p className="text-[#666]">Loading orders…</p>
            </div>
          ) : filteredOrders.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-48 text-center">
              <p className="text-[#666] font-medium">No orders found</p>
              <p className="text-sm text-[#999] mt-1">
                {searchTerm
                  ? "Try a different search term"
                  : "Orders will appear here after customers checkout"}
              </p>
            </div>
          ) : (
            <div className="rounded-[20px] bg-white shadow-[0_8px_30px_rgba(0,0,0,.06)] overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-[#10271C]/8">
                      {["Order ID", "Customer", "Product", "Plan", "Amount", "Status", "Date", ""].map((h) => (
                        <th key={h} className="text-left px-5 py-4 text-xs font-semibold text-[#666] uppercase tracking-wider whitespace-nowrap">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#10271C]/5">
                    {filteredOrders.map((order) => (
                      <motion.tr
                        key={order._id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="hover:bg-[#F8F6F0]/60 transition-colors"
                      >
                        {/* Order ID */}
                        <td className="px-5 py-4">
                          <span className="font-mono text-xs font-semibold text-[#10271C] bg-[#10271C]/8 px-2 py-1 rounded-lg">
                            {order.orderId || `#${order._id?.slice(-6).toUpperCase()}`}
                          </span>
                        </td>

                        {/* Customer */}
                        <td className="px-5 py-4">
                          <p className="font-medium text-[#10271C] whitespace-nowrap">{order.customerName}</p>
                          <p className="text-xs text-[#666]">{order.customerPhone}</p>
                        </td>

                        {/* Product */}
                        <td className="px-5 py-4">
                          <p className="font-medium text-[#10271C]">{order.productName}</p>
                          <p className="text-xs text-[#666]">{order.quantity}</p>
                        </td>

                        {/* Plan */}
                        <td className="px-5 py-4">
                          <span className="text-xs px-2 py-1 rounded-full bg-[#D4AF37]/15 text-[#856A20] font-medium whitespace-nowrap">
                            {order.plan || order.orderType || "—"}
                          </span>
                        </td>

                        {/* Amount */}
                        <td className="px-5 py-4 whitespace-nowrap">
                          <p className="font-semibold text-[#10271C]">
                            ₹{order.amount?.toLocaleString("en-IN")}
                          </p>
                        </td>

                        {/* Status — inline dropdown */}
                        <td className="px-5 py-4">
                          <select
                            value={order.status}
                            onChange={(e) => handleStatusUpdate(order._id, e.target.value)}
                            disabled={updatingId === order._id}
                            className={`text-xs font-semibold px-3 py-1.5 rounded-full border-0 cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/40 disabled:opacity-50 ${
                              STATUS_COLORS[order.status] || "bg-gray-100 text-gray-700"
                            }`}
                          >
                            {STATUS_OPTIONS.map((s) => (
                              <option key={s} value={s}>{s}</option>
                            ))}
                          </select>
                        </td>

                        {/* Date */}
                        <td className="px-5 py-4 text-xs text-[#666] whitespace-nowrap">
                          {new Date(order.createdAt).toLocaleDateString("en-IN", {
                            day: "numeric", month: "short", year: "numeric",
                          })}
                        </td>

                        {/* Actions */}
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => setSelectedOrder(order)}
                              className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium text-[#10271C] bg-[#10271C]/8 hover:bg-[#10271C]/15 transition-colors whitespace-nowrap"
                              title="View order details"
                            >
                              <Eye className="w-3.5 h-3.5" />
                              View
                            </button>
                            <button
                              onClick={() => handleDelete(order._id)}
                              className="p-1.5 rounded-lg text-red-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                              title="Delete order"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Order detail drawer */}
        {selectedOrder && (
          <OrderDrawer
            order={selectedOrder}
            onClose={() => setSelectedOrder(null)}
            onStatusChange={handleStatusUpdate}
            updating={updatingId === selectedOrder._id}
          />
        )}
      </AdminLayout>
    </AdminProtectedRoute>
  );
}
