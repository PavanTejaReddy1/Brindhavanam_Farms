"use client";

import { useState, useEffect } from "react";
import AdminLayout from "./AdminLayout";
import AdminProtectedRoute from "./AdminProtectedRoute";
import { fetchWithAdminAuth } from "@/lib/api";
import { Search, Check, X, Gift, Users, TrendingUp } from "lucide-react";

export default function AdminReferralsClient() {
  const [referrals, setReferrals] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReferrals();
  }, []);

  const fetchReferrals = async () => {
    try {
      setLoading(true);
      const data = await fetchWithAdminAuth("/api/referrals");
      setReferrals(data.referrals || []);
    } catch (error) {
      console.error("Error fetching referrals:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (referralId: string, newStatus: string) => {
    try {
      await fetchWithAdminAuth(`/api/referrals/${referralId}`, {
        method: "PUT",
        body: JSON.stringify({ status: newStatus }),
      });
      fetchReferrals();
    } catch (error) {
      console.error("Error updating referral:", error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Successful": return "bg-green-100 text-green-700";
      case "Pending": return "bg-yellow-100 text-yellow-700";
      case "Rejected": return "bg-red-100 text-red-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  const filteredReferrals = referrals.filter((referral) =>
    referral.code?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalReferrals = referrals.length;
  const successfulReferrals = referrals.filter((r) => r.status === "Successful");
  const pendingReferrals = referrals.filter((r) => r.status === "Pending");
  const rewardsGiven = successfulReferrals.reduce((sum: number, r: any) => sum + (r.reward || 0), 0);
  const pendingRewards = pendingReferrals.reduce((sum: number, r: any) => sum + (r.reward || 0), 0);

  if (loading) {
    return (
      <AdminProtectedRoute>
        <AdminLayout>
          <div className="flex items-center justify-center h-64">
            <p className="text-[#666]">Loading referrals...</p>
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
            <h1 className="font-serif text-2xl font-bold text-[#10271C]">Referral Program</h1>
            <p className="text-[#666]">Manage referral rewards and analytics</p>
          </div>

          {/* KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="rounded-[20px] bg-white p-6 shadow-[0_8px_30px_rgba(0,0,0,.06)]">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-[#10271C]/5 flex items-center justify-center">
                  <Users className="w-6 h-6 text-[#10271C]" />
                </div>
              </div>
              <p className="text-2xl font-bold text-[#10271C]">{totalReferrals}</p>
              <p className="text-sm text-[#666]">Total Referrals</p>
            </div>
            <div className="rounded-[20px] bg-white p-6 shadow-[0_8px_30px_rgba(0,0,0,.06)]">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-[#10271C]/5 flex items-center justify-center">
                  <Gift className="w-6 h-6 text-[#10271C]" />
                </div>
              </div>
              <p className="text-2xl font-bold text-[#10271C]">₹{rewardsGiven}</p>
              <p className="text-sm text-[#666]">Rewards Given</p>
            </div>
            <div className="rounded-[20px] bg-white p-6 shadow-[0_8px_30px_rgba(0,0,0,.06)]">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-[#10271C]/5 flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-[#10271C]" />
                </div>
              </div>
              <p className="text-2xl font-bold text-[#10271C]">₹{pendingRewards}</p>
              <p className="text-sm text-[#666]">Pending Rewards</p>
            </div>
          </div>

          {/* Referrals Table */}
          <div className="rounded-[20px] bg-white shadow-[0_8px_30px_rgba(0,0,0,.06)] overflow-hidden">
            <div className="p-6 border-b border-[#10271C]/10">
              <div className="relative">
                <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-[#666]" />
                <input
                  type="text"
                  placeholder="Search referrals..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-xl border border-[#10271C]/10 focus:outline-none focus:border-[#D4AF37]"
                />
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-[#F8F6F0]">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-[#10271C]">Referral ID</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-[#10271C]">Referrer</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-[#10271C]">Referee</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-[#10271C]">Code</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-[#10271C]">Status</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-[#10271C]">Reward</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-[#10271C]">Date</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-[#10271C]">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredReferrals.length > 0 ? filteredReferrals.map((referral) => (
                    <tr key={referral._id} className="border-t border-[#10271C]/5 hover:bg-[#F8F6F0]/50">
                      <td className="px-6 py-4 text-sm font-medium text-[#10271C]">#{referral._id?.slice(-6).toUpperCase()}</td>
                      <td className="px-6 py-4 text-sm text-[#666]">{referral.referrerName}</td>
                      <td className="px-6 py-4 text-sm text-[#666]">{referral.refereeName}</td>
                      <td className="px-6 py-4">
                        <span className="text-xs px-2 py-1 rounded-full bg-[#D4AF37]/10 text-[#D4AF37] font-medium">
                          {referral.code}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`text-xs px-3 py-1 rounded-full ${getStatusColor(referral.status)}`}>
                          {referral.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm font-semibold text-[#10271C]">₹{referral.reward}</td>
                      <td className="px-6 py-4 text-sm text-[#666]">{new Date(referral.date).toLocaleDateString()}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          {referral.status === "Pending" && (
                            <>
                              <button 
                                onClick={() => handleStatusUpdate(referral._id, "Successful")}
                                className="p-2 rounded-lg hover:bg-green-50 transition-colors" 
                                title="Approve"
                              >
                                <Check className="w-4 h-4 text-green-600" />
                              </button>
                              <button 
                                onClick={() => handleStatusUpdate(referral._id, "Rejected")}
                                className="p-2 rounded-lg hover:bg-red-50 transition-colors" 
                                title="Reject"
                              >
                                <X className="w-4 h-4 text-red-500" />
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan={8} className="px-6 py-8 text-center text-[#666]">
                        No referrals found
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
