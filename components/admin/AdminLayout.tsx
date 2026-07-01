"use client";

import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useAdmin } from "@/contexts/AdminContext";
import { 
  LayoutDashboard, 
  ShoppingCart, 
  Users, 
  Package, 
  RefreshCw, 
  Gift, 
  Truck, 
  CreditCard, 
  BarChart3, 
  Bell, 
  Settings, 
  LogOut, 
  Search, 
  Menu, 
  X,
  Sun,
  Moon
} from "lucide-react";

interface AdminLayoutProps {
  children: React.ReactNode;
}

const SIDEBAR_ITEMS = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/admin/dashboard" },
  { icon: ShoppingCart, label: "Orders", href: "/admin/orders" },
  { icon: Users, label: "Customers", href: "/admin/customers" },
  { icon: Package, label: "Products", href: "/admin/products" },
  { icon: RefreshCw, label: "Subscriptions", href: "/admin/subscriptions" },
  { icon: Gift, label: "Referral Program", href: "/admin/referrals" },
  { icon: Package, label: "Inventory", href: "/admin/inventory" },
  { icon: Truck, label: "Delivery", href: "/admin/delivery" },
  { icon: CreditCard, label: "Payments", href: "/admin/payments" },
  { icon: BarChart3, label: "Reports", href: "/admin/reports" },
  { icon: Bell, label: "Notifications", href: "/admin/notifications" },
  { icon: Settings, label: "Settings", href: "/admin/settings" },
];

export default function AdminLayout({ children }: AdminLayoutProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { admin, logout } = useAdmin();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  const handleLogout = () => {
    logout();
    router.push("/admin/login");
  };

  const currentDate = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className={`min-h-screen ${darkMode ? "bg-[#0a0a0a]" : "bg-[#F8F6F0]"}`}>
      {/* Sidebar */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.aside
            initial={{ x: -280 }}
            animate={{ x: 0 }}
            exit={{ x: -280 }}
            transition={{ duration: 0.3 }}
            className={`fixed left-0 top-0 h-full w-64 z-50 ${
              darkMode ? "bg-[#1a1a1a]" : "bg-[#10271C]"
            }`}
          >
            <div className="p-6">
              <h1 className="font-serif text-xl font-bold text-white mb-1">
                Brindhavanam Farms
              </h1>
              <p className="text-[#D4AF37] text-xs font-semibold tracking-widest uppercase">
                Admin Dashboard
              </p>
            </div>

            <nav className="mt-6 px-4">
              <ul className="space-y-1">
                {SIDEBAR_ITEMS.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                        pathname === item.href
                          ? "bg-white/20 text-white"
                          : "text-white/80 hover:bg-white/10 hover:text-white"
                      }`}
                    >
                      <item.icon className="w-5 h-5" />
                      <span className="text-sm font-medium">{item.label}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-white/10">
              <button
                onClick={handleLogout}
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all w-full"
              >
                <LogOut className="w-5 h-5" />
                <span className="text-sm font-medium">Logout</span>
              </button>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className={`${sidebarOpen ? "ml-64" : "ml-0"}`}>
        {/* Topbar */}
        <header
          className={`sticky top-0 z-40 ${
            darkMode ? "bg-[#1a1a1a]" : "bg-white"
          } border-b ${darkMode ? "border-white/10" : "border-[#10271C]/10"}`}
        >
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-2 rounded-lg hover:bg-[#10271C]/5 transition-colors"
              >
                {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
              <div className="relative">
                <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-[#666]" />
                <input
                  type="text"
                  placeholder="Search..."
                  className={`pl-10 pr-4 py-2 rounded-xl border ${
                    darkMode
                      ? "bg-[#2a2a2a] border-white/10 text-white placeholder-white/50"
                      : "bg-[#F8F6F0] border-[#10271C]/10"
                  } focus:outline-none focus:border-[#D4AF37] w-64`}
                />
              </div>
            </div>

            <div className="flex items-center gap-4">
              <span className={`text-sm ${darkMode ? "text-white/60" : "text-[#666]"}`}>
                {currentDate}
              </span>
              
              <button
                onClick={() => setDarkMode(!darkMode)}
                className="p-2 rounded-lg hover:bg-[#10271C]/5 transition-colors"
              >
                {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>

              <button className="p-2 rounded-lg hover:bg-[#10271C]/5 transition-colors relative">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
              </button>

              {admin && (
                <div className="flex items-center gap-3 pl-4 border-l border-[#10271C]/10">
                  <div className="w-10 h-10 rounded-full bg-[#10271C] flex items-center justify-center text-white font-semibold">
                    {admin.avatar}
                  </div>
                  <div className="hidden md:block">
                    <p className="text-sm font-semibold text-[#10271C]">{admin.name}</p>
                    <p className="text-xs text-[#666]">{admin.role}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}
