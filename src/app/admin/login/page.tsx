"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Zap, Lock, Mail, ArrowRight, ShieldCheck, AlertCircle, CheckCircle2 } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("admin@protechenterprises.com");
  const [password, setPassword] = useState("admin123");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/admin/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Login failed");
      }

      router.push("/admin/dashboard");
    } catch (err: any) {
      setError(err.message || "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4 antialiased">
      <div className="w-full max-w-md">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <div className="inline-flex w-14 h-14 rounded-2xl bg-blue-600 items-center justify-center text-white mb-4 shadow-lg shadow-blue-500/20">
            <Zap className="w-8 h-8 fill-white" />
          </div>
          <h1 className="text-2xl font-black text-slate-950 uppercase tracking-tight">
            PRO TECH <span className="text-blue-600">ENTERPRISES</span>
          </h1>
          <p className="text-xs text-slate-500 font-semibold tracking-wider uppercase mt-1">
            Manufacturing & Admin Inventory Portal
          </p>
        </div>

        {/* Card */}
        <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-xl shadow-slate-200/60">
          <div className="flex items-center gap-2.5 mb-6 pb-4 border-b border-slate-100 text-slate-800">
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-950">Administrator Access</h2>
              <p className="text-[11px] text-slate-500">Authorized personnel & factory managers only</p>
            </div>
          </div>

          {error && (
            <div className="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-500" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5 uppercase tracking-wider">
                Admin Work Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@protechenterprises.com"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:border-blue-600 focus:bg-white focus:ring-1 focus:ring-blue-600 transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5 uppercase tracking-wider">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:border-blue-600 focus:bg-white focus:ring-1 focus:ring-blue-600 transition"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-6 py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm tracking-wide transition flex items-center justify-center gap-2 shadow-md shadow-blue-600/20 disabled:opacity-50"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  <span>Authenticate & Enter</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Quick Credential Helper for Reviewers */}
          <div className="mt-8 pt-6 border-t border-slate-100">
            <p className="text-[11px] font-bold uppercase text-slate-400 tracking-wider mb-2">
              Default Factory Accounts:
            </p>
            <div className="space-y-2 text-xs text-slate-600 bg-slate-50 p-3.5 rounded-xl border border-slate-200">
              <div
                className="flex justify-between items-center cursor-pointer hover:text-blue-600 transition"
                onClick={() => {
                  setEmail("admin@protechenterprises.com");
                  setPassword("admin123");
                }}
              >
                <span className="font-semibold">Super Admin:</span>
                <span className="font-mono text-blue-700 font-bold">admin@protechenterprises.com / admin123</span>
              </div>
              <div
                className="flex justify-between items-center cursor-pointer hover:text-indigo-600 transition"
                onClick={() => {
                  setEmail("manager@protechenterprises.com");
                  setPassword("manager123");
                }}
              >
                <span className="font-semibold">Manager:</span>
                <span className="font-mono text-indigo-700 font-bold">manager@protechenterprises.com / manager123</span>
              </div>
            </div>
          </div>
        </div>

        <p className="text-center text-xs text-slate-400 mt-6 font-medium">
          PRO TECH ENTERPRISES &bull; Operational Security Standard &bull; ISO 9001:2015
        </p>
      </div>
    </div>
  );
}
