"use client";

import { useState } from "react";
import AdminLayout from "./AdminLayout";
import AdminProtectedRoute from "./AdminProtectedRoute";
import { fetchWithAdminAuth } from "@/lib/api";
import { FileText, Download, BarChart3, Users, ShoppingCart, RefreshCw, Gift } from "lucide-react";

const REPORTS = [
  { id: 1, name: "Sales Report", description: "Monthly sales and revenue analysis", icon: BarChart3, type: "sales" },
  { id: 2, name: "Customer Report", description: "Customer growth and retention metrics", icon: Users, type: "customers" },
  { id: 3, name: "Referral Report", description: "Referral program performance", icon: Gift, type: "referrals" },
  { id: 4, name: "Revenue Report", description: "Detailed revenue breakdown", icon: ShoppingCart, type: "revenue" },
  { id: 5, name: "Subscription Report", description: "Active and cancelled subscriptions", icon: RefreshCw, type: "subscriptions" },
];

export default function AdminReportsClient() {
  const [reportType, setReportType] = useState("sales");
  const [dateRange, setDateRange] = useState("30");
  const [loading, setLoading] = useState(false);
  const [reportData, setReportData] = useState<any>(null);

  const fetchReportData = async () => {
    try {
      setLoading(true);
      const data = await fetchWithAdminAuth(`/api/reports?type=${reportType}&days=${dateRange}`);
      setReportData(data);
    } catch (error) {
      console.error("Error fetching report data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateReport = () => {
    fetchReportData();
  };

  return (
    <AdminProtectedRoute>
      <AdminLayout>
        <div className="space-y-6">
          {/* Header */}
          <div>
            <h1 className="font-serif text-2xl font-bold text-[#10271C]">Reports</h1>
            <p className="text-[#666]">View and download business reports</p>
          </div>

          {/* Reports Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {REPORTS.map((report) => (
              <div key={report.id} className="rounded-[20px] bg-white p-6 shadow-[0_8px_30px_rgba(0,0,0,.06)]">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-[#10271C]/5 flex items-center justify-center">
                    <report.icon className="w-6 h-6 text-[#10271C]" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-[#10271C]">{report.name}</h3>
                    <p className="text-xs text-[#666]">Type: {report.type}</p>
                  </div>
                </div>
                <p className="text-sm text-[#666] mb-4">{report.description}</p>
                <div className="flex gap-2">
                  <button className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-[#10271C] text-white text-sm font-medium hover:bg-[#0F291D] transition-colors">
                    <Download className="w-4 h-4" />
                    PDF
                  </button>
                  <button className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg border border-[#10271C]/20 text-[#10271C] text-sm font-medium hover:bg-[#10271C]/5 transition-colors">
                    <Download className="w-4 h-4" />
                    Excel
                  </button>
                  <button className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg border border-[#10271C]/20 text-[#10271C] text-sm font-medium hover:bg-[#10271C]/5 transition-colors">
                    <Download className="w-4 h-4" />
                    CSV
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Generate Custom Report */}
          <div className="rounded-[20px] bg-white p-6 shadow-[0_8px_30px_rgba(0,0,0,.06)]">
            <div className="flex items-center gap-3 mb-4">
              <FileText className="w-5 h-5 text-[#10271C]" />
              <h2 className="font-serif text-lg font-semibold text-[#10271C]">Generate Custom Report</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-[#10271C] mb-2">Report Type</label>
                <select 
                  value={reportType}
                  onChange={(e) => setReportType(e.target.value)}
                  className="w-full px-4 py-2 rounded-xl border border-[#10271C]/10 focus:outline-none focus:border-[#D4AF37]"
                >
                  <option value="sales">Sales</option>
                  <option value="customers">Customers</option>
                  <option value="referrals">Referrals</option>
                  <option value="revenue">Revenue</option>
                  <option value="subscriptions">Subscriptions</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-[#10271C] mb-2">Date Range</label>
                <select 
                  value={dateRange}
                  onChange={(e) => setDateRange(e.target.value)}
                  className="w-full px-4 py-2 rounded-xl border border-[#10271C]/10 focus:outline-none focus:border-[#D4AF37]"
                >
                  <option value="7">Last 7 Days</option>
                  <option value="30">Last 30 Days</option>
                  <option value="90">Last 90 Days</option>
                  <option value="365">This Year</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-[#10271C] mb-2">Format</label>
                <select className="w-full px-4 py-2 rounded-xl border border-[#10271C]/10 focus:outline-none focus:border-[#D4AF37]">
                  <option>PDF</option>
                  <option>Excel</option>
                  <option>CSV</option>
                </select>
              </div>
            </div>
            <button 
              onClick={handleGenerateReport}
              disabled={loading}
              className="mt-4 px-6 py-2 rounded-xl bg-[#10271C] text-white text-sm font-medium hover:bg-[#0F291D] transition-colors disabled:opacity-50"
            >
              {loading ? "Generating..." : "Generate Report"}
            </button>

            {reportData && (
              <div className="mt-6 p-4 rounded-xl bg-[#F8F6F0]">
                <h3 className="font-semibold text-[#10271C] mb-2">Report Data Preview</h3>
                <pre className="text-xs text-[#666] overflow-auto max-h-64">
                  {JSON.stringify(reportData, null, 2)}
                </pre>
              </div>
            )}
          </div>
        </div>
      </AdminLayout>
    </AdminProtectedRoute>
  );
}
