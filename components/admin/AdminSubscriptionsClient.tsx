"use client";

import { useState, useEffect } from "react";
import AdminLayout from "./AdminLayout";
import AdminProtectedRoute from "./AdminProtectedRoute";
import { fetchWithAdminAuth } from "@/lib/api";
import { Search, Play, Pause, X, RotateCcw } from "lucide-react";

export default function AdminSubscriptionsClient() {
  const [subscriptions, setSubscriptions] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSubscriptions();
  }, [statusFilter]);

  const fetchSubscriptions = async () => {
    try {
      setLoading(true);
      const url = statusFilter === "All" ? "/api/subscriptions" : `/api/subscriptions?status=${statusFilter}`;
      const data = await fetchWithAdminAuth(url);
      setSubscriptions(data.subscriptions || []);
    } catch (error) {
      console.error("Error fetching subscriptions:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (subId: string, newStatus: string) => {
    try {
      await fetchWithAdminAuth(`/api/subscriptions/${subId}`, {
        method: "PUT",
        body: JSON.stringify({ status: newStatus }),
      });
      fetchSubscriptions();
    } catch (error) {
      console.error("Error updating subscription:", error);
    }
  };

  const handleDelete = async (subId: string) => {
    if (confirm("Are you sure you want to delete this subscription?")) {
      try {
        await fetchWithAdminAuth(`/api/subscriptions/${subId}`, {
          method: "DELETE",
        });
        fetchSubscriptions();
      } catch (error) {
        console.error("Error deleting subscription:", error);
      }
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active": return "bg-green-100 text-green-700";
      case "Paused": return "bg-yellow-100 text-yellow-700";
      case "Cancelled": return "bg-red-100 text-red-700";
      case "Expired": return "bg-gray-100 text-gray-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  const filteredSubscriptions = subscriptions.filter((sub) =>
    sub.productName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <AdminProtectedRoute>
        <AdminLayout>
          <div className="flex items-center justify-center h-64">
            <p className="text-[#666]">Loading subscriptions...</p>
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
          <div>
            <h1 className="font-serif text-2xl font-bold text-[#10271C]">Subscriptions</h1>
            <p className="text-[#666]">Manage all customer subscriptions</p>
          </div>

          {/* Filters */}
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-[#666]" />
              <input
                type="text"
                placeholder="Search subscriptions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-xl border border-[#10271C]/10 focus:outline-none focus:border-[#D4AF37]"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 rounded-xl border border-[#10271C]/10 focus:outline-none focus:border-[#D4AF37]"
            >
              <option value="All">All Status</option>
              <option value="Active">Active</option>
              <option value="Paused">Paused</option>
              <option value="Cancelled">Cancelled</option>
              <option value="Expired">Expired</option>
            </select>
          </div>

          {/* Subscriptions Table */}
          <div className="rounded-[20px] bg-white shadow-[0_8px_30px_rgba(0,0,0,.06)] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-[#F8F6F0]">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-[#10271C]">Subscription ID</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-[#10271C]">Customer</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-[#10271C]">Product</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-[#10271C]">Quantity</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-[#10271C]">Plan</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-[#10271C]">Start Date</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-[#10271C]">Next Delivery</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-[#10271C]">Status</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-[#10271C]">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredSubscriptions.length > 0 ? filteredSubscriptions.map((sub) => (
                    <tr key={sub._id} className="border-t border-[#10271C]/5 hover:bg-[#F8F6F0]/50">
                      <td className="px-6 py-4 text-sm font-medium text-[#10271C]">#{sub._id?.slice(-6).toUpperCase()}</td>
                      <td className="px-6 py-4 text-sm text-[#666]">{sub.userId?.name || "Unknown"}</td>
                      <td className="px-6 py-4 text-sm text-[#666]">{sub.productName}</td>
                      <td className="px-6 py-4 text-sm text-[#666]">{sub.quantity}</td>
                      <td className="px-6 py-4 text-sm text-[#666]">{sub.plan}</td>
                      <td className="px-6 py-4 text-sm text-[#666]">{new Date(sub.startDate).toLocaleDateString()}</td>
                      <td className="px-6 py-4 text-sm text-[#666]">{new Date(sub.nextDelivery).toLocaleDateString()}</td>
                      <td className="px-6 py-4">
                        <span className={`text-xs px-3 py-1 rounded-full ${getStatusColor(sub.status)}`}>
                          {sub.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          {sub.status === "Active" ? (
                            <button 
                              onClick={() => handleStatusUpdate(sub._id, "Paused")}
                              className="p-2 rounded-lg hover:bg-yellow-50 transition-colors" 
                              title="Pause"
                            >
                              <Pause className="w-4 h-4 text-yellow-600" />
                            </button>
                          ) : (
                            <button 
                              onClick={() => handleStatusUpdate(sub._id, "Active")}
                              className="p-2 rounded-lg hover:bg-green-50 transition-colors" 
                              title="Resume"
                            >
                              <Play className="w-4 h-4 text-green-600" />
                            </button>
                          )}
                          <button className="p-2 rounded-lg hover:bg-blue-50 transition-colors" title="Renew">
                            <RotateCcw className="w-4 h-4 text-blue-600" />
                          </button>
                          <button 
                            onClick={() => handleDelete(sub._id)}
                            className="p-2 rounded-lg hover:bg-red-50 transition-colors" 
                            title="Cancel"
                          >
                            <X className="w-4 h-4 text-red-500" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan={9} className="px-6 py-8 text-center text-[#666]">
                        No subscriptions found
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
