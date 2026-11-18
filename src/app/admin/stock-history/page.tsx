"use client";

import React, { useState, useEffect } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import {
  History,
  Search,
  Filter,
  Download,
  ArrowUpRight,
  ArrowDownRight,
  FileSpreadsheet,
} from "lucide-react";
import { exportToCSV, exportToExcel } from "@/lib/export";
import { formatDate } from "@/lib/utils";

export default function AdminStockHistoryPage() {
  const [movements, setMovements] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");

  useEffect(() => {
    fetch("/api/admin/stock-history")
      .then((res) => res.json())
      .then((data) => setMovements(data))
      .catch((e) => console.error(e))
      .finally(() => setLoading(false));
  }, []);

  const handleExportCSV = () => {
    const headers = [
      "Timestamp",
      "Product Name",
      "SKU",
      "Quantity Change",
      "Previous Stock",
      "New Stock",
      "Movement Type",
      "Logged By",
      "Remarks",
    ];
    const rows = filteredMovements.map((m) => [
      formatDate(m.created_at),
      m.product_name,
      m.product_sku || "N/A",
      m.quantity_changed > 0 ? `+${m.quantity_changed}` : m.quantity_changed,
      m.previous_stock,
      m.new_stock,
      m.movement_type,
      m.admin_user_name,
      m.note || "",
    ]);
    exportToCSV(`ProTech_StockHistory_${new Date().toISOString().split("T")[0]}`, headers, rows);
  };

  const filteredMovements = movements.filter((m) => {
    const matchesSearch =
      m.product_name?.toLowerCase().includes(search.toLowerCase()) ||
      m.product_sku?.toLowerCase().includes(search.toLowerCase()) ||
      m.note?.toLowerCase().includes(search.toLowerCase());
    const matchesType = typeFilter === "all" || m.movement_type === typeFilter;
    return matchesSearch && matchesType;
  });

  return (
    <AdminLayout title="Stock Movement Audit Trail" subtitle="Comprehensive Immutable History of Every Physical Inventory Change">
      <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Search by product, SKU, note..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 focus:outline-none"
            />
          </div>

          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="text-xs px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 focus:outline-none"
          >
            <option value="all">All Movement Classifications</option>
            <option value="production_addition">Production Additions</option>
            <option value="manual_addition">Manual Additions</option>
            <option value="manual_reduction">Manual Reductions</option>
            <option value="booking_fulfilment">Booking Fulfilments</option>
            <option value="damaged_stock">Damaged / Scrap</option>
            <option value="rejected_stock">Rejected Stock</option>
            <option value="stock_correction">Audit Corrections</option>
          </select>
        </div>

        <button
          onClick={handleExportCSV}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-slate-50 text-slate-700 dark:text-slate-300 text-xs font-semibold shadow-sm transition"
        >
          <Download className="w-3.5 h-3.5 text-slate-500" />
          <span>Export Audit Log (CSV)</span>
        </button>
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-950 text-slate-500 font-semibold uppercase tracking-wider border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="py-3.5 px-4">Timestamp</th>
                <th className="py-3.5 px-4">Product Name & SKU</th>
                <th className="py-3.5 px-4">Adjustment</th>
                <th className="py-3.5 px-4">Balance Impact</th>
                <th className="py-3.5 px-4">Classification</th>
                <th className="py-3.5 px-4">Recorded By & Remarks</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">
                    Loading movement history...
                  </td>
                </tr>
              ) : filteredMovements.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">
                    No movements matched criteria.
                  </td>
                </tr>
              ) : (
                filteredMovements.map((m) => (
                  <tr key={m.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition">
                    <td className="py-3 px-4 whitespace-nowrap text-slate-400">
                      {formatDate(m.created_at)}
                    </td>

                    <td className="py-3 px-4">
                      <p className="font-bold text-slate-900 dark:text-white">{m.product_name}</p>
                      <span className="text-[10px] font-mono text-slate-400">{m.product_sku}</span>
                    </td>

                    <td className="py-3 px-4 whitespace-nowrap font-bold">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs ${
                          m.quantity_changed > 0
                            ? "bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400"
                            : "bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400"
                        }`}
                      >
                        {m.quantity_changed > 0 ? (
                          <ArrowUpRight className="w-3.5 h-3.5" />
                        ) : (
                          <ArrowDownRight className="w-3.5 h-3.5" />
                        )}
                        {m.quantity_changed > 0 ? `+${m.quantity_changed}` : m.quantity_changed}
                      </span>
                    </td>

                    <td className="py-3 px-4 whitespace-nowrap">
                      <span className="text-slate-400">{m.previous_stock}</span>
                      <span className="mx-1 text-slate-300">&rarr;</span>
                      <span className="font-bold text-slate-900 dark:text-white">{m.new_stock} Units</span>
                    </td>

                    <td className="py-3 px-4 whitespace-nowrap capitalize text-slate-600 dark:text-slate-400">
                      <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 font-semibold text-[11px]">
                        {m.movement_type.replace(/_/g, " ")}
                      </span>
                    </td>

                    <td className="py-3 px-4 max-w-[240px]">
                      <p className="font-semibold text-slate-900 dark:text-white">{m.admin_user_name}</p>
                      <p className="text-[11px] text-slate-500 truncate">{m.note || "No remarks logged."}</p>
                    </td>
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
