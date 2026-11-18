"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Zap, Lock, User, ArrowRight, ShieldCheck, AlertCircle, XCircle } from "lucide-react";

export default function BuyerLoginPage({ params }: { params: { token: string } }) {
  const router = useRouter();
  const [loginId, setLoginId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [checkingToken, setCheckingToken] = useState(true);
  const [tokenInvalid, setTokenInvalid] = useState(false);

  useEffect(() => {
    // Check if token is valid and active
    fetch(`/api/buyer/catalog?token=${params.token}`)
      .then((res) => {
        if (res.status === 403 || res.status === 404) {
          setTokenInvalid(true);
        } else if (res.ok) {
          // Already logged in!
          router.push(`/catalogue/${params.token}/products`);
        }
      })
      .catch(() => setTokenInvalid(true))
      .finally(() => setCheckingToken(false));
  }, [params.token, router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/buyer/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token: params.token,
          loginId,
          password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Authentication failed");
      }

      router.push(`/catalogue/${params.token}/products`);
    } catch (err: any) {
      setError(err.message || "Invalid Login ID or Password");
    } finally {
      setLoading(false);
    }
  };

  if (checkingToken) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center text-slate-500">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-xs font-semibold tracking-wider uppercase text-slate-500">Verifying Partner Access Token...</p>
        </div>
      </div>
    );
  }

  if (tokenInvalid) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white border border-slate-200 rounded-3xl p-8 text-center shadow-xl shadow-slate-200/60">
          <div className="w-14 h-14 bg-rose-50 text-rose-600 border border-rose-200 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <XCircle className="w-8 h-8" />
          </div>
          <h1 className="text-xl font-bold text-slate-900 mb-2">Access Revoked or Invalid Link</h1>
          <p className="text-xs text-slate-600 leading-relaxed mb-6">
            This private wholesale catalog link does not exist, has expired, or distributor access has been deactivated by Pro Tech Enterprises.
          </p>
          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-500">
            For assistance, please contact your official Pro Tech Enterprises sales representative.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4 antialiased">
      <div className="w-full max-w-md">
        {/* Company Header */}
        <div className="text-center mb-8">
          <div className="inline-flex w-12 h-12 rounded-2xl bg-blue-600 items-center justify-center text-white mb-3 shadow-lg shadow-blue-500/20">
            <Zap className="w-6 h-6 fill-white" />
          </div>
          <h1 className="text-xl font-black text-slate-950 uppercase tracking-tight">
            PRO TECH <span className="text-blue-600">ENTERPRISES</span>
          </h1>
          <p className="text-xs text-slate-500 font-semibold tracking-wider uppercase mt-1">
            Private B2B Wholesale Product Portal
          </p>
        </div>

        {/* Card */}
        <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-xl shadow-slate-200/60">
          <div className="flex items-center gap-2.5 mb-6 pb-4 border-b border-slate-100 text-slate-800">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-950">Wholesaler Authentication</h2>
              <p className="text-[11px] text-slate-500">Enter your assigned distributor login credentials</p>
            </div>
          </div>

          {error && (
            <div className="mb-6 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-500" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5 uppercase tracking-wider">
                Assigned Login ID
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type="text"
                  required
                  placeholder="e.g. metro_wholesale"
                  value={loginId}
                  onChange={(e) => setLoginId(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:border-blue-600 focus:bg-white focus:ring-1 focus:ring-blue-600 font-mono transition"
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
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
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
                  <span>Unlock Wholesale Catalog</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Helper hint for default sample token */}
          {params.token === "pte-metro-auth-8f2c9" && (
            <div className="mt-6 pt-4 border-t border-slate-100 text-center">
              <span className="text-[10px] text-slate-400 block mb-1 uppercase font-semibold">Demo Buyer Account:</span>
              <p className="text-xs font-mono text-blue-700 font-bold bg-blue-50 p-2 rounded-lg border border-blue-200">
                metro_wholesale / buyer123
              </p>
            </div>
          )}
        </div>

        <p className="text-center text-xs text-slate-400 mt-6 font-medium">
          Confidential Wholesale Pricing &bull; Pro Tech Enterprises
        </p>
      </div>
    </div>
  );
}
