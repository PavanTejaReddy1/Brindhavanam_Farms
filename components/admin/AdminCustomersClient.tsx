"use client";

import { useState, useEffect } from "react";
import AdminLayout from "./AdminLayout";
import AdminProtectedRoute from "./AdminProtectedRoute";
import { fetchWithAdminAuth } from "@/lib/api";
import { Search, Eye, Edit, Trash2, UserX } from "lucide-react";

export default function AdminCustomersClient() {
  const [customers, setCustomers] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const data = await fetchWithAdminAuth("/api/users/all");
      setCustomers(data.users || []);
    } catch (error) {
      console.error("Error fetching customers:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (userId: string) => {
    if (confirm("Are you sure you want to delete this customer?")) {
      try {
        await fetchWithAdminAuth(`/api/users/${userId}`, {
          method: "DELETE",
        });
        fetchCustomers();
      } catch (error) {
        console.error("Error deleting customer:", error);
      }
    }
  };

  const filteredCustomers = customers.filter((customer) =>
    customer.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.phone?.includes(searchTerm)
  );

  if (loading) {
    return (
      <AdminProtectedRoute>
        <AdminLayout>
          <div className="flex items-center justify-center h-64">
            <p className="text-[#666]">Loading customers...</p>
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
            <h1 className="font-serif text-2xl font-bold text-[#10271C]">Customers</h1>
            <p className="text-[#666]">Manage all customer accounts</p>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-[#666]" />
            <input
              type="text"
              placeholder="Search customers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-[#10271C]/10 focus:outline-none focus:border-[#D4AF37]"
            />
          </div>

          {/* Customers Table */}
          <div className="rounded-[20px] bg-white shadow-[0_8px_30px_rgba(0,0,0,.06)] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-[#F8F6F0]">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-[#10271C]">Customer</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-[#10271C]">Contact</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-[#10271C]">Address</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-[#10271C]">Referral Code</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-[#10271C]">Joined</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-[#10271C]">Orders</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-[#10271C]">Lifetime Value</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-[#10271C]">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCustomers.length > 0 ? filteredCustomers.map((customer) => (
                    <tr key={customer._id} className="border-t border-[#10271C]/5 hover:bg-[#F8F6F0]/50">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-[#10271C] flex items-center justify-center text-white font-semibold">
                            {customer.name?.split(" ").map((n: string) => n[0]).join("")}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-[#10271C]">{customer.name}</p>
                            <p className="text-xs text-[#666]">#{customer._id?.slice(-6).toUpperCase()}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm text-[#666]">{customer.phone}</p>
                        <p className="text-xs text-[#666]">{customer.email}</p>
                      </td>
                      <td className="px-6 py-4 text-sm text-[#666]">{customer.address}</td>
                      <td className="px-6 py-4">
                        <span className="text-xs px-2 py-1 rounded-full bg-[#D4AF37]/10 text-[#D4AF37] font-medium">
                          {customer.referralCode}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-[#666]">{new Date(customer.createdAt).toLocaleDateString()}</td>
                      <td className="px-6 py-4 text-sm font-semibold text-[#10271C]">{customer.totalOrders || 0}</td>
                      <td className="px-6 py-4 text-sm font-semibold text-[#10271C]">₹{customer.lifetimeValue || 0}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <button className="p-2 rounded-lg hover:bg-[#10271C]/5 transition-colors">
                            <Eye className="w-4 h-4 text-[#10271C]" />
                          </button>
                          <button className="p-2 rounded-lg hover:bg-[#10271C]/5 transition-colors">
                            <Edit className="w-4 h-4 text-[#10271C]" />
                          </button>
                          <button className="p-2 rounded-lg hover:bg-yellow-50 transition-colors">
                            <UserX className="w-4 h-4 text-yellow-600" />
                          </button>
                          <button 
                            onClick={() => handleDelete(customer._id)}
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
                        No customers found
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
