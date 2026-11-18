"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import AdminLayout from "@/components/admin/AdminLayout";
import {
  Package,
  Plus,
  Search,
  Filter,
  Download,
  Edit,
  Trash2,
  Archive,
  RefreshCw,
  AlertTriangle,
  Boxes,
  ChevronRight,
  TrendingUp,
  CheckCircle,
} from "lucide-react";
import { exportToCSV, exportToExcel } from "@/lib/export";
import { formatCurrency } from "@/lib/utils";

export default function AdminProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [stockFilter, setStockFilter] = useState("all");
  const [adjustModal, setAdjustModal] = useState<{ open: boolean; product: any | null; quantity: number; note: string; type: string }>({
    open: false,
    product: null,
    quantity: 1,
    note: "",
    type: "manual_addition",
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [prodRes, catRes] = await Promise.all([
        fetch("/api/admin/products?archived=true"),
        fetch("/api/admin/categories"),
      ]);
      if (prodRes.ok) setProducts(await prodRes.json());
      if (catRes.ok) setCategories(await catRes.json());
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleQuickAdjust = async (product: any, delta: number) => {
    try {
      const res = await fetch("/api/admin/inventory/adjust", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: product.id,
          quantityChange: delta,
          movementType: delta > 0 ? "manual_addition" : "manual_reduction",
          note: `Quick ${delta > 0 ? "+" : ""}${delta} adjustment from product directory`,
        }),
      });
      if (res.ok) {
        loadData();
      } else {
        const err = await res.json();
        alert(err.error || "Adjustment failed");
      }
    } catch (e) {
      alert("Network error");
    }
  };

  const submitAdjustModal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!adjustModal.product) return;
    const qty = adjustModal.type.includes("reduction") || adjustModal.type === "damaged_stock" || adjustModal.type === "rejected_stock"
      ? -Math.abs(adjustModal.quantity)
      : Math.abs(adjustModal.quantity);

    try {
      const res = await fetch("/api/admin/inventory/adjust", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: adjustModal.product.id,
          quantityChange: qty,
          movementType: adjustModal.type,
          note: adjustModal.note || "Production or dispatch adjustment",
        }),
      });
      if (res.ok) {
        setAdjustModal({ open: false, product: null, quantity: 1, note: "", type: "manual_addition" });
        loadData();
      } else {
        const err = await res.json();
        alert(err.error || "Adjustment failed");
      }
    } catch (e) {
      alert("Error processing adjustment");
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete or archive product: "${name}"?`)) return;
    try {
      const res = await fetch(`/api/admin/products/${id}`, { method: "DELETE" });
      if (res.ok) {
        loadData();
      } else {
        const err = await res.json();
        alert(err.error || "Failed to delete");
      }
    } catch (e) {
      alert("Error");
    }
  };

  const handleExportCSV = () => {
    const headers = ["Product Name", "SKU", "Category", "Current Stock", "Min Threshold", "Unit", "Selling Price (INR)", "Internal Cost (INR)", "Status"];
    const rows = filteredProducts.map((p) => [
      p.name,
      p.sku,
      p.category?.name || "General",
      p.current_stock ?? 0,
      p.min_stock_threshold,
      p.unit,
      p.default_selling_price,
      p.internal_cost ?? 0,
      p.status,
    ]);
    exportToCSV(`ProTech_Products_${new Date().toISOString().split("T")[0]}`, headers, rows);
  };

  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.sku.toLowerCase().includes(search.toLowerCase());
    const matchesCat = categoryFilter === "all" || p.category_id === categoryFilter;
    const stock = p.current_stock ?? 0;
    let matchesStock = true;
    if (stockFilter === "low") matchesStock = stock > 0 && stock <= p.min_stock_threshold;
    else if (stockFilter === "out") matchesStock = stock <= 0;
    else if (stockFilter === "active") matchesStock = p.status === "active" && !p.is_archived;
    else if (stockFilter === "archived") matchesStock = p.is_archived;

    return matchesSearch && matchesCat && matchesStock;
  });

  return (
    <AdminLayout title="Product & Inventory Directory" subtitle="Electronics Catalog, Specifications & Stock Controls">
      {/* Top Header & Action Controls */}
      <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
          {/* Search Bar */}
          <div className="relative flex-1 sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Search by product name or SKU..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          {/* Category Filter */}
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

          {/* Stock Filter */}
          <select
            value={stockFilter}
            onChange={(e) => setStockFilter(e.target.value)}
            className="text-xs px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 focus:outline-none"
          >
            <option value="all">All Stock Status</option>
            <option value="active">Active Products</option>
            <option value="low">Low Stock Alerts</option>
            <option value="out">Out of Stock</option>
            <option value="archived">Archived</option>
          </select>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <button
            onClick={handleExportCSV}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-slate-50 text-slate-700 dark:text-slate-300 text-xs font-semibold shadow-sm transition"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>

          <Link
            href="/admin/products/add"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-md shadow-blue-900/30 transition"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Product</span>
          </Link>
        </div>
      </div>

      {/* Products Table Card */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-950 text-slate-500 font-semibold uppercase tracking-wider border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="py-3.5 px-4">Product Details</th>
                <th className="py-3.5 px-4">Category</th>
                <th className="py-3.5 px-4">Selling Price (₹)</th>
                <th className="py-3.5 px-4">Internal Cost</th>
                <th className="py-3.5 px-4">Current Stock</th>
                <th className="py-3.5 px-4">Quick Adjust</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    <div className="flex flex-col items-center gap-2">
                      <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                      <span>Loading products directory...</span>
                    </div>
                  </td>
                </tr>
              ) : filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    No products match the filter criteria.
                  </td>
                </tr>
              ) : (
                filteredProducts.map((p) => {
                  const stock = p.current_stock ?? 0;
                  const isLow = stock > 0 && stock <= p.min_stock_threshold;
                  const isOut = stock <= 0;

                  return (
                    <tr
                      key={p.id}
                      className={`hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition ${
                        p.is_archived ? "opacity-60 bg-slate-50 dark:bg-slate-950" : ""
                      }`}
                    >
                      {/* Product Details with Image */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={p.image_url || "https://images.unsplash.com/photo-1550524514-9b60459521ef?w=100&auto=format&fit=crop&q=60"}
                            alt={p.name}
                            className="w-10 h-10 rounded-lg object-cover bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-800 shrink-0"
                          />
                          <div className="max-w-[220px]">
                            <p className="font-bold text-slate-900 dark:text-white truncate">{p.name}</p>
                            <div className="flex items-center gap-2 text-[10px] text-slate-400 font-mono mt-0.5">
                              <span>SKU: {p.sku}</span>
                              <span>&bull;</span>
                              <span>Unit: {p.unit}</span>
                            </div>
                            {p.variants && p.variants.length > 0 && (
                              <span className="inline-block mt-1 text-[9px] font-bold px-1.5 py-0.2 rounded bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400">
                                {p.variants.length} Variants
                              </span>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="py-3 px-4 whitespace-nowrap text-slate-600 dark:text-slate-400">
                        {p.category?.name || "General"}
                        {p.subcategory && <span className="block text-[10px] text-slate-400">{p.subcategory}</span>}
                      </td>

                      {/* Default Selling Price */}
                      <td className="py-3 px-4 whitespace-nowrap font-bold text-slate-900 dark:text-white">
                        ₹{p.default_selling_price.toLocaleString("en-IN")}
                        <span className="text-[10px] font-normal text-slate-400 block">MOQ: {p.moq || 1}</span>
                      </td>

                      {/* Internal Production Cost */}
                      <td className="py-3 px-4 whitespace-nowrap text-slate-500 font-medium">
                        ₹{(p.internal_cost || 0).toLocaleString("en-IN")}
                        {p.default_selling_price > (p.internal_cost || 0) && (
                          <span className="text-[10px] text-emerald-600 block">
                            Margin: +{Math.round(((p.default_selling_price - (p.internal_cost || 0)) / (p.internal_cost || 1)) * 100)}%
                          </span>
                        )}
                      </td>

                      {/* Stock Badge */}
                      <td className="py-3 px-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <span
                            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${
                              isOut
                                ? "bg-rose-100 dark:bg-rose-950/80 text-rose-700 dark:text-rose-400 border border-rose-300 dark:border-rose-800"
                                : isLow
                                ? "bg-amber-100 dark:bg-amber-950/80 text-amber-700 dark:text-amber-400 border border-amber-300 dark:border-amber-800"
                                : "bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-800"
                            }`}
                          >
                            {isOut ? (
                              <span>0 Units (Out of Stock)</span>
                            ) : (
                              <span>{stock.toLocaleString("en-IN")} Units</span>
                            )}
                          </span>
                        </div>
                        <span className="text-[10px] text-slate-400 block mt-0.5">Alert at &le; {p.min_stock_threshold}</span>
                      </td>

                      {/* Inline Fast + / - Quick Stock Adjustments */}
                      <td className="py-3 px-4 whitespace-nowrap">
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => handleQuickAdjust(p, -1)}
                            disabled={stock <= 0}
                            title="Decrease Stock by 1"
                            className="w-7 h-7 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-rose-100 dark:hover:bg-rose-950 text-slate-700 dark:text-slate-300 hover:text-rose-600 font-bold flex items-center justify-center transition disabled:opacity-30"
                          >
                            -1
                          </button>
                          <button
                            onClick={() => handleQuickAdjust(p, 1)}
                            title="Increase Stock by 1"
                            className="w-7 h-7 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-emerald-100 dark:hover:bg-emerald-950 text-slate-700 dark:text-slate-300 hover:text-emerald-600 font-bold flex items-center justify-center transition"
                          >
                            +1
                          </button>
                          <button
                            onClick={() =>
                              setAdjustModal({
                                open: true,
                                product: p,
                                quantity: 10,
                                note: "",
                                type: "production_addition",
                              })
                            }
                            title="Custom Stock Movement"
                            className="px-2 py-1 rounded-lg bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 text-[10px] font-bold hover:bg-blue-100 transition"
                          >
                            Bulk &plusmn;
                          </button>
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-4 whitespace-nowrap text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            href={`/admin/products/${p.id}`}
                            className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-600 dark:text-slate-300 transition"
                            title="Edit Product"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </Link>
                          <button
                            onClick={() => handleDelete(p.id, p.name)}
                            className="p-1.5 rounded-lg bg-rose-50 dark:bg-rose-950/60 hover:bg-rose-100 text-rose-600 dark:text-rose-400 transition"
                            title="Archive / Delete Product"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
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

      {/* Custom Stock Adjustment Modal */}
      {adjustModal.open && adjustModal.product && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 max-w-md w-full shadow-2xl">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white mb-1">
              Stock Adjustment Entry
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Recording verified movement for <span className="font-bold text-slate-800 dark:text-slate-200">{adjustModal.product.name}</span>
            </p>

            <form onSubmit={submitAdjustModal} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                  Movement Classification
                </label>
                <select
                  value={adjustModal.type}
                  onChange={(e) => setAdjustModal({ ...adjustModal, type: e.target.value })}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 focus:outline-none"
                >
                  <option value="production_addition">Production Addition (+ Assembled output)</option>
                  <option value="manual_addition">Manual Addition (+ Factory receipt)</option>
                  <option value="manual_reduction">Manual Reduction (- Dispatch / Wholesale)</option>
                  <option value="damaged_stock">Damaged / Defective (- Scrap)</option>
                  <option value="rejected_stock">Rejected Stock (- QA failure)</option>
                  <option value="returned_stock">Returned Stock (+ RMA restock)</option>
                  <option value="stock_correction">Stock Audit Correction</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                  Quantity ({adjustModal.product.unit})
                </label>
                <input
                  type="number"
                  min="1"
                  required
                  value={adjustModal.quantity}
                  onChange={(e) => setAdjustModal({ ...adjustModal, quantity: Number(e.target.value) })}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                  Remarks / Order Note
                </label>
                <input
                  type="text"
                  placeholder="e.g. Batch #2026-X or Wholesale Dispatch #PO-991"
                  value={adjustModal.note}
                  onChange={(e) => setAdjustModal({ ...adjustModal, note: e.target.value })}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 focus:outline-none"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setAdjustModal({ open: false, product: null, quantity: 1, note: "", type: "manual_addition" })}
                  className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition shadow-md"
                >
                  Commit Adjustment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
