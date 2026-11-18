"use client";

import React, { useState, useEffect } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import {
  MessageSquare,
  Search,
  Filter,
  Download,
  CheckCircle,
  XCircle,
  Clock,
  Package,
  ExternalLink,
  Truck,
  AlertCircle,
} from "lucide-react";
import { exportToCSV, exportToExcel } from "@/lib/export";
import { formatDate, formatCurrency } from "@/lib/utils";

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [selectedBooking, setSelectedBooking] = useState<any | null>(null);

  useEffect(() => {
    loadBookings();
  }, []);

  const loadBookings = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/bookings");
      if (res.ok) setBookings(await res.json());
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (bookingId: string, status: string, remarks?: string) => {
    try {
      const res = await fetch("/api/admin/bookings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookingId, status, adminRemarks: remarks }),
      });

      if (!res.ok) {
        const err = await res.json();
        alert(err.error || "Failed to update booking");
        return;
      }

      loadBookings();
      if (selectedBooking && selectedBooking.id === bookingId) {
        setSelectedBooking((prev: any) => ({ ...prev, status }));
      }
    } catch (e) {
      alert("Error updating booking");
    }
  };

  const handleExportCSV = () => {
    const headers = [
      "Booking Reference",
      "Recipient Name",
      "Company Name",
      "Estimated Total (INR)",
      "Status",
      "Date",
      "Items Count",
      "Admin Remarks",
    ];
    const rows = filteredBookings.map((b) => [
      b.booking_reference,
      b.recipient_name,
      b.company_name || "",
      b.total_estimated_amount,
      b.status,
      formatDate(b.created_at),
      b.items?.length || 0,
      b.admin_remarks || "",
    ]);
    exportToCSV(`ProTech_WhatsApp_Bookings_${new Date().toISOString().split("T")[0]}`, headers, rows);
  };

  const filteredBookings = bookings.filter((b) => {
    const matchesSearch =
      b.booking_reference?.toLowerCase().includes(search.toLowerCase()) ||
      b.recipient_name?.toLowerCase().includes(search.toLowerCase()) ||
      b.company_name?.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "all" || b.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <AdminLayout
      title="WhatsApp Bulk Order Requests"
      subtitle="Review, Approve, Reserve Stock & Fulfill B2B Wholesale Bookings"
    >
      {/* Controls */}
      <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Search reference, recipient or firm..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 focus:outline-none"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="text-xs px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 focus:outline-none"
          >
            <option value="all">All Booking Statuses</option>
            <option value="pending">Pending Review</option>
            <option value="approved">Approved (Stock Reserved)</option>
            <option value="fulfilled">Fulfilled (Dispatched)</option>
            <option value="rejected">Rejected</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>

        <button
          onClick={handleExportCSV}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-slate-50 text-slate-700 dark:text-slate-300 text-xs font-semibold shadow-sm transition"
        >
          <Download className="w-3.5 h-3.5 text-slate-500" />
          <span>Export Bookings (CSV)</span>
        </button>
      </div>

      {/* Bookings Table Card */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-950 text-slate-500 font-semibold uppercase tracking-wider border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="py-3.5 px-4">Booking Ref</th>
                <th className="py-3.5 px-4">Buyer / Distributor</th>
                <th className="py-3.5 px-4">Requested Products</th>
                <th className="py-3.5 px-4">Estimated Total</th>
                <th className="py-3.5 px-4">Date</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Decision Controls</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    Loading WhatsApp bulk booking records...
                  </td>
                </tr>
              ) : filteredBookings.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    No bookings found matching filter criteria.
                  </td>
                </tr>
              ) : (
                filteredBookings.map((b) => (
                  <tr key={b.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition">
                    <td className="py-3 px-4 whitespace-nowrap font-mono font-bold text-blue-600 dark:text-blue-400">
                      {b.booking_reference}
                    </td>

                    <td className="py-3 px-4">
                      <p className="font-bold text-slate-900 dark:text-white">{b.recipient_name}</p>
                      {b.company_name && (
                        <p className="text-[11px] text-slate-500">{b.company_name}</p>
                      )}
                    </td>

                    <td className="py-3 px-4 max-w-[220px]">
                      <span className="font-semibold text-slate-800 dark:text-slate-200">
                        {b.items?.length || 0} Products Selected
                      </span>
                      <button
                        onClick={() => setSelectedBooking(b)}
                        className="text-[11px] text-blue-500 hover:underline block mt-0.5"
                      >
                        Inspect Line Items &rarr;
                      </button>
                    </td>

                    <td className="py-3 px-4 whitespace-nowrap font-bold text-slate-900 dark:text-white">
                      ₹{(b.total_estimated_amount || 0).toLocaleString("en-IN")}
                    </td>

                    <td className="py-3 px-4 whitespace-nowrap text-slate-400">
                      {formatDate(b.created_at)}
                    </td>

                    <td className="py-3 px-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase ${
                          b.status === "approved"
                            ? "bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 border border-indigo-300 dark:border-indigo-800"
                            : b.status === "fulfilled"
                            ? "bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-800"
                            : b.status === "pending"
                            ? "bg-amber-50 dark:bg-amber-950 text-amber-600 dark:text-amber-400 border border-amber-300 dark:border-amber-800"
                            : "bg-rose-50 dark:bg-rose-950 text-rose-600 dark:text-rose-400 border border-rose-300 dark:border-rose-800"
                        }`}
                      >
                        {b.status}
                      </span>
                    </td>

                    <td className="py-3 px-4 whitespace-nowrap text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {b.status === "pending" && (
                          <>
                            <button
                              onClick={() => handleUpdateStatus(b.id, "approved", "Approved and inventory reserved")}
                              className="px-2.5 py-1 rounded-lg bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 text-[11px] font-bold hover:bg-indigo-100 transition"
                            >
                              Approve & Reserve
                            </button>
                            <button
                              onClick={() => handleUpdateStatus(b.id, "rejected", "Declined by admin")}
                              className="px-2.5 py-1 rounded-lg bg-rose-50 dark:bg-rose-950 text-rose-600 dark:text-rose-400 text-[11px] font-bold hover:bg-rose-100 transition"
                            >
                              Reject
                            </button>
                          </>
                        )}

                        {b.status === "approved" && (
                          <>
                            <button
                              onClick={() => handleUpdateStatus(b.id, "fulfilled", "Dispatched to buyer")}
                              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-bold shadow-sm transition"
                            >
                              <Truck className="w-3 h-3" />
                              <span>Dispatch & Fulfill</span>
                            </button>
                            <button
                              onClick={() => handleUpdateStatus(b.id, "cancelled", "Cancelled by admin")}
                              className="px-2 py-1 rounded-lg text-rose-500 text-[11px] font-semibold hover:underline"
                            >
                              Cancel
                            </button>
                          </>
                        )}

                        {b.status === "fulfilled" && (
                          <span className="text-[11px] font-semibold text-emerald-600 flex items-center gap-1">
                            <CheckCircle className="w-3.5 h-3.5" />
                            <span>Fulfilled & Logged</span>
                          </span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Booking Items Inspection Modal */}
      {selectedBooking && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 max-w-xl w-full shadow-2xl">
            <div className="flex items-start justify-between mb-4 pb-3 border-b border-slate-100 dark:border-slate-800">
              <div>
                <span className="font-mono text-xs text-blue-600 font-bold block">
                  {selectedBooking.booking_reference}
                </span>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  {selectedBooking.recipient_name}
                </h3>
                {selectedBooking.company_name && (
                  <p className="text-xs text-slate-500">{selectedBooking.company_name}</p>
                )}
              </div>

              <span className="text-xs font-bold px-2.5 py-1 rounded-full uppercase bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                {selectedBooking.status}
              </span>
            </div>

            {/* Line Items */}
            <div className="space-y-2 mb-6 max-h-60 overflow-y-auto pr-1">
              {selectedBooking.items?.map((item: any, idx: number) => (
                <div
                  key={idx}
                  className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex items-center justify-between"
                >
                  <div>
                    <p className="text-xs font-bold text-slate-900 dark:text-white">{item.product_name}</p>
                    <p className="text-[10px] text-slate-400 font-mono">
                      Quantity: {item.quantity} &bull; Unit Price: ₹{item.unit_price}
                    </p>
                  </div>
                  <span className="font-bold text-xs text-slate-900 dark:text-white">
                    ₹{item.total_price.toLocaleString("en-IN")}
                  </span>
                </div>
              ))}
            </div>

            <div className="p-3 bg-blue-50/50 dark:bg-blue-950/50 border border-blue-200 dark:border-blue-900 rounded-xl mb-6 flex items-center justify-between">
              <span className="text-xs font-bold text-blue-900 dark:text-blue-200 uppercase tracking-wider">
                Total Estimated Amount:
              </span>
              <span className="text-lg font-black text-blue-900 dark:text-blue-100">
                ₹{(selectedBooking.total_estimated_amount || 0).toLocaleString("en-IN")}
              </span>
            </div>

            {selectedBooking.whatsapp_message_payload && (
              <div className="mb-6">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                  Generated WhatsApp Message Preview:
                </span>
                <pre className="p-3 rounded-xl bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-[11px] font-mono text-slate-700 dark:text-slate-300 whitespace-pre-wrap max-h-36 overflow-y-auto">
                  {selectedBooking.whatsapp_message_payload}
                </pre>
              </div>
            )}

            <div className="flex items-center justify-end">
              <button
                onClick={() => setSelectedBooking(null)}
                className="px-5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-semibold hover:bg-slate-200 text-slate-800 dark:text-slate-200"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
