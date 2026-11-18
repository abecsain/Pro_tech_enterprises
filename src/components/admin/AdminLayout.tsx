"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  Layers,
  Boxes,
  History,
  Share2,
  Users,
  MessageSquare,
  FileBarChart2,
  Activity,
  Settings,
  LogOut,
  Menu,
  X,
  Zap,
  ChevronRight,
  Shield,
  Bell,
} from "lucide-react";

interface AdminLayoutProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
}

export default function AdminLayout({ children, title, subtitle }: AdminLayoutProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<{ fullName: string; role: string; email: string } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/auth/me")
      .then((res) => {
        if (!res.ok) {
          router.push("/admin/login");
          return null;
        }
        return res.json();
      })
      .then((data) => {
        if (data && data.authenticated) {
          setUser(data.user);
        } else {
          router.push("/admin/login");
        }
      })
      .catch(() => router.push("/admin/login"))
      .finally(() => setLoading(false));
  }, [router]);

  const handleLogout = async () => {
    await fetch("/api/admin/auth/logout", { method: "POST" });
    router.push("/admin/login");
  };

  const navItems = [
    { name: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
    { name: "Products", href: "/admin/products", icon: Package },
    { name: "Categories", href: "/admin/categories", icon: Layers },
    { name: "Inventory Balances", href: "/admin/inventory", icon: Boxes },
    { name: "Stock History", href: "/admin/stock-history", icon: History },
    { name: "Private Share Links", href: "/admin/share-links", icon: Share2 },
    { name: "Buyer Accounts", href: "/admin/recipients", icon: Users },
    { name: "WhatsApp Bookings", href: "/admin/bookings", icon: MessageSquare },
    { name: "Reports & Exports", href: "/admin/reports", icon: FileBarChart2 },
    { name: "Activity Logs", href: "/admin/activity", icon: Activity },
    { name: "Settings", href: "/admin/settings", icon: Settings },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center text-slate-500">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-sm font-semibold tracking-wide text-slate-600">Loading Pro Tech Portal...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row text-slate-800 antialiased">
      {/* Mobile Top Navigation Bar */}
      <div className="md:hidden flex items-center justify-between px-4 py-3 bg-white border-b border-slate-200 text-slate-900 sticky top-0 z-40">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded bg-blue-600 flex items-center justify-center text-white font-bold">
            <Zap className="w-4 h-4 fill-white" />
          </div>
          <div>
            <span className="font-extrabold text-sm uppercase tracking-wide">PRO TECH ADMIN</span>
          </div>
        </div>
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 rounded-lg bg-slate-100 text-slate-600 hover:text-slate-900"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Sidebar for Desktop & Mobile Overlay */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-slate-200 flex flex-col transition-transform duration-200 ease-in-out md:static md:translate-x-0 ${
          mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Brand Header */}
        <div className="h-16 flex items-center px-6 border-b border-slate-200 gap-3 bg-slate-50/70">
          <div className="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center text-white font-black shadow-md shadow-blue-500/20">
            <Zap className="w-5 h-5 fill-white" />
          </div>
          <div className="overflow-hidden">
            <span className="font-black text-sm tracking-tight text-slate-950 uppercase block leading-tight">
              PRO TECH <span className="text-blue-600">ENTERPRISES</span>
            </span>
            <span className="text-[10px] text-slate-500 font-semibold tracking-wider uppercase block">
              Admin Inventory OS
            </span>
          </div>
        </div>

        {/* Current User Badge */}
        {user && (
          <div className="px-4 py-3 border-b border-slate-100 bg-slate-50/50">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-blue-100 border border-blue-200 flex items-center justify-center text-blue-700 text-xs font-bold uppercase">
                {user.fullName.substring(0, 2)}
              </div>
              <div className="overflow-hidden">
                <p className="text-xs font-bold text-slate-900 truncate">{user.fullName}</p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <Shield className="w-3 h-3 text-emerald-600" />
                  <span className="text-[10px] font-semibold text-emerald-700 uppercase tracking-wider">
                    {user.role === "super_admin" ? "Super Admin" : "Manager"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Nav Links */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? "bg-blue-600 text-white shadow-sm shadow-blue-600/30 font-bold"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-950"
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? "text-white" : "text-slate-400"}`} />
                <span className="flex-1">{item.name}</span>
                {isActive && <ChevronRight className="w-3.5 h-3.5 text-blue-100" />}
              </Link>
            );
          })}
        </nav>

        {/* Footer Logout */}
        <div className="p-3 border-t border-slate-200">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-semibold text-rose-600 hover:bg-rose-50 transition"
          >
            <LogOut className="w-4 h-4 text-rose-500" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Top Desktop Bar */}
        <header className="h-16 px-6 bg-white border-b border-slate-200 flex items-center justify-between shrink-0 shadow-xs">
          <div>
            <h1 className="text-base font-bold text-slate-950 tracking-tight">
              {title || "Overview"}
            </h1>
            {subtitle && <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>}
          </div>

          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              Live Sync Active
            </span>
          </div>
        </header>

        {/* Main View Area */}
        <main className="p-4 sm:p-6 lg:p-8 flex-1 bg-slate-50/60">{children}</main>
      </div>

      {/* Backdrop for Mobile */}
      {mobileMenuOpen && (
        <div
          onClick={() => setMobileMenuOpen(false)}
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-40 md:hidden"
        />
      )}
    </div>
  );
}
