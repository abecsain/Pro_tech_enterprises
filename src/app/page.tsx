import Link from "next/link";
import { Cpu, ShieldCheck, Zap, Factory, Award, Phone, Mail, MapPin, MessageSquareText } from "lucide-react";
import { db } from "@/lib/db";

export default function HomePage() {
  const settings = db.getSettings();
  const cleanWhatsApp = settings.company_whatsapp.replace(/[^0-9]/g, "");
  const generalWhatsAppUrl = `https://wa.me/${cleanWhatsApp}?text=${encodeURIComponent(
    "Hello Pro Tech Enterprises, I would like to inquire about your electronics manufacturing & assembly capabilities."
  )}`;

  return (
    <div className="min-h-screen flex flex-col bg-slate-900 text-slate-100">
      {/* Top Corporate Header */}
      <header className="border-b border-slate-800 bg-slate-950/80 backdrop-blur sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-blue-500/20">
              <Zap className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xl sm:text-2xl font-black tracking-tight text-white uppercase">
                Pro Tech <span className="text-blue-500">Enterprises</span>
              </span>
              <p className="text-xs text-slate-400 font-medium tracking-wider uppercase">
                Electronics & LED Lighting Assembly
              </p>
            </div>
          </div>

          <a
            href={generalWhatsAppUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-sm transition-all shadow-md shadow-emerald-900/30 hover:scale-[1.02]"
          >
            <MessageSquareText className="w-4 h-4" />
            <span>Contact on WhatsApp</span>
          </a>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-24 sm:py-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-950/80 border border-blue-800/60 text-blue-300 text-xs font-semibold uppercase tracking-wider mb-8">
          <ShieldCheck className="w-4 h-4 text-blue-400" />
          <span>Industrial Precision OEM/ODM Assembly</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-extrabold text-white tracking-tight max-w-4xl mx-auto leading-tight">
          Precision Electronics & <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">LED Lighting Manufacturing</span>
        </h1>

        <p className="mt-6 text-lg sm:text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed">
          Pro Tech Enterprises is a specialized electronics assembly and contract manufacturing plant delivering industrial-grade LED fixtures, constant-current power drivers, and surface-mount PCB assemblies with rigorous testing.
        </p>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <a
            href={generalWhatsAppUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2.5 px-8 py-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-base transition-all shadow-xl shadow-emerald-950 hover:shadow-emerald-700/50"
          >
            <MessageSquareText className="w-5 h-5" />
            <span>Connect on WhatsApp</span>
          </a>

          <a
            href="#capabilities"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-200 font-semibold text-base border border-slate-700 transition-all"
          >
            Explore Capabilities
          </a>
        </div>
      </section>

      {/* Capabilities Overview Section */}
      <section id="capabilities" className="py-20 bg-slate-950 border-y border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-xs font-bold text-blue-400 tracking-widest uppercase">Factory Infrastructure</h2>
            <p className="mt-2 text-3xl font-bold text-white tracking-tight">Our Manufacturing Capabilities</p>
            <p className="mt-4 text-slate-400 text-sm sm:text-base">
              Equipped with high-precision SMT pick-and-place lines, automatic wave soldering, thermal potting units, and multi-stage burn-in test chambers.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition">
              <div className="w-12 h-12 rounded-xl bg-blue-900/50 border border-blue-700 flex items-center justify-center text-blue-400 mb-6">
                <Cpu className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Automated SMT & PCBA Assembly</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                High-speed component placement for MCPCB and FR4 substrates supporting 0402 passives up to high-power LED emitters with zero thermal distortion.
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition">
              <div className="w-12 h-12 rounded-xl bg-cyan-900/50 border border-cyan-700 flex items-center justify-center text-cyan-400 mb-6">
                <Factory className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">LED Driver & Power Supply Line</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Dedicated production line for constant current drivers with 4.5kV surge suppression, high power factor (&gt;0.98), and vacuum potting.
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition">
              <div className="w-12 h-12 rounded-xl bg-emerald-900/50 border border-emerald-700 flex items-center justify-center text-emerald-400 mb-6">
                <Award className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">100% Burn-in & Surge Testing</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Every assembled luminaire and driver undergoes 4-hour thermal load burn-in cycling and high-voltage surge impulse verification prior to packaging.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Plant Specifications */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div className="p-6 rounded-xl bg-slate-800/40 border border-slate-800">
            <div className="text-3xl font-extrabold text-blue-400">50,000+</div>
            <div className="text-xs uppercase font-medium text-slate-400 mt-1">Monthly LED Units Assembled</div>
          </div>
          <div className="p-6 rounded-xl bg-slate-800/40 border border-slate-800">
            <div className="text-3xl font-extrabold text-cyan-400">4.5 kV</div>
            <div className="text-xs uppercase font-medium text-slate-400 mt-1">Surge Protection Standard</div>
          </div>
          <div className="p-6 rounded-xl bg-slate-800/40 border border-slate-800">
            <div className="text-3xl font-extrabold text-emerald-400">100%</div>
            <div className="text-xs uppercase font-medium text-slate-400 mt-1">Pre-Dispatch Burn-in Audit</div>
          </div>
          <div className="p-6 rounded-xl bg-slate-800/40 border border-slate-800">
            <div className="text-3xl font-extrabold text-amber-400">OEM/ODM</div>
            <div className="text-xs uppercase font-medium text-slate-400 mt-1">Custom Assembly Solutions</div>
          </div>
        </div>
      </section>

      {/* Corporate Contact Details */}
      <section className="py-16 bg-slate-950 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-2xl font-bold text-white">Business Inquiries & Plant Location</h2>
            <p className="text-slate-400 text-sm mt-2">
              For corporate contracts, OEM assembling partnerships, and institutional supply:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center sm:text-left">
            <div className="flex items-start gap-4 p-6 rounded-xl bg-slate-900/60 border border-slate-800">
              <MapPin className="w-6 h-6 text-blue-400 shrink-0 mt-1" />
              <div>
                <h4 className="text-sm font-semibold text-white uppercase tracking-wider">Manufacturing Plant</h4>
                <p className="mt-1 text-slate-400 text-sm leading-relaxed">{settings.company_address}</p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-6 rounded-xl bg-slate-900/60 border border-slate-800">
              <Phone className="w-6 h-6 text-blue-400 shrink-0 mt-1" />
              <div>
                <h4 className="text-sm font-semibold text-white uppercase tracking-wider">Direct Business Lines</h4>
                <p className="mt-1 text-slate-400 text-sm">{settings.company_phone}</p>
                <p className="text-slate-400 text-sm">WhatsApp: +{cleanWhatsApp}</p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-6 rounded-xl bg-slate-900/60 border border-slate-800">
              <Mail className="w-6 h-6 text-blue-400 shrink-0 mt-1" />
              <div>
                <h4 className="text-sm font-semibold text-white uppercase tracking-wider">Email Communications</h4>
                <p className="mt-1 text-slate-400 text-sm">{settings.company_email}</p>
                <p className="text-slate-400 text-sm">Response within 24 business hours</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer (No Admin Links, No Catalogs, Pure Corporate) */}
      <footer className="mt-auto py-8 border-t border-slate-800 bg-slate-950 text-slate-500 text-xs text-center">
        <p>&copy; {new Date().getFullYear()} PRO TECH ENTERPRISES. All Rights Reserved. Electronics Manufacturing & Assembly Division.</p>
        <p className="mt-1 text-slate-600">Confidential B2B Wholesale Portals are accessible via direct authorized distributor tokens only.</p>
      </footer>
    </div>
  );
}
