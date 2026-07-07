"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import AdminLayout from "./AdminLayout";
import AdminProtectedRoute from "./AdminProtectedRoute";
import { fetchWithAdminAuth } from "@/lib/api";
import { 
  ShoppingCart, 
  Users, 
  RefreshCw, 
  DollarSign, 
  Package, 
  TrendingUp,
  AlertTriangle,
  Gift
} from "lucide-react";
import { usePolling } from "@/lib/hooks/usePolling";

export default function AdminDashboardClient() {
  const [kpiData, setKpiData] = useState<any[]>([]);
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [latestCustomers, setLatestCustomers] = useState<any[]>([]);
  const [lowStockProducts, setLowStockProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch orders for KPI and recent orders
      const ordersData = await fetchWithAdminAuth("/api/orders");
      const orders = ordersData.orders || [];
      
      // Fetch all users for latest customers
      const usersData = await fetchWithAdminAuth("/api/users");
      const users = usersData.users || [];
      
      // Fetch products for low stock
      const productsData = await fetchWithAdminAuth("/api/products");
      const products = productsData.products || [];
      
      // Fetch inventory (now uses Product collection)
      const inventoryData = await fetchWithAdminAuth("/api/inventory");
      const inventory = inventoryData.inventory || [];

      // Calculate KPIs
      const today = new Date();
      const todayOrders = orders.filter((o: any) => {
        const orderDate = new Date(o.createdAt);
        return orderDate.toDateString() === today.toDateString();
      });

      const todaySubscriptionOrders = todayOrders.filter((o: any) => o.orderType === "subscription");
      const todayOneTimeOrders = todayOrders.filter((o: any) => o.orderType === "one-time");

      const pendingOrders = orders.filter((o: any) => o.status === "Pending");
      
      const totalRevenue = orders.reduce((sum: number, o: any) => sum + (o.amount || 0), 0);
      
      const lowStock = products.filter((p: any) => p.stock < 10);

      setKpiData([
        { icon: ShoppingCart, label: "Today's Subscription Orders", value: todaySubscriptionOrders.length, change: "+8%", positive: true },
        { icon: RefreshCw, label: "Today's One-Time Orders", value: todayOneTimeOrders.length, change: "+4%", positive: true },
        { icon: Users, label: "Total Customers", value: users.length, change: "+15", positive: true },
        { icon: Package, label: "Total Products", value: products.length, change: "+5", positive: true },
        { icon: DollarSign, label: "Total Revenue", value: `₹${totalRevenue.toLocaleString()}`, change: "+18%", positive: true },
      ]);

      setRecentOrders(orders.slice(0, 5));
      setLowStockProducts(lowStock.slice(0, 3));
      
      // Use real latest customers from users
      setLatestCustomers(
        users.slice(0, 5).map((user: any) => ({
          name: user.name,
          phone: user.phone,
          joined: new Date(user.createdAt).toLocaleDateString(),
          status: "Active",
        }))
      );
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  // Use polling to auto-refresh dashboard every 30 seconds
  usePolling(fetchDashboardData, { interval: 30000, immediate: false });

  if (loading) {
    return (
      <AdminProtectedRoute>
        <AdminLayout>
          <div className="flex items-center justify-center h-64">
            <p className="text-[#666]">Loading dashboard...</p>
          </div>
        </AdminLayout>
      </AdminProtectedRoute>
    );
  }

  return (
    <AdminProtectedRoute>
      <AdminLayout>
        <div className="space-y-8">
          {/* Page Header */}
          <div>
            <h1 className="font-serif text-2xl font-bold text-[#10271C]">Dashboard</h1>
            <p className="text-[#666]">Welcome back! Here's what's happening today.</p>
          </div>

          {/* KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {kpiData.map((kpi, index) => (
              <motion.div
                key={kpi.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                className="rounded-[20px] bg-white p-6 shadow-[0_8px_30px_rgba(0,0,0,.06)]"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-[#10271C]/5 flex items-center justify-center">
                    <kpi.icon className="w-6 h-6 text-[#10271C]" />
                  </div>
                  <span className={`text-sm font-medium ${kpi.positive ? "text-green-600" : "text-red-500"}`}>
                    {kpi.change}
                  </span>
                </div>
                <p className="text-2xl font-bold text-[#10271C] mb-1">{kpi.value}</p>
                <p className="text-sm text-[#666]">{kpi.label}</p>
              </motion.div>
            ))}
          </div>

          {/* Charts and Tables Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Orders */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.3 }}
              className="rounded-[20px] bg-white p-6 shadow-[0_8px_30px_rgba(0,0,0,.06)]"
            >
              <h2 className="font-serif text-lg font-semibold text-[#10271C] mb-4">Recent Orders</h2>
              <div className="space-y-3">
                {recentOrders.length > 0 ? recentOrders.map((order: any) => (
                  <div
                    key={order._id}
                    className="flex items-center justify-between p-3 rounded-xl bg-[#F8F6F0]"
                  >
                    <div>
                      <p className="font-medium text-[#10271C]">{order.customerName}</p>
                      <p className="text-sm text-[#666]">{order.productName}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-[#10271C]">₹{order.amount}</p>
                      <span
                        className={`text-xs px-2 py-1 rounded-full ${
                          order.status === "Delivered"
                            ? "bg-green-100 text-green-700"
                            : order.status === "Out for Delivery"
                            ? "bg-blue-100 text-blue-700"
                            : order.status === "Preparing"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {order.status}
                      </span>
                    </div>
                  </div>
                )) : <p className="text-[#666]">No recent orders</p>}
              </div>
            </motion.div>

            {/* Latest Customers */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.4 }}
              className="rounded-[20px] bg-white p-6 shadow-[0_8px_30px_rgba(0,0,0,.06)]"
            >
              <h2 className="font-serif text-lg font-semibold text-[#10271C] mb-4">Latest Customers</h2>
              <div className="space-y-3">
                {latestCustomers.map((customer, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 rounded-xl bg-[#F8F6F0]"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-[#10271C] flex items-center justify-center text-white font-semibold">
                        {customer.name.split(" ").map((n: string) => n[0]).join("")}
                      </div>
                      <div>
                        <p className="font-medium text-[#10271C]">{customer.name}</p>
                        <p className="text-sm text-[#666]">{customer.joined}</p>
                      </div>
                    </div>
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${
                        customer.status === "Active"
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {customer.status}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Low Stock Alert */}
          {lowStockProducts.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.5 }}
              className="rounded-[20px] bg-red-50 border border-red-200 p-6"
            >
              <div className="flex items-center gap-3 mb-4">
                <AlertTriangle className="w-6 h-6 text-red-600" />
                <h2 className="font-serif text-lg font-semibold text-red-900">Low Stock Alert</h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {lowStockProducts.map((product) => (
                  <div
                    key={product._id}
                    className="bg-white p-4 rounded-xl border border-red-200"
                  >
                    <p className="font-medium text-[#10271C]">{product.productName}</p>
                    <p className="text-2xl font-bold text-red-600">{product.stock}</p>
                    <p className="text-sm text-red-500">Low Stock</p>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Sales Chart Placeholder */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.6 }}
            className="rounded-[20px] bg-white p-6 shadow-[0_8px_30px_rgba(0,0,0,.06)]"
          >
            <h2 className="font-serif text-lg font-semibold text-[#10271C] mb-4">Sales Overview</h2>
            <div className="h-64 bg-[#F8F6F0] rounded-xl flex items-center justify-center">
              <p className="text-[#666]">Chart placeholder - Connect to analytics library</p>
            </div>
          </motion.div>
        </div>
      </AdminLayout>
    </AdminProtectedRoute>
  );
}
