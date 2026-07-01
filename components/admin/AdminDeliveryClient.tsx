"use client";

import { useState, useEffect } from "react";
import AdminLayout from "./AdminLayout";
import AdminProtectedRoute from "./AdminProtectedRoute";
import { fetchWithAdminAuth } from "@/lib/api";
import { Truck, MapPin, Clock, CheckCircle, User, Calendar } from "lucide-react";

export default function AdminDeliveryClient() {
  const [deliveries, setDeliveries] = useState<any[]>([]);
  const [selectedDate, setSelectedDate] = useState("Today");
  const [statusFilter, setStatusFilter] = useState("All");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDeliveries();
  }, [statusFilter]);

  const fetchDeliveries = async () => {
    try {
      setLoading(true);
      const url = statusFilter === "All" ? "/api/delivery" : `/api/delivery?status=${statusFilter}`;
      const data = await fetchWithAdminAuth(url);
      setDeliveries(data.deliveries || []);
    } catch (error) {
      console.error("Error fetching deliveries:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (deliveryId: string, newStatus: string) => {
    try {
      await fetchWithAdminAuth(`/api/delivery/${deliveryId}`, {
        method: "PUT",
        body: JSON.stringify({ status: newStatus }),
      });
      fetchDeliveries();
    } catch (error) {
      console.error("Error updating delivery:", error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Completed": return "bg-green-100 text-green-700";
      case "Out for Delivery": return "bg-blue-100 text-blue-700";
      case "Pending": return "bg-yellow-100 text-yellow-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  const totalDeliveries = deliveries.length;
  const pendingDeliveries = deliveries.filter((d) => d.status === "Pending").length;
  const completedDeliveries = deliveries.filter((d) => d.status === "Completed").length;
  const uniqueDrivers = new Set(deliveries.map((d) => d.driverId)).size;

  if (loading) {
    return (
      <AdminProtectedRoute>
        <AdminLayout>
          <div className="flex items-center justify-center h-64">
            <p className="text-[#666]">Loading deliveries...</p>
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
              <h1 className="font-serif text-2xl font-bold text-[#10271C]">Delivery</h1>
              <p className="text-[#666]">Manage delivery operations and routes</p>
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 rounded-xl border border-[#10271C]/10 focus:outline-none focus:border-[#D4AF37]"
            >
              <option value="All">All Status</option>
              <option value="Pending">Pending</option>
              <option value="Out for Delivery">Out for Delivery</option>
              <option value="Completed">Completed</option>
            </select>
          </div>

          {/* KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
            <div className="rounded-[20px] bg-white p-6 shadow-[0_8px_30px_rgba(0,0,0,.06)]">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-[#10271C]/5 flex items-center justify-center">
                  <Truck className="w-6 h-6 text-[#10271C]" />
                </div>
              </div>
              <p className="text-2xl font-bold text-[#10271C]">{totalDeliveries}</p>
              <p className="text-sm text-[#666]">Total Deliveries</p>
            </div>
            <div className="rounded-[20px] bg-white p-6 shadow-[0_8px_30px_rgba(0,0,0,.06)]">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center">
                  <Clock className="w-6 h-6 text-blue-600" />
                </div>
              </div>
              <p className="text-2xl font-bold text-[#10271C]">{pendingDeliveries}</p>
              <p className="text-sm text-[#666]">Pending</p>
            </div>
            <div className="rounded-[20px] bg-white p-6 shadow-[0_8px_30px_rgba(0,0,0,.06)]">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-green-50 flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
              </div>
              <p className="text-2xl font-bold text-[#10271C]">{completedDeliveries}</p>
              <p className="text-sm text-[#666]">Completed</p>
            </div>
            <div className="rounded-[20px] bg-white p-6 shadow-[0_8px_30px_rgba(0,0,0,.06)]">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-[#10271C]/5 flex items-center justify-center">
                  <User className="w-6 h-6 text-[#10271C]" />
                </div>
              </div>
              <p className="text-2xl font-bold text-[#10271C]">{uniqueDrivers}</p>
              <p className="text-sm text-[#666]">Active Drivers</p>
            </div>
          </div>

          {/* Drivers Placeholder */}
          <div className="rounded-[20px] bg-white p-6 shadow-[0_8px_30px_rgba(0,0,0,.06)]">
            <h2 className="font-serif text-lg font-semibold text-[#10271C] mb-4">Drivers</h2>
            <div className="flex items-center justify-center py-8 text-[#666]">
              <p>Driver management feature coming soon</p>
            </div>
          </div>

          {/* Deliveries Table */}
          <div className="rounded-[20px] bg-white shadow-[0_8px_30px_rgba(0,0,0,.06)] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-[#F8F6F0]">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-[#10271C]">Delivery ID</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-[#10271C]">Customer</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-[#10271C]">Address</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-[#10271C]">Product</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-[#10271C]">Driver</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-[#10271C]">Time</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-[#10271C]">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {deliveries.length > 0 ? deliveries.map((delivery) => (
                    <tr key={delivery._id} className="border-t border-[#10271C]/5 hover:bg-[#F8F6F0]/50">
                      <td className="px-6 py-4 text-sm font-medium text-[#10271C]">#{delivery._id?.slice(-6).toUpperCase()}</td>
                      <td className="px-6 py-4 text-sm text-[#666]">{delivery.customerName}</td>
                      <td className="px-6 py-4 text-sm text-[#666]">{delivery.customerAddress}</td>
                      <td className="px-6 py-4 text-sm text-[#666]">{delivery.productName}</td>
                      <td className="px-6 py-4 text-sm text-[#666]">{delivery.driverName || "Unassigned"}</td>
                      <td className="px-6 py-4 text-sm text-[#666]">{delivery.time}</td>
                      <td className="px-6 py-4">
                        <span className={`text-xs px-3 py-1 rounded-full ${getStatusColor(delivery.status)}`}>
                          {delivery.status}
                        </span>
                      </td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan={7} className="px-6 py-8 text-center text-[#666]">
                        No deliveries found
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
