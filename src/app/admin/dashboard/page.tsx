"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import AdminLayout from "@/components/admin/AdminLayout";
import {
  Package,
  Layers,
  Boxes,
  AlertTriangle,
  XCircle,
  Share2,
  MessageSquare,
  Plus,
  ArrowUpRight,
  ArrowDownRight,
  Download,
  Clock,
  ChevronRight,
  TrendingUp,
  Activity,
} from "lucide-react";
import { exportToCSV } from "@/lib/export";
import { formatDate } from "@/lib/utils";

export default function AdminDashboardPage() {
  const [metrics, setMetrics] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMetrics();
  }, []);

  const fetchMetrics = async () => {
    try {
      const res = await fetch("/api/admin/dashboard");
      if (res.ok) {
        const data = await res.json();
        setMetrics(data);
      }
    } catch (err) {
      console.error("Failed to load dashboard metrics", err);
    } finally {
      setLoading(false);
    }
  };

  const handleExportStockReport = () => {
    if (!metrics?.recentMovements) return;
    const headers = ["Timestamp", "Product Name", "SKU", "Change", "Previous Stock", "New Stock", "Type", "Admin", "Note"];
    const rows = metrics.recentMovements.map((m: any) => [
      formatDate(m.created_at),
      m.product_name || "N/A",
      m.product_sku || "N/A",
      m.quantity_changed > 0 ? `+${m.quantity_changed}` : m.quantity_changed,
      m.previous_stock,
      m.new_stock,
      m.movement_type,
      m.admin_user_name,
      m.note || "",
    ]);
    exportToCSV(`ProTech_StockMovements_${new Date().toISOString().split("T")[0]}`, headers, rows);
  };

  if (loading) {
    return (
      <AdminLayout title="Factory Dashboard" subtitle="Real-time Assembly & Stock Telemetry">
        <div className="h-64 flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Operational Dashboard" subtitle="Electronics Assembling Plant Telemetry & Wholesale Control">
      {/* Quick Action Bar */}
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4 bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Quick Actions:</span>
          <div className="flex flex-wrap gap-2">
            <Link
              href="/admin/products/add"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-sm transition"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Product</span>
            </Link>
            <Link
              href="/admin/categories"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-800 dark:text-slate-200 text-xs font-semibold transition"
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Categories</span>
            </Link>
            <Link
              href="/admin/inventory"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-800 dark:text-slate-200 text-xs font-semibold transition"
            >
              <Boxes className="w-3.5 h-3.5" />
              <span>Adjust Stock</span>
            </Link>
            <Link
              href="/admin/share-links/create"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-800 dark:text-slate-200 text-xs font-semibold transition"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>Generate Link</span>
            </Link>
            <Link
              href="/admin/bookings"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-xs font-semibold transition"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Pending Bookings ({metrics?.pendingBookingRequests || 0})</span>
            </Link>
          </div>
        </div>

        <button
          onClick={handleExportStockReport}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 text-slate-700 dark:text-slate-200 text-xs font-semibold transition shadow-sm"
        >
          <Download className="w-3.5 h-3.5 text-slate-500" />
          <span>Export Stock Log (CSV)</span>
        </button>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {/* Total Products */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Total Products</span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <Package className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              {metrics?.totalProducts || 0}
            </span>
            <span className="text-xs font-medium text-slate-500">Across {metrics?.totalCategories || 0} Categories</span>
          </div>
        </div>

        {/* Total Stock Units */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Warehouse Stock</span>
            <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <Boxes className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              {(metrics?.totalStockUnits || 0).toLocaleString("en-IN")}
            </span>
            <span className="text-xs font-medium text-slate-500">Physical Units</span>
          </div>
        </div>

        {/* Low Stock Alerts */}
        <div className="bg-white dark:bg-slate-900 border border-amber-200 dark:border-amber-900/50 rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
              Low Stock Alerts
            </span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold tracking-tight text-amber-600 dark:text-amber-400">
              {metrics?.lowStockProducts || 0}
            </span>
            <span className="text-xs font-medium text-slate-500">At / Below Threshold</span>
          </div>
        </div>

        {/* Pending Bookings */}
        <div className="bg-white dark:bg-slate-900 border border-emerald-200 dark:border-emerald-900/50 rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
              Pending Orders
            </span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <MessageSquare className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold tracking-tight text-emerald-600 dark:text-emerald-400">
              {metrics?.pendingBookingRequests || 0}
            </span>
            <span className="text-xs font-medium text-slate-500">From WhatsApp Cart</span>
          </div>
        </div>
      </div>

      {/* Category Inventory Breakdown */}
      <div className="mb-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white">
              Category-Wise Inventory Distribution
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">Assembled units distribution across active product divisions</p>
          </div>
          <Link
            href="/admin/categories"
            className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
          >
            <span>Manage Divisions</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {metrics?.categoryDistribution?.map((cat: any, idx: number) => (
            <div
              key={idx}
              className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex flex-col justify-between"
            >
              <div>
                <p className="text-xs font-bold text-slate-700 dark:text-slate-300 truncate">{cat.categoryName}</p>
                <p className="text-[11px] text-slate-500">{cat.productsCount} Products Listed</p>
              </div>
              <div className="mt-3">
                <span className="text-xl font-black text-slate-900 dark:text-white">
                  {cat.totalUnits.toLocaleString("en-IN")}
                </span>
                <span className="text-[10px] text-slate-400 ml-1">Units</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Two Column Layout: Stock Movement Log & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Stock Movement Table */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm overflow-hidden flex flex-col">
          <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                Live Stock Movement Log
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">Audited assembly, dispatches and reservations</p>
            </div>
            <Link
              href="/admin/stock-history"
              className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
            >
              <span>View Full History</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="overflow-x-auto flex-1">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-950 text-slate-500 font-semibold uppercase tracking-wider border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="py-3 px-4">Time</th>
                  <th className="py-3 px-4">Product / SKU</th>
                  <th className="py-3 px-4">Change</th>
                  <th className="py-3 px-4">Stock Balance</th>
                  <th className="py-3 px-4">Type</th>
                  <th className="py-3 px-4">Admin / Note</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                {metrics?.recentMovements?.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-6 text-center text-slate-400">
                      No stock movements recorded yet.
                    </td>
                  </tr>
                ) : (
                  metrics?.recentMovements?.map((m: any) => (
                    <tr key={m.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition">
                      <td className="py-3 px-4 whitespace-nowrap text-slate-400">
                        {formatDate(m.created_at)}
                      </td>
                      <td className="py-3 px-4 font-semibold text-slate-900 dark:text-white max-w-[180px] truncate">
                        {m.product_name}
                        <span className="block text-[10px] font-mono text-slate-400">{m.product_sku}</span>
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap font-bold">
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] ${
                            m.quantity_changed > 0
                              ? "bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400"
                              : "bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400"
                          }`}
                        >
                          {m.quantity_changed > 0 ? (
                            <ArrowUpRight className="w-3 h-3" />
                          ) : (
                            <ArrowDownRight className="w-3 h-3" />
                          )}
                          {m.quantity_changed > 0 ? `+${m.quantity_changed}` : m.quantity_changed}
                        </span>
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap">
                        <span className="text-slate-400">{m.previous_stock}</span>
                        <span className="mx-1 text-slate-300">&rarr;</span>
                        <span className="font-bold text-slate-900 dark:text-white">{m.new_stock}</span>
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap capitalize text-slate-500">
                        {m.movement_type.replace(/_/g, " ")}
                      </td>
                      <td className="py-3 px-4 max-w-[180px] truncate text-slate-400">
                        <span className="font-medium text-slate-600 dark:text-slate-300">{m.admin_user_name}: </span>
                        {m.note || "No remarks"}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Pending Bookings & Activity Sidebar */}
        <div className="space-y-6">
          {/* Pending WhatsApp Bookings */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-200 dark:border-slate-800">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-emerald-500" />
                <span>Recent WhatsApp Orders</span>
              </h3>
              <Link href="/admin/bookings" className="text-xs text-blue-500 hover:underline">
                All
              </Link>
            </div>

            <div className="space-y-3">
              {metrics?.recentBookings?.length === 0 ? (
                <p className="text-xs text-slate-400 text-center py-4">No recent bookings submitted.</p>
              ) : (
                metrics?.recentBookings?.map((b: any) => (
                  <div
                    key={b.id}
                    className="p-3 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex items-start justify-between"
                  >
                    <div>
                      <p className="text-xs font-bold text-slate-900 dark:text-white">{b.booking_reference}</p>
                      <p className="text-[11px] text-slate-500">{b.recipient_name}</p>
                      <span className="inline-block mt-1 text-[10px] font-bold px-2 py-0.5 rounded uppercase bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400">
                        {b.status}
                      </span>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-bold text-slate-900 dark:text-white">
                        ₹{(b.total_estimated_amount || 0).toLocaleString("en-IN")}
                      </p>
                      <Link
                        href="/admin/bookings"
                        className="inline-block mt-2 text-[10px] font-semibold text-blue-600 hover:underline"
                      >
                        Review &rarr;
                      </Link>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Activity Logs */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-200 dark:border-slate-800">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-2">
                <Activity className="w-4 h-4 text-blue-500" />
                <span>System Audit Logs</span>
              </h3>
              <Link href="/admin/activity" className="text-xs text-blue-500 hover:underline">
                View All
              </Link>
            </div>

            <div className="space-y-2.5">
              {metrics?.recentActivities?.slice(0, 5).map((act: any) => (
                <div key={act.id} className="text-xs border-l-2 border-blue-500 pl-3 py-1">
                  <p className="font-semibold text-slate-800 dark:text-slate-200">{act.action}</p>
                  <p className="text-[10px] text-slate-400">
                    By {act.user_name} &bull; {formatDate(act.created_at)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
