"use client";

import React, { useState, useEffect } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import {
  FileBarChart2,
  Download,
  FileSpreadsheet,
  FileText,
  Boxes,
  Layers,
  AlertTriangle,
  History,
  DollarSign,
  Share2,
  MessageSquare,
  Activity,
} from "lucide-react";
import { exportToCSV, exportToExcel, exportToPDF } from "@/lib/export";
import { formatDate } from "@/lib/utils";

type ReportType =
  | "inventory"
  | "category"
  | "low_stock"
  | "movements"
  | "valuation"
  | "share_links"
  | "bookings"
  | "activity";

export default function AdminReportsPage() {
  const [activeReport, setActiveReport] = useState<ReportType>("inventory");
  const [data, setData] = useState<{
    products: any[];
    categories: any[];
    movements: any[];
    links: any[];
    bookings: any[];
    activities: any[];
  }>({
    products: [],
    categories: [],
    movements: [],
    links: [],
    bookings: [],
    activities: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    setLoading(true);
    try {
      const [pRes, cRes, mRes, lRes, bRes, aRes] = await Promise.all([
        fetch("/api/admin/products"),
        fetch("/api/admin/categories"),
        fetch("/api/admin/stock-history"),
        fetch("/api/admin/share-links"),
        fetch("/api/admin/bookings"),
        fetch("/api/admin/activity"),
      ]);

      setData({
        products: pRes.ok ? await pRes.json() : [],
        categories: cRes.ok ? await cRes.json() : [],
        movements: mRes.ok ? await mRes.json() : [],
        links: lRes.ok ? await lRes.json() : [],
        bookings: bRes.ok ? await bRes.json() : [],
        activities: aRes.ok ? await aRes.json() : [],
      });
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const getReportPayload = (): { title: string; headers: string[]; rows: (string | number)[][] } => {
    switch (activeReport) {
      case "inventory":
        return {
          title: "Complete Inventory Report",
          headers: ["Product Name", "SKU", "Category", "Current Stock", "Reserved", "Available", "Unit", "Selling Price", "Internal Cost"],
          rows: data.products.map((p) => [
            p.name,
            p.sku,
            p.category?.name || "General",
            p.current_stock ?? 0,
            p.reserved_stock ?? 0,
            p.available_stock ?? p.current_stock ?? 0,
            p.unit,
            `INR ${p.default_selling_price}`,
            `INR ${p.internal_cost ?? 0}`,
          ]),
        };

      case "category":
        return {
          title: "Category Division Summary",
          headers: ["Category Name", "Slug", "Total Products", "Total Stock Units", "Markup %"],
          rows: data.categories.map((c) => {
            const prods = data.products.filter((p) => p.category_id === c.id);
            const totalStock = prods.reduce((sum, p) => sum + (p.current_stock ?? 0), 0);
            return [c.name, c.slug, prods.length, totalStock, `${c.default_markup_percent || 0}%`];
          }),
        };

      case "low_stock":
        const lowItems = data.products.filter((p) => (p.current_stock ?? 0) <= p.min_stock_threshold);
        return {
          title: "Low Stock & Replenishment Alert Report",
          headers: ["Product Name", "SKU", "Current Stock", "Threshold", "Deficit / To Assemble", "Unit"],
          rows: lowItems.map((p) => {
            const stock = p.current_stock ?? 0;
            const deficit = Math.max(0, p.min_stock_threshold - stock);
            return [p.name, p.sku, stock, p.min_stock_threshold, deficit, p.unit];
          }),
        };

      case "movements":
        return {
          title: "Stock Movement Audit Report",
          headers: ["Date", "Product", "SKU", "Change", "Previous", "New Stock", "Type", "Admin", "Note"],
          rows: data.movements.map((m) => [
            formatDate(m.created_at),
            m.product_name,
            m.product_sku || "",
            m.quantity_changed > 0 ? `+${m.quantity_changed}` : m.quantity_changed,
            m.previous_stock,
            m.new_stock,
            m.movement_type,
            m.admin_user_name,
            m.note || "",
          ]),
        };

      case "valuation":
        return {
          title: "Inventory Cost Valuation Report",
          headers: ["Product Name", "SKU", "Physical Units", "Unit Cost", "Total Asset Value (INR)"],
          rows: data.products.map((p) => {
            const stock = p.current_stock ?? 0;
            const cost = p.internal_cost ?? 0;
            const total = stock * cost;
            return [p.name, p.sku, stock, `INR ${cost}`, `INR ${total.toLocaleString("en-IN")}`];
          }),
        };

      case "share_links":
        return {
          title: "Wholesale Share Links & Distributor Access Report",
          headers: ["Recipient Name", "Company", "Login ID", "Token", "Status", "Expires", "Created Date"],
          rows: data.links.map((l) => [
            l.recipient_name || "",
            l.company_name || "",
            l.login_id || "",
            l.token,
            l.status,
            l.expires_at ? formatDate(l.expires_at) : "No Expiry",
            formatDate(l.created_at),
          ]),
        };

      case "bookings":
        return {
          title: "WhatsApp Bulk Order Bookings Report",
          headers: ["Reference", "Recipient", "Total Estimated Amount", "Status", "Date", "Line Items"],
          rows: data.bookings.map((b) => [
            b.booking_reference,
            b.recipient_name,
            `INR ${(b.total_estimated_amount || 0).toLocaleString("en-IN")}`,
            b.status,
            formatDate(b.created_at),
            b.items?.length || 0,
          ]),
        };

      case "activity":
        return {
          title: "System Activity & User Audit Report",
          headers: ["Timestamp", "User", "Role", "Action", "Module"],
          rows: data.activities.map((a) => [
            formatDate(a.created_at),
            a.user_name,
            a.user_role,
            a.action,
            a.module,
          ]),
        };
    }
  };

  const handleExportCSV = () => {
    const { title, headers, rows } = getReportPayload();
    exportToCSV(`ProTech_${activeReport}_${new Date().toISOString().split("T")[0]}`, headers, rows);
  };

  const handleExportExcel = () => {
    const { title, headers, rows } = getReportPayload();
    exportToExcel(`ProTech_${activeReport}_${new Date().toISOString().split("T")[0]}`, activeReport, headers, rows);
  };

  const handleExportPDF = () => {
    const { title, headers, rows } = getReportPayload();
    exportToPDF(
      title,
      "PRO TECH ENTERPRISES - Factory Inventory & Telemetry Management System",
      headers,
      rows,
      `ProTech_${activeReport}_${new Date().toISOString().split("T")[0]}`
    );
  };

  const reportTabs = [
    { id: "inventory", label: "Complete Inventory", icon: Boxes },
    { id: "category", label: "Category Summary", icon: Layers },
    { id: "low_stock", label: "Low Stock Alerts", icon: AlertTriangle },
    { id: "movements", label: "Stock Movements", icon: History },
    { id: "valuation", label: "Stock Valuation", icon: DollarSign },
    { id: "share_links", label: "Share Links", icon: Share2 },
    { id: "bookings", label: "WhatsApp Bookings", icon: MessageSquare },
    { id: "activity", label: "Activity Audit", icon: Activity },
  ];

  const currentPayload = getReportPayload();

  return (
    <AdminLayout title="Operational Reports & Analytics" subtitle="Generate, Filter & Export High-Fidelity CSV, Excel & PDF Audits">
      {/* Report Switcher Tabs */}
      <div className="mb-6 flex flex-wrap gap-2">
        {reportTabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeReport === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveReport(tab.id as ReportType)}
              className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition ${
                isActive
                  ? "bg-blue-600 text-white shadow-md shadow-blue-900/30"
                  : "bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50"
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Export Toolbar */}
      <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div>
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white">
            {currentPayload.title}
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            {currentPayload.rows.length} Records ready for immediate export
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleExportCSV}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 hover:bg-slate-100 text-slate-700 dark:text-slate-200 text-xs font-semibold shadow-sm transition"
          >
            <Download className="w-3.5 h-3.5 text-blue-500" />
            <span>CSV</span>
          </button>

          <button
            onClick={handleExportExcel}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 hover:bg-slate-100 text-slate-700 dark:text-slate-200 text-xs font-semibold shadow-sm transition"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-500" />
            <span>Excel (.xlsx)</span>
          </button>

          <button
            onClick={handleExportPDF}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 hover:bg-slate-100 text-slate-700 dark:text-slate-200 text-xs font-semibold shadow-sm transition"
          >
            <FileText className="w-3.5 h-3.5 text-rose-500" />
            <span>PDF Print</span>
          </button>
        </div>
      </div>

      {/* Preview Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto max-h-[550px]">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-950 text-slate-500 font-semibold uppercase tracking-wider border-b border-slate-200 dark:border-slate-800 sticky top-0 z-10">
              <tr>
                {currentPayload.headers.map((h, i) => (
                  <th key={i} className="py-3 px-4 whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
              {loading ? (
                <tr>
                  <td colSpan={currentPayload.headers.length} className="py-12 text-center text-slate-400">
                    Compiling report data...
                  </td>
                </tr>
              ) : currentPayload.rows.length === 0 ? (
                <tr>
                  <td colSpan={currentPayload.headers.length} className="py-12 text-center text-slate-400">
                    No data records available for this report type.
                  </td>
                </tr>
              ) : (
                currentPayload.rows.map((row, rIdx) => (
                  <tr key={rIdx} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition">
                    {row.map((cell, cIdx) => (
                      <td key={cIdx} className="py-2.5 px-4 whitespace-nowrap">
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
}
