"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import AdminLayout from "./AdminLayout";
import AdminProtectedRoute from "./AdminProtectedRoute";
import { fetchWithAdminAuth } from "@/lib/api";
import { Search, Filter, Download, Eye, Edit, Trash2 } from "lucide-react";

export default function AdminOrdersClient() {
  const [orders, setOrders] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, [statusFilter]);

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
    try {
      await fetchWithAdminAuth(`/api/orders/${orderId}`, {
        method: "PUT",
        body: JSON.stringify({ status: newStatus }),
      });
      fetchOrders();
    } catch (error) {
      console.error("Error updating order:", error);
    }
  };

  const handleDelete = async (orderId: string) => {
    if (confirm("Are you sure you want to delete this order?")) {
      try {
        await fetchWithAdminAuth(`/api/orders/${orderId}`, {
          method: "DELETE",
        });
        fetchOrders();
      } catch (error) {
        console.error("Error deleting order:", error);
      }
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Delivered": return "bg-green-100 text-green-700";
      case "Out for Delivery": return "bg-blue-100 text-blue-700";
      case "Preparing": return "bg-yellow-100 text-yellow-700";
      case "Pending": return "bg-gray-100 text-gray-700";
      case "Cancelled": return "bg-red-100 text-red-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  const filteredOrders = orders.filter((order) =>
    order.customerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.productName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <AdminProtectedRoute>
        <AdminLayout>
          <div className="flex items-center justify-center h-64">
            <p className="text-[#666]">Loading orders...</p>
          </div>
        </AdminLayout>
      </AdminProtectedRoute>
    );
  }

  return (
    <AdminProtectedRoute>
      <AdminLayout>
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="font-serif text-2xl font-bold text-[#10271C]">Orders</h1>
              <p className="text-[#666]">Manage all customer orders</p>
            </div>
            <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#10271C] text-white text-sm font-medium hover:bg-[#0F291D] transition-colors">
              <Download className="w-4 h-4" />
              Export CSV
            </button>
          </div>

          {/* Filters */}
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-[#666]" />
              <input
                type="text"
                placeholder="Search orders..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-xl border border-[#10271C]/10 focus:outline-none focus:border-[#D4AF37]"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-[#666]" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2 rounded-xl border border-[#10271C]/10 focus:outline-none focus:border-[#D4AF37]"
              >
                <option value="All">All Status</option>
                <option value="Pending">Pending</option>
                <option value="Confirmed">Confirmed</option>
                <option value="Preparing">Preparing</option>
                <option value="Out for Delivery">Out for Delivery</option>
                <option value="Delivered">Delivered</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>
          </div>

          {/* Orders Table */}
          <div className="rounded-[20px] bg-white shadow-[0_8px_30px_rgba(0,0,0,.06)] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-[#F8F6F0]">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-[#10271C]">Order ID</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-[#10271C]">Customer</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-[#10271C]">Product</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-[#10271C]">Quantity</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-[#10271C]">Subscription</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-[#10271C]">Amount</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-[#10271C]">Status</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-[#10271C]">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders.length > 0 ? filteredOrders.map((order) => (
                    <tr key={order._id} className="border-t border-[#10271C]/5 hover:bg-[#F8F6F0]/50">
                      <td className="px-6 py-4 text-sm font-medium text-[#10271C]">#{order._id?.slice(-6).toUpperCase()}</td>
                      <td className="px-6 py-4">
                        <p className="text-sm font-medium text-[#10271C]">{order.customerName}</p>
                        <p className="text-xs text-[#666]">{order.customerPhone}</p>
                      </td>
                      <td className="px-6 py-4 text-sm text-[#666]">{order.productName}</td>
                      <td className="px-6 py-4 text-sm text-[#666]">{order.quantity}</td>
                      <td className="px-6 py-4 text-sm text-[#666]">{order.subscription || "None"}</td>
                      <td className="px-6 py-4 text-sm font-semibold text-[#10271C]">₹{order.amount}</td>
                      <td className="px-6 py-4">
                        <span className={`text-xs px-3 py-1 rounded-full ${getStatusColor(order.status)}`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <button className="p-2 rounded-lg hover:bg-[#10271C]/5 transition-colors">
                            <Eye className="w-4 h-4 text-[#10271C]" />
                          </button>
                          <button className="p-2 rounded-lg hover:bg-[#10271C]/5 transition-colors">
                            <Edit className="w-4 h-4 text-[#10271C]" />
                          </button>
                          <button 
                            onClick={() => handleDelete(order._id)}
                            className="p-2 rounded-lg hover:bg-red-50 transition-colors"
                          >
                            <Trash2 className="w-4 h-4 text-red-500" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan={8} className="px-6 py-8 text-center text-[#666]">
                        No orders found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </AdminLayout>
    </AdminProtectedRoute>
  );
}
