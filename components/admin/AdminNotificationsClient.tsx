"use client";

import { useState, useEffect } from "react";
import AdminLayout from "./AdminLayout";
import AdminProtectedRoute from "./AdminProtectedRoute";
import { fetchWithAdminAuth } from "@/lib/api";
import { Send, Users, MessageSquare, Mail, Check, Gift } from "lucide-react";

export default function AdminNotificationsClient() {
  const [recipientType, setRecipientType] = useState("all");
  const [channel, setChannel] = useState("push");
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const data = await fetchWithAdminAuth("/api/notifications");
      setNotifications(data.notifications || []);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSendNotification = async () => {
    if (!title || !message) {
      alert("Please fill in both title and message");
      return;
    }

    try {
      setSending(true);
      await fetchWithAdminAuth("/api/notifications", {
        method: "POST",
        body: JSON.stringify({
          title,
          message,
          recipientType,
          channel,
        }),
      });
      setTitle("");
      setMessage("");
      fetchNotifications();
    } catch (error) {
      console.error("Error sending notification:", error);
      alert("Failed to send notification");
    } finally {
      setSending(false);
    }
  };

  return (
    <AdminProtectedRoute>
      <AdminLayout>
        <div className="space-y-6">
          {/* Header */}
          <div>
            <h1 className="font-serif text-2xl font-bold text-[#10271C]">Notifications</h1>
            <p className="text-[#666]">Send notifications to customers</p>
          </div>

          {/* Notification Form */}
          <div className="rounded-[20px] bg-white p-6 shadow-[0_8px_30px_rgba(0,0,0,.06)]">
            <h2 className="font-serif text-lg font-semibold text-[#10271C] mb-6">Send New Notification</h2>
            
            <div className="space-y-6">
              {/* Recipient Type */}
              <div>
                <label className="block text-sm font-medium text-[#10271C] mb-2">Recipients</label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <button
                    onClick={() => setRecipientType("all")}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      recipientType === "all"
                        ? "border-[#10271C] bg-[#10271C]/5"
                        : "border-[#10271C]/10 hover:border-[#10271C]/30"
                    }`}
                  >
                    <Users className="w-5 h-5 mx-auto mb-2 text-[#10271C]" />
                    <p className="text-sm font-medium text-[#10271C]">All Customers</p>
                  </button>
                  <button
                    onClick={() => setRecipientType("selected")}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      recipientType === "selected"
                        ? "border-[#10271C] bg-[#10271C]/5"
                        : "border-[#10271C]/10 hover:border-[#10271C]/30"
                    }`}
                  >
                    <Users className="w-5 h-5 mx-auto mb-2 text-[#10271C]" />
                    <p className="text-sm font-medium text-[#10271C]">Selected Customers</p>
                  </button>
                  <button
                    onClick={() => setRecipientType("referral")}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      recipientType === "referral"
                        ? "border-[#10271C] bg-[#10271C]/5"
                        : "border-[#10271C]/10 hover:border-[#10271C]/30"
                    }`}
                  >
                    <Gift className="w-5 h-5 mx-auto mb-2 text-[#D4AF37]" />
                    <p className="text-sm font-medium text-[#10271C]">Referral Users</p>
                  </button>
                </div>
              </div>

              {/* Channel */}
              <div>
                <label className="block text-sm font-medium text-[#10271C] mb-2">Channel</label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <button
                    onClick={() => setChannel("push")}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      channel === "push"
                        ? "border-[#10271C] bg-[#10271C]/5"
                        : "border-[#10271C]/10 hover:border-[#10271C]/30"
                    }`}
                  >
                    <MessageSquare className="w-5 h-5 mx-auto mb-2 text-[#10271C]" />
                    <p className="text-sm font-medium text-[#10271C]">Push Notification</p>
                  </button>
                  <button
                    onClick={() => setChannel("email")}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      channel === "email"
                        ? "border-[#10271C] bg-[#10271C]/5"
                        : "border-[#10271C]/10 hover:border-[#10271C]/30"
                    }`}
                  >
                    <Mail className="w-5 h-5 mx-auto mb-2 text-[#10271C]" />
                    <p className="text-sm font-medium text-[#10271C]">Email</p>
                  </button>
                  <button
                    onClick={() => setChannel("whatsapp")}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      channel === "whatsapp"
                        ? "border-[#10271C] bg-[#10271C]/5"
                        : "border-[#10271C]/10 hover:border-[#10271C]/30"
                    }`}
                  >
                    <Send className="w-5 h-5 mx-auto mb-2 text-green-600" />
                    <p className="text-sm font-medium text-[#10271C]">WhatsApp</p>
                  </button>
                </div>
              </div>

              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-[#10271C] mb-2">Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter notification title..."
                  className="w-full px-4 py-3 rounded-xl border border-[#10271C]/10 focus:outline-none focus:border-[#D4AF37]"
                />
              </div>

              {/* Message */}
              <div>
                <label className="block text-sm font-medium text-[#10271C] mb-2">Message</label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={4}
                  placeholder="Enter your notification message..."
                  className="w-full px-4 py-3 rounded-xl border border-[#10271C]/10 focus:outline-none focus:border-[#D4AF37]"
                />
              </div>

              {/* Send Button */}
              <button 
                onClick={handleSendNotification}
                disabled={sending}
                className="flex items-center justify-center gap-2 px-8 py-3 rounded-xl bg-[#10271C] text-white font-semibold hover:bg-[#0F291D] transition-colors disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
                {sending ? "Sending..." : "Send Notification"}
              </button>
            </div>
          </div>

          {/* Recent Notifications */}
          <div className="rounded-[20px] bg-white p-6 shadow-[0_8px_30px_rgba(0,0,0,.06)]">
            <h2 className="font-serif text-lg font-semibold text-[#10271C] mb-4">Recent Notifications</h2>
            {loading ? (
              <p className="text-[#666]">Loading notifications...</p>
            ) : notifications.length > 0 ? (
              <div className="space-y-3">
                {notifications.map((notification) => (
                  <div key={notification._id} className="flex items-center justify-between p-4 rounded-xl bg-[#F8F6F0]">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                        <Check className="w-5 h-5 text-green-600" />
                      </div>
                      <div>
                        <p className="font-medium text-[#10271C]">{notification.title}</p>
                        <p className="text-sm text-[#666]">
                          Sent to {notification.recipientType} • {notification.channel} • {new Date(notification.sentAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full ${notification.status === "Sent" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>
                      {notification.status}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-[#666]">No notifications sent yet</p>
            )}
          </div>
        </div>
      </AdminLayout>
    </AdminProtectedRoute>
  );
}
