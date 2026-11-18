"use client";

import React, { useState, useEffect } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import {
  Boxes,
  Search,
  Filter,
  Download,
  Plus,
  Minus,
  AlertTriangle,
  CheckCircle,
  XCircle,
  ArrowRight,
  TrendingUp,
} from "lucide-react";
import { exportToCSV, exportToExcel } from "@/lib/export";

export default function AdminInventoryPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const [adjustModal, setAdjustModal] = useState<{
    open: boolean;
    product: any | null;
    quantity: number;
    movementType: string;
    note: string;
  }>({
    open: false,
    product: null,
    quantity: 10,
    movementType: "production_addition",
    note: "",
  });

  useEffect(() => {
    loadInventory();
  }, []);

  const loadInventory = async () => {
    setLoading(true);
    try {
      const [pRes, cRes] = await Promise.all([
        fetch("/api/admin/products"),
        fetch("/api/admin/categories"),
      ]);
      if (pRes.ok) setProducts(await pRes.json());
      if (cRes.ok) setCategories(await cRes.json());
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleAdjustSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!adjustModal.product) return;

    const isNegative =
      adjustModal.movementType.includes("reduction") ||
      adjustModal.movementType === "damaged_stock" ||
      adjustModal.movementType === "rejected_stock";

    const change = isNegative ? -Math.abs(adjustModal.quantity) : Math.abs(adjustModal.quantity);

    try {
      const res = await fetch("/api/admin/inventory/adjust", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: adjustModal.product.id,
          quantityChange: change,
          movementType: adjustModal.movementType,
          note: adjustModal.note,
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        alert(err.error || "Adjustment failed");
        return;
      }

      setAdjustModal({
        open: false,
        product: null,
        quantity: 10,
        movementType: "production_addition",
        note: "",
      });
      loadInventory();
    } catch (e) {
      alert("Error committing stock update");
    }
  };

  const handleQuickDelta = async (prod: any, delta: number) => {
    try {
      const res = await fetch("/api/admin/inventory/adjust", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: prod.id,
          quantityChange: delta,
          movementType: delta > 0 ? "manual_addition" : "manual_reduction",
          note: `Quick factory floor adjustment (${delta > 0 ? "+" : ""}${delta})`,
        }),
      });
      if (res.ok) {
        loadInventory();
      } else {
        const err = await res.json();
        alert(err.error || "Failed");
      }
    } catch (e) {
      alert("Error");
    }
  };

  const handleExportCSV = () => {
    const headers = [
      "Product Name",
      "SKU",
      "Category",
      "Current Stock",
      "Reserved Stock",
      "Available Stock",
      "Min Stock Threshold",
      "Unit",
      "Status",
    ];
    const rows = filteredProducts.map((p) => {
      const stock = p.current_stock ?? 0;
      const reserved = p.reserved_stock ?? 0;
      const available = p.available_stock ?? stock;
      let status = "Adequate";
      if (stock === 0) status = "Out of Stock";
      else if (stock <= p.min_stock_threshold) status = "Low Stock";

      return [
        p.name,
        p.sku,
        p.category?.name || "General",
        stock,
        reserved,
        available,
        p.min_stock_threshold,
        p.unit,
        status,
      ];
    });
    exportToCSV(`ProTech_Inventory_Balances_${new Date().toISOString().split("T")[0]}`, headers, rows);
  };

  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.sku.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = categoryFilter === "all" || p.category_id === categoryFilter;
    const stock = p.current_stock ?? 0;

    let matchesStatus = true;
    if (statusFilter === "low") matchesStatus = stock > 0 && stock <= p.min_stock_threshold;
    else if (statusFilter === "out") matchesStatus = stock === 0;
    else if (statusFilter === "adequate") matchesStatus = stock > p.min_stock_threshold;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  return (
    <AdminLayout title="Physical Inventory & Stock Balances" subtitle="Real-time Assembly Tracking, Reserves & Warehouse Controls">
      {/* Controls */}
      <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Search product or SKU..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 focus:outline-none"
            />
          </div>

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="text-xs px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 focus:outline-none"
          >
            <option value="all">All Categories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="text-xs px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 focus:outline-none"
          >
            <option value="all">All Inventory States</option>
            <option value="adequate">Normal / Adequate</option>
            <option value="low">Low Stock Warning</option>
            <option value="out">Depleted / Out of Stock</option>
          </select>
        </div>

        <button
          onClick={handleExportCSV}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-slate-50 text-slate-700 dark:text-slate-300 text-xs font-semibold shadow-sm transition"
        >
          <Download className="w-3.5 h-3.5 text-slate-500" />
          <span>Export Inventory (CSV)</span>
        </button>
      </div>

      {/* Inventory Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-950 text-slate-500 font-semibold uppercase tracking-wider border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="py-3.5 px-4">Product Name & Code</th>
                <th className="py-3.5 px-4">Category</th>
                <th className="py-3.5 px-4">Warehouse Stock</th>
                <th className="py-3.5 px-4">Reserved (Orders)</th>
                <th className="py-3.5 px-4">Available For Sale</th>
                <th className="py-3.5 px-4">Alert Threshold</th>
                <th className="py-3.5 px-4">Quick Adjustment</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    Loading inventory telemetry...
                  </td>
                </tr>
              ) : filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    No products matched filter criteria.
                  </td>
                </tr>
              ) : (
                filteredProducts.map((p) => {
                  const stock = p.current_stock ?? 0;
                  const reserved = p.reserved_stock ?? 0;
                  const available = p.available_stock ?? Math.max(0, stock - reserved);
                  const isLow = stock > 0 && stock <= p.min_stock_threshold;
                  const isOut = stock <= 0;

                  return (
                    <tr key={p.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition">
                      <td className="py-3 px-4">
                        <p className="font-bold text-slate-900 dark:text-white">{p.name}</p>
                        <div className="flex items-center gap-2 text-[10px] text-slate-400 font-mono mt-0.5">
                          <span>{p.sku}</span>
                          <span>&bull;</span>
                          <span>{p.unit}</span>
                        </div>
                      </td>

                      <td className="py-3 px-4 whitespace-nowrap text-slate-500">
                        {p.category?.name || "General"}
                      </td>

                      {/* Current Stock */}
                      <td className="py-3 px-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${
                            isOut
                              ? "bg-rose-100 dark:bg-rose-950/80 text-rose-700 dark:text-rose-400 border border-rose-300 dark:border-rose-800"
                              : isLow
                              ? "bg-amber-100 dark:bg-amber-950/80 text-amber-700 dark:text-amber-400 border border-amber-300 dark:border-amber-800"
                              : "bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-800"
                          }`}
                        >
                          {stock.toLocaleString("en-IN")} Units
                        </span>
                      </td>

                      {/* Reserved Stock */}
                      <td className="py-3 px-4 whitespace-nowrap font-medium text-slate-600 dark:text-slate-400">
                        {reserved > 0 ? (
                          <span className="text-amber-600 dark:text-amber-400 font-bold">{reserved} Units</span>
                        ) : (
                          <span className="text-slate-400">0</span>
                        )}
                      </td>

                      {/* Available Stock */}
                      <td className="py-3 px-4 whitespace-nowrap font-bold text-slate-900 dark:text-white">
                        {available.toLocaleString("en-IN")} Units
                      </td>

                      {/* Threshold */}
                      <td className="py-3 px-4 whitespace-nowrap text-slate-500">
                        &le; {p.min_stock_threshold} Units
                      </td>

                      {/* Action */}
                      <td className="py-3 px-4 whitespace-nowrap">
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => handleQuickDelta(p, -5)}
                            disabled={stock <= 0}
                            className="px-2 py-1 rounded bg-slate-100 dark:bg-slate-800 hover:bg-rose-100 text-slate-700 dark:text-slate-300 hover:text-rose-600 font-bold text-[10px] transition disabled:opacity-30"
                          >
                            -5
                          </button>
                          <button
                            onClick={() => handleQuickDelta(p, -1)}
                            disabled={stock <= 0}
                            className="px-2 py-1 rounded bg-slate-100 dark:bg-slate-800 hover:bg-rose-100 text-slate-700 dark:text-slate-300 hover:text-rose-600 font-bold text-[10px] transition disabled:opacity-30"
                          >
                            -1
                          </button>
                          <button
                            onClick={() => handleQuickDelta(p, 1)}
                            className="px-2 py-1 rounded bg-slate-100 dark:bg-slate-800 hover:bg-emerald-100 text-slate-700 dark:text-slate-300 hover:text-emerald-600 font-bold text-[10px] transition"
                          >
                            +1
                          </button>
                          <button
                            onClick={() => handleQuickDelta(p, 10)}
                            className="px-2 py-1 rounded bg-slate-100 dark:bg-slate-800 hover:bg-emerald-100 text-slate-700 dark:text-slate-300 hover:text-emerald-600 font-bold text-[10px] transition"
                          >
                            +10
                          </button>
                          <button
                            onClick={() =>
                              setAdjustModal({
                                open: true,
                                product: p,
                                quantity: 50,
                                movementType: "production_addition",
                                note: "",
                              })
                            }
                            className="px-2.5 py-1 rounded bg-blue-600 hover:bg-blue-500 text-white font-bold text-[10px] transition ml-1"
                          >
                            Audit Entry
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {adjustModal.open && adjustModal.product && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 max-w-md w-full shadow-2xl">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white mb-1">
              Record Stock Movement
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Item: <span className="font-bold text-slate-800 dark:text-slate-200">{adjustModal.product.name}</span>
            </p>

            <form onSubmit={handleAdjustSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                  Movement Reason / Type *
                </label>
                <select
                  value={adjustModal.movementType}
                  onChange={(e) => setAdjustModal({ ...adjustModal, movementType: e.target.value })}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 focus:outline-none"
                >
                  <option value="production_addition">Production Addition (+ Output from assembly)</option>
                  <option value="manual_addition">Manual Addition (+ Factory inbound)</option>
                  <option value="manual_reduction">Manual Reduction (- Wholesale dispatch)</option>
                  <option value="damaged_stock">Damaged Stock (- Scrap)</option>
                  <option value="rejected_stock">Rejected Stock (- QA failure)</option>
                  <option value="returned_stock">Returned Stock (+ RMA restock)</option>
                  <option value="stock_correction">Audit Quantity Correction</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                  Quantity ({adjustModal.product.unit}) *
                </label>
                <input
                  type="number"
                  min="1"
                  required
                  value={adjustModal.quantity}
                  onChange={(e) => setAdjustModal({ ...adjustModal, quantity: Number(e.target.value) })}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 focus:outline-none font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                  Remarks / Batch Details
                </label>
                <input
                  type="text"
                  placeholder="e.g. Invoiced via Dispatch Slip #8812"
                  value={adjustModal.note}
                  onChange={(e) => setAdjustModal({ ...adjustModal, note: e.target.value })}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 focus:outline-none"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setAdjustModal({ open: false, product: null, quantity: 10, movementType: "production_addition", note: "" })}
                  className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition shadow-md"
                >
                  Record & Commit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
