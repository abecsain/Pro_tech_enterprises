"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import AdminLayout from "@/components/admin/AdminLayout";
import { Users, Plus, Phone, Mail, MessageSquare, ExternalLink, ShieldCheck, Tag } from "lucide-react";
import { formatDate } from "@/lib/utils";

export default function AdminRecipientsPage() {
  const [recipients, setRecipients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/recipients")
      .then((res) => res.json())
      .then((data) => setRecipients(data))
      .catch((e) => console.error(e))
      .finally(() => setLoading(false));
  }, []);

  return (
    <AdminLayout title="Buyer & Distributor Accounts" subtitle="Wholesalers, Dealers & Private Recipient Directory">
      <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            {recipients.length} Registered B2B Wholesalers
          </span>
        </div>

        <Link
          href="/admin/share-links/create"
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-md shadow-blue-900/30 transition"
        >
          <Plus className="w-4 h-4" />
          <span>Register New Buyer Account</span>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {loading ? (
          <div className="col-span-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-12 text-center text-slate-400">
            Loading buyer directory...
          </div>
        ) : recipients.length === 0 ? (
          <div className="col-span-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-12 text-center text-slate-400">
            No recipients registered yet.
          </div>
        ) : (
          recipients.map((r) => (
            <div
              key={r.id}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div>
                    <h3 className="font-bold text-base text-slate-900 dark:text-white">{r.name}</h3>
                    {r.company_name && (
                      <p className="text-xs font-semibold text-slate-500">{r.company_name}</p>
                    )}
                  </div>

                  <span
                    className={`inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase ${
                      r.status === "active"
                        ? "bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-800"
                        : "bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 border border-rose-300 dark:border-rose-800"
                    }`}
                  >
                    {r.status}
                  </span>
                </div>

                <div className="space-y-1.5 text-xs text-slate-500 mb-4 bg-slate-50 dark:bg-slate-950 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Assigned Login ID:</span>
                    <span className="font-mono font-bold text-blue-600 dark:text-blue-400">
                      {r.credentials?.login_id || "N/A"}
                    </span>
                  </div>

                  {r.credentials?.plain_preview && (
                    <div className="flex items-center justify-between">
                      <span className="font-medium">Password:</span>
                      <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">
                        {r.credentials.plain_preview}
                      </span>
                    </div>
                  )}

                  {r.whatsapp_number && (
                    <div className="flex items-center justify-between">
                      <span className="font-medium">WhatsApp:</span>
                      <span className="font-mono">{r.whatsapp_number}</span>
                    </div>
                  )}

                  {r.email && (
                    <div className="flex items-center justify-between">
                      <span className="font-medium">Email:</span>
                      <span>{r.email}</span>
                    </div>
                  )}
                </div>

                {r.notes && <p className="text-xs text-slate-400 italic mb-4">{r.notes}</p>}
              </div>

              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <span className="text-[11px] text-slate-400">Registered: {formatDate(r.created_at)}</span>

                {r.share_link && (
                  <Link
                    href={`/catalog/${r.share_link.token}`}
                    target="_blank"
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    <span>Open Portal</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </Link>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </AdminLayout>
  );
}
