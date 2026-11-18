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
  const [portalInfo, setPortalInfo] = useState<any>(null);

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
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-slate-400">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-xs font-semibold tracking-wider uppercase text-slate-400">Verifying Wholesale Token...</p>
        </div>
      </div>
    );
  }

  if (tokenInvalid) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center shadow-2xl">
          <div className="w-14 h-14 bg-rose-950/80 text-rose-400 border border-rose-800 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <XCircle className="w-8 h-8" />
          </div>
          <h1 className="text-xl font-bold text-white mb-2">Access Revoked or Invalid Link</h1>
          <p className="text-xs text-slate-400 leading-relaxed mb-6">
            This private wholesale catalog link does not exist, has expired, or access has been disabled by Pro Tech Enterprises.
          </p>
          <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-[11px] text-slate-500">
            For assistance, please contact Pro Tech Enterprises via your official sales representative.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Company Header */}
        <div className="text-center mb-8">
          <div className="inline-flex w-12 h-12 rounded-xl bg-blue-600 items-center justify-center text-white mb-3 shadow-xl shadow-blue-500/20">
            <Zap className="w-6 h-6" />
          </div>
          <h1 className="text-xl font-black text-white uppercase tracking-tight">
            PRO TECH <span className="text-blue-500">ENTERPRISES</span>
          </h1>
          <p className="text-xs text-slate-400 font-semibold tracking-wider uppercase mt-1">
            Private B2B Wholesale Product Portal
          </p>
        </div>

        {/* Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-2xl">
          <div className="flex items-center gap-2 mb-6 pb-4 border-b border-slate-800 text-slate-300">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <div>
              <h2 className="text-sm font-bold uppercase tracking-wider text-white">Wholesaler Authentication</h2>
              <p className="text-[11px] text-slate-500">Enter your assigned distributor login credentials</p>
            </div>
          </div>

          {error && (
            <div className="mb-6 p-3.5 rounded-xl bg-rose-950/60 border border-rose-800 text-rose-300 text-xs flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-400" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">
                Assigned Login ID
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                <input
                  type="text"
                  required
                  placeholder="e.g. metro_wholesale"
                  value={loginId}
                  onChange={(e) => setLoginId(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-600 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 font-mono transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-600 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-6 py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm tracking-wide transition flex items-center justify-center gap-2 shadow-lg shadow-blue-900/40 disabled:opacity-50"
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
            <div className="mt-6 pt-4 border-t border-slate-800 text-center">
              <span className="text-[10px] text-slate-400 block mb-1 uppercase font-semibold">Demo Buyer Account:</span>
              <p className="text-xs font-mono text-blue-400 bg-slate-950 p-2 rounded border border-slate-800">
                metro_wholesale / buyer123
              </p>
            </div>
          )}
        </div>

        <p className="text-center text-xs text-slate-500 mt-6">
          Confidential Wholesale Pricing &bull; Pro Tech Enterprises
        </p>
      </div>
    </div>
  );
}
