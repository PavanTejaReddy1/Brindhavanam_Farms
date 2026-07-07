"use client";

import { useState, useEffect } from "react";
import AdminLayout from "./AdminLayout";
import AdminProtectedRoute from "./AdminProtectedRoute";
import { fetchWithAdminAuth } from "@/lib/api";
import { Package, History, Plus, Minus } from "lucide-react";
import { usePolling } from "@/lib/hooks/usePolling";

export default function AdminInventoryClient() {
  const [inventory, setInventory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchInventory = async () => {
    try {
      const data = await fetchWithAdminAuth("/api/inventory");
      setInventory(data.inventory || []);
    } catch (error) {
      console.error("Error fetching inventory:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  // Use polling to auto-refresh inventory every 30 seconds
  usePolling(fetchInventory, { interval: 30000, immediate: false });

  const updateStock = async (productId: string, change: number) => {
    try {
      const item = inventory.find((i) => i.productId === productId);
      if (item) {
        const newStock = Math.max(0, item.stock + change);
        await fetchWithAdminAuth(`/api/inventory/${productId}`, {
          method: "PUT",
          body: JSON.stringify({ stock: newStock }),
        });
        // Refresh inventory immediately after update
        fetchInventory();
      }
    } catch (error) {
      console.error("Error updating stock:", error);
    }
  };

  const getStockStatus = (stock: number) => {
    if (stock <= 50) return { color: "bg-red-100 text-red-700", label: "Critical" };
    if (stock <= 150) return { color: "bg-yellow-100 text-yellow-700", label: "Low Stock" };
    return { color: "bg-green-100 text-green-700", label: "In Stock" };
  };

  if (loading) {
    return (
      <AdminProtectedRoute>
        <AdminLayout>
          <div className="flex items-center justify-center h-64">
            <p className="text-[#666]">Loading inventory...</p>
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
            <h1 className="font-serif text-2xl font-bold text-[#10271C]">Inventory</h1>
            <p className="text-[#666]">Manage stock levels and inventory</p>
          </div>

          {/* Inventory Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {inventory.length > 0 ? inventory.map((item) => {
              const status = getStockStatus(item.stock);
              return (
                <div key={item.productId} className="rounded-[20px] bg-white p-6 shadow-[0_8px_30px_rgba(0,0,0,.06)]">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-[#10271C]/5 flex items-center justify-center">
                        <Package className="w-6 h-6 text-[#10271C]" />
                      </div>
                      <div>
                        <p className="font-medium text-[#10271C]">{item.productName}</p>
                        <p className="text-xs text-[#666]">{item.category || "N/A"}</p>
                      </div>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full ${status.color}`}>
                      {status.label}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-3xl font-bold text-[#10271C]">{item.stock}</p>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => updateStock(item.productId, -10)}
                        className="p-2 rounded-lg bg-red-50 hover:bg-red-100 transition-colors"
                      >
                        <Minus className="w-4 h-4 text-red-600" />
                      </button>
                      <button
                        onClick={() => updateStock(item.productId, 10)}
                        className="p-2 rounded-lg bg-green-50 hover:bg-green-100 transition-colors"
                      >
                        <Plus className="w-4 h-4 text-green-600" />
                      </button>
                    </div>
                  </div>
                  <p className="text-xs text-[#666] mt-2">Last updated: {new Date(item.lastUpdated).toLocaleDateString()}</p>
                </div>
              );
            }) : (
              <div className="col-span-3 text-center py-8 text-[#666]">
                No inventory items found
              </div>
            )}
          </div>

          {/* Stock History Placeholder */}
          <div className="rounded-[20px] bg-white p-6 shadow-[0_8px_30px_rgba(0,0,0,.06)]">
            <div className="flex items-center gap-3 mb-4">
              <History className="w-5 h-5 text-[#10271C]" />
              <h2 className="font-serif text-lg font-semibold text-[#10271C]">Stock History</h2>
            </div>
            <div className="flex items-center justify-center py-8 text-[#666]">
              <p>Stock history feature coming soon</p>
            </div>
          </div>
        </div>
      </AdminLayout>
    </AdminProtectedRoute>
  );
}
