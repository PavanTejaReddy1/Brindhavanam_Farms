"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import AdminLayout from "./AdminLayout";
import AdminProtectedRoute from "./AdminProtectedRoute";
import { fetchWithAdminAuth } from "@/lib/api";
import { Search, Filter, Download, Trash2, RefreshCw } from "lucide-react";

const STATUS_OPTIONS = [
  "Pending",
  "Confirmed",
  "Preparing",
  "Out for Delivery",
  "Delivered",
  "Cancelled",
];

const STATUS_COLORS: Record<string, string> = {
  Delivered: "bg-green-100 text-green-700",
  "Out for Delivery": "bg-blue-100 text-blue-700",
  Preparing: "bg-yellow-100 text-yellow-700",
  Confirmed: "bg-purple-100 text-purple-700",
  Pending: "bg-gray-100 text-gray-700",
  Cancelled: "bg-red-100 text-red-700",
};

export default function AdminOrdersClient() {
  const [orders, setOrders] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  useEffect(() => {
    fetchOrders();
  }, [statusFilter]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const url =
        statusFilter === "All" ? "/api/orders" : `/api/orders?status=${statusFilter}`;
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
      // Update in-place — no full refetch needed
      setOrders((prev) =>
        prev.map((o) => (o._id === orderId ? { ...o, status: newStatus } : o))
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
                  <option key={s} value={s}>
                    {s}
                  </option>
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
                {searchTerm ? "Try a different search term" : "Orders will appear here after customers checkout"}
              </p>
            </div>
          ) : (
            <div className="rounded-[20px] bg-white shadow-[0_8px_30px_rgba(0,0,0,.06)] overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-[#10271C]/8">
                      <th className="text-left px-6 py-4 text-xs font-semibold text-[#666] uppercase tracking-wider">
                        Order ID
                      </th>
                      <th className="text-left px-6 py-4 text-xs font-semibold text-[#666] uppercase tracking-wider">
                        Customer
                      </th>
                      <th className="text-left px-6 py-4 text-xs font-semibold text-[#666] uppercase tracking-wider">
                        Product
                      </th>
                      <th className="text-left px-6 py-4 text-xs font-semibold text-[#666] uppercase tracking-wider">
                        Plan
                      </th>
                      <th className="text-left px-6 py-4 text-xs font-semibold text-[#666] uppercase tracking-wider">
                        Amount
                      </th>
                      <th className="text-left px-6 py-4 text-xs font-semibold text-[#666] uppercase tracking-wider">
                        Status
                      </th>
                      <th className="text-left px-6 py-4 text-xs font-semibold text-[#666] uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-6 py-4" />
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
                        <td className="px-6 py-4">
                          <span className="font-mono text-xs font-semibold text-[#10271C] bg-[#10271C]/8 px-2 py-1 rounded-lg">
                            {order.orderId || `#${order._id?.slice(-6).toUpperCase()}`}
                          </span>
                        </td>

                        {/* Customer */}
                        <td className="px-6 py-4">
                          <p className="font-medium text-[#10271C]">{order.customerName}</p>
                          <p className="text-xs text-[#666]">{order.customerPhone}</p>
                        </td>

                        {/* Product */}
                        <td className="px-6 py-4">
                          <p className="font-medium text-[#10271C]">{order.productName}</p>
                          <p className="text-xs text-[#666]">{order.quantity}</p>
                        </td>

                        {/* Plan */}
                        <td className="px-6 py-4">
                          <span className="text-xs px-2 py-1 rounded-full bg-[#D4AF37]/15 text-[#856A20] font-medium">
                            {order.plan || order.orderType || "—"}
                          </span>
                          {order.startDate && (
                            <p className="text-xs text-[#888] mt-1">
                              From {new Date(order.startDate).toLocaleDateString("en-IN")}
                            </p>
                          )}
                        </td>

                        {/* Amount */}
                        <td className="px-6 py-4">
                          <p className="font-semibold text-[#10271C]">
                            ₹{order.amount?.toLocaleString("en-IN")}
                          </p>
                          {order.deliveryCharge > 0 && (
                            <p className="text-xs text-[#666]">
                              +₹{order.deliveryCharge} delivery
                            </p>
                          )}
                        </td>

                        {/* Status — inline dropdown */}
                        <td className="px-6 py-4">
                          <div className="relative">
                            <select
                              value={order.status}
                              onChange={(e) => handleStatusUpdate(order._id, e.target.value)}
                              disabled={updatingId === order._id}
                              className={`text-xs font-semibold px-3 py-1.5 rounded-full border-0 cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/40 appearance-none pr-6 ${
                                STATUS_COLORS[order.status] || "bg-gray-100 text-gray-700"
                              } disabled:opacity-50`}
                            >
                              {STATUS_OPTIONS.map((s) => (
                                <option key={s} value={s}>
                                  {s}
                                </option>
                              ))}
                            </select>
                            {updatingId === order._id && (
                              <span className="absolute right-1 top-1/2 -translate-y-1/2 text-[10px]">
                                ⟳
                              </span>
                            )}
                          </div>
                        </td>

                        {/* Date */}
                        <td className="px-6 py-4 text-xs text-[#666] whitespace-nowrap">
                          {new Date(order.createdAt).toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </td>

                        {/* Actions */}
                        <td className="px-6 py-4">
                          <button
                            onClick={() => handleDelete(order._id)}
                            className="p-1.5 rounded-lg text-red-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                            title="Delete order"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </AdminLayout>
    </AdminProtectedRoute>
  );
}
