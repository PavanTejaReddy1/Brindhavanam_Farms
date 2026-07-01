"use client";

import { useState, useEffect } from "react";
import AdminLayout from "./AdminLayout";
import AdminProtectedRoute from "./AdminProtectedRoute";
import { fetchWithAdminAuth } from "@/lib/api";
import { Building, Phone, Mail, MapPin, Clock, Gift, Image, Upload } from "lucide-react";

export default function AdminSettingsClient() {
  const [settings, setSettings] = useState<any>({
    companyName: "",
    phoneNumber: "",
    email: "",
    gstNumber: "",
    address: "",
    deliveryStartTime: "",
    deliveryEndTime: "",
    referralReward: "",
    referralRewardValue: "",
    whatsappNumber: "",
    logo: "",
    heroImage: "",
    referralBanner: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const data = await fetchWithAdminAuth("/api/settings");
      if (data.settings) {
        setSettings(data.settings);
      }
    } catch (error) {
      console.error("Error fetching settings:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      await fetchWithAdminAuth("/api/settings", {
        method: "PUT",
        body: JSON.stringify(settings),
      });
      alert("Settings saved successfully");
    } catch (error) {
      console.error("Error saving settings:", error);
      alert("Failed to save settings");
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (field: string, value: string | number) => {
    setSettings({ ...settings, [field]: value });
  };

  if (loading) {
    return (
      <AdminProtectedRoute>
        <AdminLayout>
          <div className="flex items-center justify-center h-64">
            <p className="text-[#666]">Loading settings...</p>
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
            <h1 className="font-serif text-2xl font-bold text-[#10271C]">Settings</h1>
            <p className="text-[#666]">Manage company settings and preferences</p>
          </div>

          {/* Company Information */}
          <div className="rounded-[20px] bg-white p-6 shadow-[0_8px_30px_rgba(0,0,0,.06)]">
            <h2 className="font-serif text-lg font-semibold text-[#10271C] mb-6">Company Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-[#10271C] mb-2">Company Name</label>
                <input
                  type="text"
                  value={settings.companyName || ""}
                  onChange={(e) => handleChange("companyName", e.target.value)}
                  className="w-full px-4 py-2 rounded-xl border border-[#10271C]/10 focus:outline-none focus:border-[#D4AF37]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#10271C] mb-2">Phone Number</label>
                <input
                  type="tel"
                  value={settings.phoneNumber || ""}
                  onChange={(e) => handleChange("phoneNumber", e.target.value)}
                  className="w-full px-4 py-2 rounded-xl border border-[#10271C]/10 focus:outline-none focus:border-[#D4AF37]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#10271C] mb-2">Email</label>
                <input
                  type="email"
                  value={settings.email || ""}
                  onChange={(e) => handleChange("email", e.target.value)}
                  className="w-full px-4 py-2 rounded-xl border border-[#10271C]/10 focus:outline-none focus:border-[#D4AF37]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#10271C] mb-2">GST Number</label>
                <input
                  type="text"
                  value={settings.gstNumber || ""}
                  onChange={(e) => handleChange("gstNumber", e.target.value)}
                  className="w-full px-4 py-2 rounded-xl border border-[#10271C]/10 focus:outline-none focus:border-[#D4AF37]"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-[#10271C] mb-2">Business Address</label>
                <textarea
                  value={settings.address || ""}
                  onChange={(e) => handleChange("address", e.target.value)}
                  rows={3}
                  className="w-full px-4 py-2 rounded-xl border border-[#10271C]/10 focus:outline-none focus:border-[#D4AF37]"
                />
              </div>
            </div>
          </div>

          {/* Delivery Settings */}
          <div className="rounded-[20px] bg-white p-6 shadow-[0_8px_30px_rgba(0,0,0,.06)]">
            <h2 className="font-serif text-lg font-semibold text-[#10271C] mb-6">Delivery Settings</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-[#10271C] mb-2">Delivery Start Time</label>
                <input
                  type="time"
                  value={settings.deliveryStartTime || ""}
                  onChange={(e) => handleChange("deliveryStartTime", e.target.value)}
                  className="w-full px-4 py-2 rounded-xl border border-[#10271C]/10 focus:outline-none focus:border-[#D4AF37]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#10271C] mb-2">Delivery End Time</label>
                <input
                  type="time"
                  value={settings.deliveryEndTime || ""}
                  onChange={(e) => handleChange("deliveryEndTime", e.target.value)}
                  className="w-full px-4 py-2 rounded-xl border border-[#10271C]/10 focus:outline-none focus:border-[#D4AF37]"
                />
              </div>
            </div>
          </div>

          {/* Referral Settings */}
          <div className="rounded-[20px] bg-white p-6 shadow-[0_8px_30px_rgba(0,0,0,.06)]">
            <h2 className="font-serif text-lg font-semibold text-[#10271C] mb-6">Referral Program</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-[#10271C] mb-2">Referral Reward (per successful referral)</label>
                <input
                  type="text"
                  value={settings.referralReward || ""}
                  onChange={(e) => handleChange("referralReward", e.target.value)}
                  className="w-full px-4 py-2 rounded-xl border border-[#10271C]/10 focus:outline-none focus:border-[#D4AF37]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#10271C] mb-2">Reward Value (₹)</label>
                <input
                  type="number"
                  value={settings.referralRewardValue || ""}
                  onChange={(e) => handleChange("referralRewardValue", e.target.value)}
                  className="w-full px-4 py-2 rounded-xl border border-[#10271C]/10 focus:outline-none focus:border-[#D4AF37]"
                />
              </div>
            </div>
          </div>

          {/* WhatsApp Settings */}
          <div className="rounded-[20px] bg-white p-6 shadow-[0_8px_30px_rgba(0,0,0,.06)]">
            <h2 className="font-serif text-lg font-semibold text-[#10271C] mb-6">WhatsApp Settings</h2>
            <div>
              <label className="block text-sm font-medium text-[#10271C] mb-2">WhatsApp Business Number</label>
              <input
                type="tel"
                value={settings.whatsappNumber || ""}
                onChange={(e) => handleChange("whatsappNumber", e.target.value)}
                className="w-full px-4 py-2 rounded-xl border border-[#10271C]/10 focus:outline-none focus:border-[#D4AF37]"
              />
            </div>
          </div>

          {/* Brand Assets */}
          <div className="rounded-[20px] bg-white p-6 shadow-[0_8px_30px_rgba(0,0,0,.06)]">
            <h2 className="font-serif text-lg font-semibold text-[#10271C] mb-6">Brand Assets</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-[#10271C] mb-2">Company Logo</label>
                <div className="border-2 border-dashed border-[#10271C]/20 rounded-xl p-6 text-center">
                  <Upload className="w-8 h-8 mx-auto text-[#666] mb-2" />
                  <p className="text-sm text-[#666]">Click to upload</p>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-[#10271C] mb-2">Hero Image</label>
                <div className="border-2 border-dashed border-[#10271C]/20 rounded-xl p-6 text-center">
                  <Upload className="w-8 h-8 mx-auto text-[#666] mb-2" />
                  <p className="text-sm text-[#666]">Click to upload</p>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-[#10271C] mb-2">Referral Banner</label>
                <div className="border-2 border-dashed border-[#10271C]/20 rounded-xl p-6 text-center">
                  <Upload className="w-8 h-8 mx-auto text-[#666] mb-2" />
                  <p className="text-sm text-[#666]">Click to upload</p>
                </div>
              </div>
            </div>
          </div>

          {/* Save Button */}
          <div className="flex justify-end">
            <button 
              onClick={handleSave}
              disabled={saving}
              className="px-8 py-3 rounded-xl bg-[#10271C] text-white font-semibold hover:bg-[#0F291D] transition-colors disabled:opacity-50"
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>
      </AdminLayout>
    </AdminProtectedRoute>
  );
}
