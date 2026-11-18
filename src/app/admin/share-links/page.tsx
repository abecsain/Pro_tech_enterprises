"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import AdminLayout from "@/components/admin/AdminLayout";
import {
  Share2,
  Plus,
  Copy,
  Check,
  ExternalLink,
  Trash2,
  Power,
  Shield,
  Clock,
  Calendar,
  MessageSquare,
} from "lucide-react";
import { formatDate } from "@/lib/utils";

export default function AdminShareLinksPage() {
  const [links, setLinks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    loadLinks();
  }, []);

  const loadLinks = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/share-links");
      if (res.ok) setLinks(await res.json());
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (link: any) => {
    const newStatus = link.status === "active" ? "disabled" : "active";
    try {
      const res = await fetch("/api/admin/share-links", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ linkId: link.id, status: newStatus }),
      });
      if (res.ok) {
        loadLinks();
      } else {
        alert("Failed to update link status");
      }
    } catch (e) {
      alert("Error");
    }
  };

  const handleDelete = async (linkId: string) => {
    if (!confirm("Are you sure you want to revoke and delete this share link?")) return;
    try {
      const res = await fetch(`/api/admin/share-links?id=${linkId}`, { method: "DELETE" });
      if (res.ok) loadLinks();
      else alert("Failed to delete");
    } catch (e) {
      alert("Error");
    }
  };

  const handleCopyCredentials = (link: any) => {
    const origin = typeof window !== "undefined" ? window.location.origin : "https://protechenterprises.com";
    const catalogUrl = `${origin}/catalog/${link.token}`;

    const textToCopy = `*PRO TECH ENTERPRISES - PRIVATE WHOLESALE PORTAL*
Recipient: ${link.recipient_name || "Valued Distributor"}
Portal Link: ${catalogUrl}

*Access Credentials:*
Login ID: ${link.login_id || "N/A"}
Password: [As configured upon registration]

_Note: This is a confidential B2B access portal for verified distributors only._`;

    navigator.clipboard.writeText(textToCopy);
    setCopiedId(link.id);
    setTimeout(() => setCopiedId(null), 3000);
  };

  return (
    <AdminLayout
      title="Private Buyer Catalog Links"
      subtitle="Generate, Monitor & Revoke Cryptographically Protected Wholesale Portals"
    >
      <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            {links.length} Active Wholesaler Access Portals
          </span>
        </div>

        <Link
          href="/admin/share-links/create"
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-md shadow-blue-900/30 transition"
        >
          <Plus className="w-4 h-4" />
          <span>Generate New Buyer Link</span>
        </Link>
      </div>

      <div className="space-y-4">
        {loading ? (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-12 text-center text-slate-400">
            Loading generated wholesale access links...
          </div>
        ) : links.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-12 text-center">
            <Share2 className="w-12 h-12 text-slate-300 dark:text-slate-700 mx-auto mb-3" />
            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">No Buyer Links Generated Yet</h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto mt-1 mb-4">
              Create an exclusive wholesale link for individual distributors with custom pricing and private credentials.
            </p>
            <Link
              href="/admin/share-links/create"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold"
            >
              <Plus className="w-4 h-4" />
              <span>Generate First Access Link</span>
            </Link>
          </div>
        ) : (
          links.map((link) => {
            const isExpired = link.expires_at && new Date(link.expires_at) < new Date();
            const isActive = link.status === "active" && !isExpired;

            return (
              <div
                key={link.id}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4 transition hover:border-slate-300 dark:hover:border-slate-700"
              >
                {/* Details */}
                <div className="space-y-1.5 max-w-xl">
                  <div className="flex items-center gap-3">
                    <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                      {link.recipient_name || "Distributor"}
                    </h3>
                    {link.company_name && (
                      <span className="text-xs font-medium text-slate-500">({link.company_name})</span>
                    )}

                    <span
                      className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                        isActive
                          ? "bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-800"
                          : "bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 border border-rose-300 dark:border-rose-800"
                      }`}
                    >
                      {isActive ? "Active Portal" : isExpired ? "Expired" : "Disabled"}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
                    <div className="flex items-center gap-1">
                      <span className="font-semibold text-slate-700 dark:text-slate-300">Login ID:</span>
                      <span className="font-mono text-blue-600 dark:text-blue-400 font-bold">{link.login_id}</span>
                    </div>

                    <span>&bull;</span>

                    <div className="flex items-center gap-1">
                      <span className="font-semibold text-slate-700 dark:text-slate-300">Token:</span>
                      <span className="font-mono text-[11px] bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded text-slate-600 dark:text-slate-400">
                        {link.token}
                      </span>
                    </div>

                    <span>&bull;</span>

                    <div className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      <span>Expires: {link.expires_at ? formatDate(link.expires_at) : "No Expiry"}</span>
                    </div>
                  </div>

                  {link.notes && <p className="text-[11px] text-slate-400 italic">{link.notes}</p>}
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-2 self-end md:self-center shrink-0">
                  <button
                    onClick={() => handleCopyCredentials(link)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 hover:bg-slate-100 text-slate-700 dark:text-slate-200 text-xs font-semibold transition"
                    title="Copy Share Link & Credentials"
                  >
                    {copiedId === link.id ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-500" />
                        <span className="text-emerald-600">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5 text-slate-400" />
                        <span>Copy Link + Login</span>
                      </>
                    )}
                  </button>

                  <a
                    href={`/catalog/${link.token}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-600 dark:text-slate-300 transition"
                    title="Test Open Portal"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>

                  <button
                    onClick={() => handleToggleStatus(link)}
                    className={`p-2 rounded-xl transition ${
                      isActive
                        ? "bg-amber-50 dark:bg-amber-950/60 hover:bg-amber-100 text-amber-600 dark:text-amber-400"
                        : "bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-100 text-emerald-600 dark:text-emerald-400"
                    }`}
                    title={isActive ? "Disable Access" : "Enable Access"}
                  >
                    <Power className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => handleDelete(link.id)}
                    className="p-2 rounded-xl bg-rose-50 dark:bg-rose-950/60 hover:bg-rose-100 text-rose-600 dark:text-rose-400 transition"
                    title="Permanently Delete Link"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </AdminLayout>
  );
}
