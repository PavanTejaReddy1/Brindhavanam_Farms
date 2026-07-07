"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Copy, Send, Edit2, LogOut } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { fetchWithAuth } from "@/lib/api";

export default function ProfilePageClient() {
  const router = useRouter();
  const { user, logout, updateProfile, isLoading } = useAuth();
  const [editing, setEditing] = useState(false);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);
  const [orders, setOrders] = useState<any[]>([]);
  const [referralData, setReferralData] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        phone: user.phone || "",
        email: user.email || "",
        address: user.address || "",
      });
      fetchOrders();
      fetchReferralData();
    }
  }, [user]);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("/api/orders/user", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      setOrders(data.orders || []);
    } catch (error) {
      console.error("Error fetching orders:", error);
      setOrders([]);
    }
  };

  const fetchReferralData = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("/api/referrals/my", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      setReferralData(data);
    } catch (error) {
      console.error("Error fetching referral data:", error);
      setReferralData(null);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F8F6F0] flex items-center justify-center">
        <p className="text-[#666]">Loading...</p>
      </div>
    );
  }

  if (!user) {
    router.push("/login?redirect=/profile");
    return null;
  }

  const handleCopy = () => {
    if (user.referralCode) {
      navigator.clipboard.writeText(user.referralCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  const handleWhatsAppShare = () => {
    const message = `Join Brindhavanam Farms for farm-fresh milk! Use my referral code: ${user.referralCode}`;
    const url = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank");
  };

  const handleSaveProfile = async () => {
    try {
      setLoading(true);
      await fetchWithAuth("/api/users/profile", {
        method: "PUT",
        body: JSON.stringify(formData),
      });
      await updateProfile(formData);
      setEditing(false);
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
  };

  return (
    <>
      <motion.main
        className="min-h-screen bg-[#F8F6F0]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="px-[5%] py-12">
          <div className="max-w-4xl mx-auto space-y-8">
            {/* Back to Home Button */}
            <motion.button
              onClick={() => router.push("/")}
              className="flex items-center gap-2 text-[#10271C] font-medium hover:text-[#D4AF37] transition-colors"
              whileHover={{ x: -4 }}
            >
              ← Back to Home
            </motion.button>

            {/* Profile Header */}
            <motion.div
              className="rounded-[28px] bg-white p-8 shadow-[0_20px_60px_rgba(0,0,0,.08)]"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                <div className="w-24 h-24 rounded-full bg-[#10271C] flex items-center justify-center text-white text-3xl font-serif">
                  {user.name?.[0] || "U"}
                </div>
                <div className="flex-1">
                  <h1 className="font-serif text-2xl font-semibold text-[#10271C]">
                    {user.name}
                  </h1>
                  <p className="text-[#666] mt-1">
                    Member since {new Date((user as any).createdAt || Date.now()).toLocaleDateString()}
                  </p>
                  {user.referralCode && (
                    <div className="mt-3 flex items-center gap-2">
                      <span className="text-sm text-[#666]">Referral Code:</span>
                      <span className="px-3 py-1 rounded-full bg-[#D4AF37]/10 text-[#D4AF37] font-semibold text-sm">
                        {user.referralCode}
                      </span>
                    </div>
                  )}
                </div>
                <motion.button
                  onClick={() => setEditing(!editing)}
                  className="flex items-center gap-2 px-4 py-2 rounded-full border border-[#10271C]/20 text-[#10271C] text-sm font-medium transition-all hover:bg-[#10271C]/5"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Edit2 className="w-4 h-4" />
                  {editing ? "Cancel" : "Edit Profile"}
                </motion.button>
              </div>
            </motion.div>

            {/* Personal Information */}
            <motion.div
              className="rounded-[28px] bg-white p-8 shadow-[0_20px_60px_rgba(0,0,0,.08)]"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <h2 className="font-serif text-xl font-semibold text-[#10271C] mb-6">
                Personal Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-[#666] mb-2">Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    disabled={!editing}
                    className="w-full px-4 py-3 rounded-xl border border-[#10271C]/10 focus:outline-none focus:border-[#D4AF37] transition-colors disabled:bg-[#F8F6F0]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#666] mb-2">Phone Number</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    disabled={!editing}
                    className="w-full px-4 py-3 rounded-xl border border-[#10271C]/10 focus:outline-none focus:border-[#D4AF37] transition-colors disabled:bg-[#F8F6F0]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#666] mb-2">Email</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    disabled={!editing}
                    className="w-full px-4 py-3 rounded-xl border border-[#10271C]/10 focus:outline-none focus:border-[#D4AF37] transition-colors disabled:bg-[#F8F6F0]"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-[#666] mb-2">Address</label>
                  <input
                    type="text"
                    value={formData.address}
                    onChange={(e) => handleInputChange("address", e.target.value)}
                    disabled={!editing}
                    className="w-full px-4 py-3 rounded-xl border border-[#10271C]/10 focus:outline-none focus:border-[#D4AF37] transition-colors disabled:bg-[#F8F6F0]"
                  />
                </div>
              </div>
              {editing && (
                <motion.button
                  onClick={handleSaveProfile}
                  disabled={loading}
                  className="mt-6 px-6 py-3 rounded-full bg-[#10271C] text-white font-semibold text-sm disabled:opacity-50"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {loading ? "Saving..." : "Save Changes"}
                </motion.button>
              )}
            </motion.div>

            {/* Delivery Preferences */}
            <motion.div
              className="rounded-[28px] bg-white p-8 shadow-[0_20px_60px_rgba(0,0,0,.08)]"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <h2 className="font-serif text-xl font-semibold text-[#10271C] mb-6">
                Delivery Preferences
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-[#666] mb-2">Preferred Delivery Time</label>
                  <select className="w-full px-4 py-3 rounded-xl border border-[#10271C]/10 focus:outline-none focus:border-[#D4AF37] transition-colors bg-white">
                    <option>Before 6:00 AM</option>
                    <option>Before 7:00 AM</option>
                    <option>Before 8:00 AM</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#666] mb-2">Default Address</label>
                  <select className="w-full px-4 py-3 rounded-xl border border-[#10271C]/10 focus:outline-none focus:border-[#D4AF37] transition-colors bg-white">
                    <option>Home</option>
                    <option>Office</option>
                  </select>
                </div>
              </div>
            </motion.div>

            {/* Subscriptions */}
            <motion.div
              className="rounded-[28px] bg-white p-8 shadow-[0_20px_60px_rgba(0,0,0,.08)]"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <h2 className="font-serif text-xl font-semibold text-[#10271C] mb-6">
                Active Subscriptions
              </h2>
              <div className="text-center py-8">
                <p className="text-[#666] mb-4">No Active Subscription</p>
                <motion.button
                  onClick={() => router.push("/#products")}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#10271C] text-white font-semibold text-sm"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Browse Products
                </motion.button>
              </div>
            </motion.div>

            {/* Referral */}
            <motion.div
              className="rounded-[28px] bg-[#10271C] p-8 shadow-[0_20px_60px_rgba(16,39,28,0.25)]"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <h2 className="font-serif text-xl font-semibold text-white mb-6">
                Referral Program
              </h2>
              <div className="space-y-4">
                <div className="bg-white/10 rounded-xl px-4 py-3 flex items-center justify-between">
                  <span className="text-white/90 text-sm font-mono">{user.referralCode}</span>
                  <motion.button
                    onClick={handleCopy}
                    className="flex items-center gap-2 text-[#D4AF37] text-sm font-medium"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Copy className="w-4 h-4" />
                    {copied ? "Copied!" : "Copy"}
                  </motion.button>
                </div>
                <motion.button
                  onClick={handleWhatsAppShare}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-[#25d366] text-white font-semibold text-sm"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Send className="w-4 h-4" />
                  Share on WhatsApp
                </motion.button>
                <div className="grid grid-cols-2 gap-4 pt-4">
                  <div className="text-center">
                    <p className="text-2xl font-serif font-bold text-[#D4AF37]">{referralData?.totalReferrals || 0}</p>
                    <p className="text-white/70 text-sm">Friends Referred</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-serif font-bold text-[#D4AF37]">₹{referralData?.totalEarnings || 0}</p>
                    <p className="text-white/70 text-sm">Rewards Earned</p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Order History */}
            <motion.div
              className="rounded-[28px] bg-white p-8 shadow-[0_20px_60px_rgba(0,0,0,.08)]"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              <h2 className="font-serif text-xl font-semibold text-[#10271C] mb-6">
                Order History
              </h2>
              {orders.length > 0 ? (
                <div className="space-y-4">
                  {orders.map((order) => (
                    <div
                      key={order._id}
                      className="p-4 rounded-xl bg-[#F8F6F0] border border-[#10271C]/10"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <p className="font-medium text-[#10271C]">{order.productName}</p>
                          <p className="text-sm text-[#666]">{order.quantity}</p>
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
                      <div className="flex items-center gap-2 mt-2">
                        <span
                          className={`text-xs px-2 py-1 rounded-full ${
                            order.orderType === "subscription"
                              ? "bg-[#D4AF37]/20 text-[#D4AF37]"
                              : "bg-[#10271C]/10 text-[#10271C]"
                          }`}
                        >
                          {order.orderType === "subscription" ? "Subscription" : "One-Time Order"}
                        </span>
                        <span className="text-xs text-[#666]">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-[#666]">No orders yet</p>
                </div>
              )}
            </motion.div>

            {/* Settings */}
            <motion.div
              className="rounded-[28px] bg-white p-8 shadow-[0_20px_60px_rgba(0,0,0,.08)]"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <h2 className="font-serif text-xl font-semibold text-[#10271C] mb-6">
                Settings
              </h2>
              <div className="space-y-3">
                <motion.button
                  className="w-full flex items-center justify-between p-4 rounded-xl border border-[#10271C]/10 text-left hover:bg-[#F8F6F0] transition-colors"
                  whileHover={{ x: 4 }}
                >
                  <span className="text-[#10271C] font-medium">Change Password</span>
                  <span className="text-[#666]">→</span>
                </motion.button>
                <motion.button
                  className="w-full flex items-center justify-between p-4 rounded-xl border border-[#10271C]/10 text-left hover:bg-[#F8F6F0] transition-colors"
                  whileHover={{ x: 4 }}
                >
                  <span className="text-[#10271C] font-medium">Notification Preferences</span>
                  <span className="text-[#666]">→</span>
                </motion.button>
                <motion.button
                  className="w-full flex items-center justify-between p-4 rounded-xl border border-[#10271C]/10 text-left hover:bg-[#F8F6F0] transition-colors"
                  whileHover={{ x: 4 }}
                >
                  <span className="text-[#10271C] font-medium">Privacy Settings</span>
                  <span className="text-[#666]">→</span>
                </motion.button>
              </div>

              {/* Logout Button */}
              <div className="mt-8 pt-6 border-t border-[#10271C]/10">
                <motion.button
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center gap-2 py-3.5 rounded-full border-2 border-red-500 text-red-500 font-semibold text-sm transition-all hover:bg-red-500 hover:text-white"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </motion.button>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.main>
    </>
  );
}
