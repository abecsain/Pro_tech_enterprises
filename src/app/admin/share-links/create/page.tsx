"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import AdminLayout from "@/components/admin/AdminLayout";
import {
  ArrowLeft,
  Share2,
  Copy,
  Check,
  Shield,
  Sparkles,
  Lock,
  User,
  Building,
  Phone,
  Mail,
  Calendar,
  Layers,
  Tag,
} from "lucide-react";

export default function CreateShareLinkPage() {
  const router = useRouter();
  const [categories, setCategories] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [createdResult, setCreatedResult] = useState<any | null>(null);
  const [copied, setCopied] = useState(false);

  const [formData, setFormData] = useState({
    recipientName: "",
    companyName: "",
    loginId: "",
    password: "",
    whatsappNumber: "",
    email: "",
    phone: "",
    portalDisplayName: "",
    expiresInDays: 30,
    notes: "",
    categoryIds: [] as string[],
    customPrices: {} as Record<string, number>,
  });

  useEffect(() => {
    Promise.all([
      fetch("/api/admin/categories").then((r) => r.json()),
      fetch("/api/admin/products").then((r) => r.json()),
    ]).then(([cats, prods]) => {
      setCategories(cats);
      setProducts(prods);
      setFormData((prev) => ({
        ...prev,
        categoryIds: cats.map((c: any) => c.id), // default: all permitted
      }));
    });
  }, []);

  const handleCategoryToggle = (catId: string) => {
    setFormData((prev) => {
      const exists = prev.categoryIds.includes(catId);
      return {
        ...prev,
        categoryIds: exists
          ? prev.categoryIds.filter((id) => id !== catId)
          : [...prev.categoryIds, catId],
      };
    });
  };

  const handleCustomPriceChange = (productId: string, val: string) => {
    const num = parseFloat(val);
    setFormData((prev) => ({
      ...prev,
      customPrices: {
        ...prev.customPrices,
        [productId]: isNaN(num) ? 0 : num,
      },
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const customPricesArray = Object.entries(formData.customPrices)
        .filter(([_, price]) => price > 0)
        .map(([productId, customPrice]) => ({
          productId,
          customPrice,
        }));

      const payload = {
        recipientName: formData.recipientName,
        companyName: formData.companyName,
        loginId: formData.loginId,
        password: formData.password || undefined,
        whatsappNumber: formData.whatsappNumber,
        email: formData.email,
        phone: formData.phone,
        portalDisplayName: formData.portalDisplayName || undefined,
        expiresInDays: Number(formData.expiresInDays),
        categoryIds: formData.categoryIds,
        customPrices: customPricesArray,
        notes: formData.notes,
      };

      const res = await fetch("/api/admin/share-links", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to generate link");
      }

      const result = await res.json();
      setCreatedResult(result);
    } catch (err: any) {
      alert(err.message || "Error generating link");
    } finally {
      setLoading(false);
    }
  };

  const handleCopyCredentials = () => {
    if (!createdResult) return;
    const origin = typeof window !== "undefined" ? window.location.origin : "https://protechenterprises.com";
    const catalogUrl = `${origin}/catalog/${createdResult.shareLink.token}`;

    const textToCopy = `*PRO TECH ENTERPRISES - PRIVATE WHOLESALE PRODUCT CATALOG*
Recipient: ${createdResult.recipient.name}
${createdResult.recipient.company_name ? `Company: ${createdResult.recipient.company_name}\n` : ""}
Direct Access Link:
${catalogUrl}

*Authorized Login Credentials:*
Login ID: ${createdResult.credentials.loginId}
Password: ${createdResult.credentials.plainPassword}

_Please keep your login credentials confidential._`;

    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  if (createdResult) {
    const origin = typeof window !== "undefined" ? window.location.origin : "";
    const catalogUrl = `${origin}/catalog/${createdResult.shareLink.token}`;

    return (
      <AdminLayout title="Buyer Access Link Generated!" subtitle="Credentials and Access Portal Ready for Dispatch">
        <div className="max-w-2xl mx-auto bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-8 shadow-xl text-center">
          <div className="w-14 h-14 bg-emerald-50 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-emerald-200 dark:border-emerald-800">
            <Check className="w-8 h-8" />
          </div>

          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Wholesale Portal Successfully Activated</h2>
          <p className="text-xs text-slate-500 mt-1 mb-6">
            Share this link and credentials with <span className="font-bold text-slate-800 dark:text-slate-200">{createdResult.recipient.name}</span>.
          </p>

          <div className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-5 text-left space-y-3 mb-6">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-0.5">
                Shareable Catalog Link:
              </span>
              <p className="text-xs font-mono text-blue-600 dark:text-blue-400 break-all select-all font-semibold">
                {catalogUrl}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-2 border-t border-slate-200 dark:border-slate-800">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-0.5">
                  Assigned Login ID:
                </span>
                <p className="text-xs font-mono font-bold text-slate-900 dark:text-white">
                  {createdResult.credentials.loginId}
                </p>
              </div>

              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-0.5">
                  Password:
                </span>
                <p className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400">
                  {createdResult.credentials.plainPassword}
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={handleCopyCredentials}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition shadow-md shadow-blue-900/30"
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? "Copied Credentials!" : "Copy Link + Credentials"}</span>
            </button>

            <a
              href={catalogUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs font-semibold hover:bg-slate-50 transition"
            >
              <span>Test Open Portal &rarr;</span>
            </a>

            <Link
              href="/admin/share-links"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-transparent text-slate-600 dark:text-slate-400 text-xs font-semibold hover:underline"
            >
              <span>Done / View All Links</span>
            </Link>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout
      title="Generate Private Buyer Link"
      subtitle="Provision Wholesaler Access with Assigned Pricing & Cryptographic Credentials"
    >
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <Link
            href="/admin/share-links"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Share Links</span>
          </Link>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Recipient Profile Card */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white mb-4 pb-3 border-b border-slate-100 dark:border-slate-800 flex items-center gap-2">
              <User className="w-4 h-4 text-blue-500" />
              <span>Recipient Profile & Contact Details</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                  Recipient / Contact Person Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ramesh Kumar"
                  value={formData.recipientName}
                  onChange={(e) => setFormData({ ...formData, recipientName: e.target.value })}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                  Company / Firm Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Metro Electrical Wholesale Corp"
                  value={formData.companyName}
                  onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                  WhatsApp Contact Number
                </label>
                <input
                  type="text"
                  placeholder="e.g. 919811099881"
                  value={formData.whatsappNumber}
                  onChange={(e) => setFormData({ ...formData, whatsappNumber: e.target.value })}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  placeholder="orders@metrodist.in"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Access Credentials & Validity Card */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white mb-4 pb-3 border-b border-slate-100 dark:border-slate-800 flex items-center gap-2">
              <Lock className="w-4 h-4 text-emerald-500" />
              <span>Portal Access Credentials & Expiration</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                  Custom Login ID *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. metro_dist"
                  value={formData.loginId}
                  onChange={(e) => setFormData({ ...formData, loginId: e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, "") })}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 font-mono font-bold text-blue-600 focus:outline-none"
                />
                <span className="text-[10px] text-slate-400 block mt-1">Unique identifier for this buyer</span>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                  Password (Leave blank to auto-generate)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Pass@123"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 focus:outline-none font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                  Link Expiry (Days)
                </label>
                <input
                  type="number"
                  min="0"
                  value={formData.expiresInDays}
                  onChange={(e) => setFormData({ ...formData, expiresInDays: Number(e.target.value) })}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 focus:outline-none"
                />
                <span className="text-[10px] text-slate-400 block mt-1">0 for unlimited validity</span>
              </div>
            </div>
          </div>

          {/* Permitted Categories Card */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white mb-2 flex items-center gap-2">
              <Layers className="w-4 h-4 text-indigo-500" />
              <span>Visible Product Categories</span>
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Select which product categories this distributor is authorized to see and order.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {categories.map((cat) => {
                const checked = formData.categoryIds.includes(cat.id);
                return (
                  <label
                    key={cat.id}
                    onClick={() => handleCategoryToggle(cat.id)}
                    className={`p-3 rounded-xl border cursor-pointer flex items-center gap-3 transition ${
                      checked
                        ? "border-blue-500 bg-blue-50/40 dark:bg-blue-950/40 text-blue-900 dark:text-blue-100"
                        : "border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-600 dark:text-slate-400 opacity-60"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => {}}
                      className="w-4 h-4 text-blue-600 rounded"
                    />
                    <span className="text-xs font-bold">{cat.name}</span>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Custom Selling Price Overrides (Part 9) */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white mb-1 flex items-center gap-2">
              <Tag className="w-4 h-4 text-amber-500" />
              <span>Custom Wholesale Selling Price Overrides (Optional)</span>
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Set customized wholesale prices for this specific distributor. If left blank, default selling prices apply.
            </p>

            <div className="max-h-72 overflow-y-auto space-y-2 pr-1">
              {products.map((p) => (
                <div
                  key={p.id}
                  className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-4"
                >
                  <div className="max-w-[240px]">
                    <p className="text-xs font-bold text-slate-900 dark:text-white truncate">{p.name}</p>
                    <p className="text-[10px] text-slate-400 font-mono">
                      Standard: ₹{p.default_selling_price.toLocaleString("en-IN")} / {p.unit}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-slate-500">Custom Price (₹):</span>
                    <input
                      type="number"
                      step="0.01"
                      placeholder={`₹${p.default_selling_price}`}
                      value={formData.customPrices[p.id] || ""}
                      onChange={(e) => handleCustomPriceChange(p.id, e.target.value)}
                      className="w-28 text-xs p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 font-bold focus:outline-none"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Submit */}
          <div className="flex items-center justify-end gap-3 pt-4">
            <Link
              href="/admin/share-links"
              className="px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-md shadow-blue-900/30 transition disabled:opacity-50"
            >
              <Share2 className="w-4 h-4" />
              <span>{loading ? "Generating Link..." : "Generate Buyer Portal Link"}</span>
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}
