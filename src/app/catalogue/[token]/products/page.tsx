"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Zap,
  Search,
  ShoppingCart,
  MessageSquare,
  CheckCircle,
  XCircle,
  Plus,
  Minus,
  Trash2,
  LogOut,
  X,
  ArrowRight,
  ShieldCheck,
  Send,
  SlidersHorizontal,
} from "lucide-react";
import { CartItem, BuyerProduct } from "@/types";

export default function BuyerProductsCatalogPage({ params }: { params: { token: string } }) {
  const router = useRouter();
  const [catalog, setCatalog] = useState<{
    portalName: string;
    recipientName: string;
    companyName?: string;
    whatsappNumber: string;
    categories: { id: string; name: string }[];
    products: BuyerProduct[];
  } | null>(null);

  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [submittingBooking, setSubmittingBooking] = useState(false);

  useEffect(() => {
    fetch(`/api/buyer/catalog?token=${params.token}`)
      .then((res) => {
        if (res.status === 401 || res.status === 403) {
          router.push(`/catalogue/${params.token}/login`);
          return null;
        }
        return res.json();
      })
      .then((data) => {
        if (data && !data.error) {
          setCatalog(data);
        }
      })
      .catch((e) => console.error(e))
      .finally(() => setLoading(false));
  }, [params.token, router]);

  const handleLogout = async () => {
    await fetch("/api/buyer/auth/logout", { method: "POST" });
    router.push(`/catalogue/${params.token}/login`);
  };

  const addToCart = (product: BuyerProduct, variantId?: string, qty?: number) => {
    let variantName: string | undefined;
    let price = product.selling_price;
    let moq = product.moq || 1;
    let sku = product.sku;

    if (variantId && product.variants) {
      const v = product.variants.find((vr) => vr.id === variantId);
      if (v) {
        variantName = v.variant_name;
        price = v.selling_price;
        moq = v.moq;
        sku = v.sku;
      }
    }

    const orderQty = qty && qty >= moq ? qty : moq;

    setCart((prev) => {
      const existingIdx = prev.findIndex(
        (i) => i.productId === product.id && i.variantId === variantId
      );

      if (existingIdx !== -1) {
        const updated = [...prev];
        updated[existingIdx].quantity += orderQty;
        return updated;
      }

      return [
        ...prev,
        {
          productId: product.id,
          variantId,
          name: product.name,
          variantName,
          sku,
          unit: product.unit,
          price,
          quantity: orderQty,
          moq,
        },
      ];
    });

    setCartOpen(true);
  };

  const updateCartQty = (productId: string, variantId: string | undefined, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.productId === productId && item.variantId === variantId) {
            const newQty = item.quantity + delta;
            return newQty >= item.moq ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const removeCartItem = (productId: string, variantId?: string) => {
    setCart((prev) => prev.filter((i) => !(i.productId === productId && i.variantId === variantId)));
  };

  const cartTotalAmount = cart.reduce((sum, item) => sum + item.quantity * item.price, 0);
  const cartTotalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  const handleBookOnWhatsApp = async () => {
    if (cart.length === 0) return;
    setSubmittingBooking(true);

    try {
      const res = await fetch("/api/buyer/booking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token: params.token,
          items: cart.map((i) => ({
            productId: i.productId,
            variantId: i.variantId,
            quantity: i.quantity,
          })),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to process booking");
      }

      if (data.whatsappUrl) {
        // Clear cart and redirect to official WhatsApp
        setCart([]);
        setCartOpen(false);
        window.open(data.whatsappUrl, "_blank");
      }
    } catch (err: any) {
      alert(err.message || "Error submitting booking request");
    } finally {
      setSubmittingBooking(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center text-slate-400">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-xs font-semibold tracking-wider uppercase text-slate-400">
            Loading Wholesale Catalog...
          </p>
        </div>
      </div>
    );
  }

  if (!catalog) {
    return null;
  }

  const filteredProducts = catalog.products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      (p.sku && p.sku.toLowerCase().includes(search.toLowerCase()));
    const matchesCat = activeCategory === "all" || p.category_id === activeCategory;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 flex flex-col text-slate-900 dark:text-slate-100">
      {/* Top B2B Header */}
      <header className="bg-slate-900 border-b border-slate-800 text-white sticky top-0 z-30 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white font-black shadow-lg shadow-blue-500/20">
              <Zap className="w-6 h-6" />
            </div>
            <div>
              <span className="font-black text-base sm:text-lg uppercase tracking-tight block">
                PRO TECH <span className="text-blue-400">ENTERPRISES</span>
              </span>
              <span className="text-[10px] text-slate-400 uppercase font-semibold tracking-wider block">
                {catalog.portalName}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:block text-right">
              <p className="text-xs font-bold text-white">{catalog.recipientName}</p>
              {catalog.companyName && (
                <p className="text-[10px] text-slate-400">{catalog.companyName}</p>
              )}
            </div>

            {/* Cart Trigger */}
            <button
              onClick={() => setCartOpen(true)}
              className="relative inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition shadow-lg shadow-blue-900/40"
            >
              <ShoppingCart className="w-4 h-4" />
              <span className="hidden sm:inline">Booking Cart</span>
              {cart.length > 0 && (
                <span className="w-5 h-5 rounded-full bg-emerald-500 text-white text-[10px] font-black flex items-center justify-center animate-pulse">
                  {cart.length}
                </span>
              )}
            </button>

            {/* Logout */}
            <button
              onClick={handleLogout}
              className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Category Filter Tabs & Search Bar */}
        <div className="bg-slate-950 border-t border-slate-800/80 px-4 sm:px-6 lg:px-8 py-3">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
            {/* Horizontal Categories */}
            <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 scrollbar-none">
              <button
                onClick={() => setActiveCategory("all")}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
                  activeCategory === "all"
                    ? "bg-blue-600 text-white shadow"
                    : "text-slate-400 hover:text-white hover:bg-slate-900"
                }`}
              >
                All Products
              </button>
              {catalog.categories.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setActiveCategory(c.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
                    activeCategory === c.id
                      ? "bg-blue-600 text-white shadow"
                      : "text-slate-400 hover:text-white hover:bg-slate-900"
                  }`}
                >
                  {c.name}
                </button>
              ))}
            </div>

            {/* Search */}
            <div className="relative w-full md:w-72 shrink-0">
              <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search products or SKU..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg bg-slate-900 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>
        </div>
      </header>

      {/* Main Catalog Product Grid */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500">
            {filteredProducts.length} Wholesale Items Available
          </h2>
          <span className="text-xs text-slate-400 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            Real-time Factory Stock Verification Active
          </span>
        </div>

        {filteredProducts.length === 0 ? (
          <div className="p-12 text-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
            <p className="text-sm text-slate-500">No products match your search or category filter.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((p) => {
              const inCart = cart.find((i) => i.productId === p.id);

              return (
                <div
                  key={p.id}
                  className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition flex flex-col justify-between"
                >
                  <div>
                    {/* Image with Stock Badge */}
                    <div className="relative aspect-[4/3] bg-slate-100 dark:bg-slate-950 overflow-hidden">
                      <img
                        src={
                          p.image_url ||
                          "https://images.unsplash.com/photo-1550524514-9b60459521ef?w=400&auto=format&fit=crop&q=80"
                        }
                        alt={p.name}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-3 right-3">
                        {p.is_available ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase bg-emerald-600 text-white shadow-md">
                            <CheckCircle className="w-3 h-3" />
                            <span>Available</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase bg-rose-600 text-white shadow-md">
                            <XCircle className="w-3 h-3" />
                            <span>Out of Stock</span>
                          </span>
                        )}
                      </div>
                      <div className="absolute bottom-2 left-2">
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-950/80 text-slate-200 backdrop-blur">
                          {p.category_name}
                        </span>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-4">
                      <h3 className="font-bold text-sm text-slate-900 dark:text-white line-clamp-2">
                        {p.name}
                      </h3>
                      {p.sku && (
                        <p className="text-[10px] font-mono text-slate-400 mt-0.5">SKU: {p.sku}</p>
                      )}
                      {p.description && (
                        <p className="text-xs text-slate-500 line-clamp-2 mt-2 leading-relaxed">
                          {p.description}
                        </p>
                      )}

                      {/* Variants if any */}
                      {p.variants && p.variants.length > 0 && (
                        <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                          <span className="text-[10px] font-semibold text-slate-400 block mb-1">
                            Available Variants:
                          </span>
                          <div className="flex flex-wrap gap-1.5">
                            {p.variants.map((v) => (
                              <span
                                key={v.id}
                                className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
                              >
                                {v.variant_name} &bull; ₹{v.selling_price}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Price & Action */}
                  <div className="p-4 pt-3 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 flex items-center justify-between">
                    <div>
                      <span className="text-lg font-black text-slate-900 dark:text-white">
                        ₹{p.selling_price.toLocaleString("en-IN")}
                      </span>
                      <span className="text-[10px] text-slate-400 block">
                        Per {p.unit} (MOQ: {p.moq})
                      </span>
                    </div>

                    <button
                      onClick={() => addToCart(p)}
                      disabled={!p.is_available}
                      className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-md shadow-blue-900/30 transition disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>{inCart ? "Add More" : "Add to Cart"}</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* Slide-out WhatsApp Bulk Booking Drawer */}
      {cartOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/60 backdrop-blur-sm">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 h-full flex flex-col shadow-2xl border-l border-slate-200 dark:border-slate-800">
            {/* Drawer Header */}
            <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-950">
              <div className="flex items-center gap-2">
                <ShoppingCart className="w-5 h-5 text-blue-600" />
                <h3 className="font-bold text-sm uppercase tracking-wider text-slate-900 dark:text-white">
                  Bulk Booking List ({cart.length})
                </h3>
              </div>
              <button
                onClick={() => setCartOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Cart Items List */}
            <div className="flex-1 p-4 overflow-y-auto space-y-3">
              {cart.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center text-slate-400 py-12">
                  <ShoppingCart className="w-12 h-12 text-slate-300 dark:text-slate-700 mb-2" />
                  <p className="text-xs font-semibold text-slate-500">Your bulk booking cart is empty.</p>
                  <p className="text-[11px] text-slate-400 mt-1">Select products and quantities from the catalog.</p>
                </div>
              ) : (
                cart.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex flex-col justify-between"
                  >
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div>
                        <h4 className="font-bold text-xs text-slate-900 dark:text-white">
                          {item.name}
                          {item.variantName && (
                            <span className="text-blue-500 font-semibold ml-1">({item.variantName})</span>
                          )}
                        </h4>
                        <span className="text-[10px] text-slate-400 block font-mono">
                          ₹{item.price} / {item.unit} &bull; MOQ: {item.moq}
                        </span>
                      </div>
                      <button
                        onClick={() => removeCartItem(item.productId, item.variantId)}
                        className="text-slate-400 hover:text-rose-500 transition"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-slate-200 dark:border-slate-800/60">
                      <div className="flex items-center gap-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-1">
                        <button
                          onClick={() => updateCartQty(item.productId, item.variantId, -item.moq)}
                          className="w-5 h-5 rounded flex items-center justify-center text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 font-bold text-xs"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-12 text-center font-bold text-xs font-mono">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateCartQty(item.productId, item.variantId, item.moq)}
                          className="w-5 h-5 rounded flex items-center justify-center text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 font-bold text-xs"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <div className="text-right">
                        <span className="text-xs font-black text-slate-900 dark:text-white">
                          ₹{(item.quantity * item.price).toLocaleString("en-IN")}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Cart Footer */}
            {cart.length > 0 && (
              <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Total Estimated Amount:
                  </span>
                  <span className="text-lg font-black text-slate-900 dark:text-white">
                    ₹{cartTotalAmount.toLocaleString("en-IN")}
                  </span>
                </div>

                <div className="p-3 bg-blue-50 dark:bg-blue-950/60 rounded-xl border border-blue-200 dark:border-blue-900 text-[11px] text-blue-800 dark:text-blue-300 leading-relaxed">
                  Clicking below creates a verified order request and opens WhatsApp with a pre-filled booking draft for instant factory confirmation.
                </div>

                <button
                  onClick={handleBookOnWhatsApp}
                  disabled={submittingBooking}
                  className="w-full py-3.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-sm tracking-wide shadow-xl shadow-emerald-950 transition flex items-center justify-center gap-2 hover:scale-[1.01] disabled:opacity-50"
                >
                  {submittingBooking ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <>
                      <MessageSquare className="w-5 h-5" />
                      <span>Book Order on WhatsApp</span>
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Persistent Bottom Bar on Mobile if Cart has items */}
      {cart.length > 0 && !cartOpen && (
        <div className="sticky bottom-0 z-20 md:hidden p-3 bg-slate-900 border-t border-slate-800 flex items-center justify-between text-white shadow-2xl">
          <div>
            <span className="text-[10px] text-slate-400 block uppercase font-semibold">Estimated Total:</span>
            <span className="text-sm font-black text-emerald-400">₹{cartTotalAmount.toLocaleString("en-IN")}</span>
          </div>

          <button
            onClick={() => setCartOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 text-white font-bold text-xs"
          >
            <MessageSquare className="w-4 h-4" />
            <span>Review & Book ({cart.length})</span>
          </button>
        </div>
      )}
    </div>
  );
}
