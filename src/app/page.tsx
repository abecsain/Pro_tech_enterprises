import Link from "next/link";
import {
  Cpu,
  ShieldCheck,
  Zap,
  Factory,
  Award,
  Phone,
  Mail,
  MapPin,
  MessageSquareText,
  CheckCircle2,
  Clock,
  Sparkles,
  ArrowRight,
  ShieldAlert,
  Boxes,
  FileCheck,
} from "lucide-react";
import { db } from "@/lib/db";

export default function HomePage() {
  const settings = db.getSettings();
  const cleanWhatsApp = settings.company_whatsapp.replace(/[^0-9]/g, "");
  const generalWhatsAppUrl = `https://wa.me/${cleanWhatsApp}?text=${encodeURIComponent(
    "Hello Pro Tech Enterprises, I would like to inquire regarding your electronics manufacturing, OEM assembly, and LED lighting capabilities."
  )}`;

  return (
    <div className="min-h-screen flex flex-col bg-white text-slate-800 antialiased selection:bg-blue-600 selection:text-white">
      {/* Top Trust & Compliance Bar */}
      <div className="bg-slate-900 text-slate-300 text-[11px] font-medium py-2 px-4 sm:px-6 lg:px-8 border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-center sm:text-left">
          <div className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-400"></span>
            <span>
              <strong className="text-white">ISO 9001:2015 Certified</strong> Electronics Assembling & Contract Manufacturing Plant
            </span>
          </div>
          <div className="flex items-center gap-4 text-slate-400">
            <span>Surge Endurance: 4.5 kV Standard</span>
            <span>&bull;</span>
            <span>100% Pre-Dispatch Burn-In QA</span>
            <span>&bull;</span>
            <span className="text-slate-300 font-mono">Faridabad EMC Cluster</span>
          </div>
        </div>
      </div>

      {/* Main Corporate Header */}
      <header className="border-b border-slate-200/80 bg-white/95 backdrop-blur-md sticky top-0 z-50 transition-all shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          {/* Logo & Identity */}
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
              <Zap className="w-6 h-6 fill-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl sm:text-2xl font-black tracking-tight text-slate-950 uppercase">
                  Pro Tech <span className="text-blue-600">Enterprises</span>
                </span>
                <span className="hidden md:inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full border border-blue-200">
                  <ShieldCheck className="w-3 h-3 text-blue-600" />
                  Verified Plant
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium tracking-wider uppercase">
                Electronics Manufacturing & LED Lighting Assembly
              </p>
            </div>
          </div>

          {/* Contact Direct & WhatsApp CTA */}
          <div className="flex items-center gap-4">
            <div className="hidden lg:flex flex-col text-right">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Direct Business Desk</span>
              <a href={`tel:${settings.company_phone}`} className="text-xs font-bold text-slate-800 hover:text-blue-600">
                {settings.company_phone}
              </a>
            </div>

            <a
              href={generalWhatsAppUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm transition-all shadow-md shadow-emerald-600/20 hover:scale-[1.02]"
            >
              <MessageSquareText className="w-4 h-4" />
              <span>Contact on WhatsApp</span>
            </a>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-slate-50 via-white to-slate-50 border-b border-slate-200/80 py-20 sm:py-28">
        {/* Subtle background technical grid */}
        <div className="absolute inset-0 bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:24px_24px] opacity-40"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Trust Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-slate-200 shadow-sm text-slate-700 text-xs font-semibold mb-8">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>OEM / ODM Electronics & LED Assembly Division</span>
            <span className="w-1.5 h-1.5 rounded-full bg-blue-600"></span>
            <span className="text-blue-600 font-bold">Sector 58 Industrial Cluster</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-6xl font-black text-slate-950 tracking-tight max-w-4xl mx-auto leading-[1.12]">
            High-Precision Electronics Assembly & <span className="text-blue-600">LED Lighting Manufacturing</span>
          </h1>

          <p className="mt-6 text-base sm:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed font-normal">
            Contract manufacturing and automated surface-mount assembly engineered for high surge endurance (4.5kV), extreme voltage tolerance, and zero-defect industrial reliability.
          </p>

          {/* Action CTAs */}
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <a
              href={generalWhatsAppUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2.5 px-8 py-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-base transition-all shadow-lg shadow-emerald-600/25 hover:scale-[1.02]"
            >
              <MessageSquareText className="w-5 h-5" />
              <span>Inquire via WhatsApp</span>
            </a>

            <a
              href="#capabilities"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-white hover:bg-slate-50 text-slate-800 font-bold text-base border border-slate-300 shadow-sm hover:border-slate-400 transition-all"
            >
              <span>Manufacturing Scope</span>
              <ArrowRight className="w-4 h-4 text-slate-500" />
            </a>
          </div>

          {/* 4 Trust Verification Pillars */}
          <div className="mt-16 pt-10 border-t border-slate-200/80 grid grid-cols-2 md:grid-cols-4 gap-6 text-left max-w-5xl mx-auto">
            <div className="p-4 rounded-xl bg-white border border-slate-200/80 shadow-xs flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-bold text-slate-900 uppercase">4.5 kV Surge Immunity</p>
                <p className="text-[11px] text-slate-500 mt-0.5">Dual-stage MOV & GDT surge suppression standard</p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-white border border-slate-200/80 shadow-xs flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-bold text-slate-900 uppercase">100% 4-Hour Burn-In</p>
                <p className="text-[11px] text-slate-500 mt-0.5">Continuous thermal aging audit before packaging</p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-white border border-slate-200/80 shadow-xs flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-bold text-slate-900 uppercase">50,000+ Monthly Run</p>
                <p className="text-[11px] text-slate-500 mt-0.5">High-speed pick & place and wave soldering line</p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-white border border-slate-200/80 shadow-xs flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-bold text-slate-900 uppercase">RoHS & Lead-Free</p>
                <p className="text-[11px] text-slate-500 mt-0.5">Certified green solder alloy with batch tracing</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Capabilities Overview Section */}
      <section id="capabilities" className="py-20 bg-slate-50 border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-bold text-blue-600 tracking-widest uppercase bg-blue-50 border border-blue-200 px-3 py-1 rounded-full">
              Factory Infrastructure
            </span>
            <h2 className="mt-4 text-3xl sm:text-4xl font-extrabold text-slate-950 tracking-tight">
              Our Assembling & Contract Manufacturing Pillars
            </h2>
            <p className="mt-3 text-slate-600 text-sm sm:text-base leading-relaxed">
              Equipped with high-precision SMT pick-and-place lines, automatic nitrogen wave soldering, automated epoxy vacuum potting units, and multi-stage testing benches.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Pillar 1 */}
            <div className="p-8 rounded-2xl bg-white border border-slate-200 shadow-sm hover:border-blue-500 hover:shadow-md transition">
              <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600 mb-6">
                <Cpu className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-950 mb-2">Automated SMT & PCBA Assembly</h3>
              <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                High-speed component placement for MCPCB (metal core) and FR4 multi-layer substrates supporting 0402 passives up to high-lumen Seoul/Edison SMD emitters with zero thermal resistance compromise.
              </p>
              <div className="mt-4 pt-4 border-t border-slate-100 flex items-center gap-2 text-xs font-semibold text-blue-600">
                <span>Precision Placement Accuracy &plusmn;0.03mm</span>
              </div>
            </div>

            {/* Pillar 2 */}
            <div className="p-8 rounded-2xl bg-white border border-slate-200 shadow-sm hover:border-blue-500 hover:shadow-md transition">
              <div className="w-12 h-12 rounded-xl bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-600 mb-6">
                <Factory className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-950 mb-2">LED Driver & Power Supply Line</h3>
              <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                Dedicated assembly line for isolated constant-current and constant-voltage drivers featuring active Power Factor Correction (PF &gt; 0.98), low harmonic distortion (THD &lt; 10%), and 4.5kV surge withstand.
              </p>
              <div className="mt-4 pt-4 border-t border-slate-100 flex items-center gap-2 text-xs font-semibold text-indigo-600">
                <span>Thermal Vacuum Epoxy Potting</span>
              </div>
            </div>

            {/* Pillar 3 */}
            <div className="p-8 rounded-2xl bg-white border border-slate-200 shadow-sm hover:border-blue-500 hover:shadow-md transition">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 mb-6">
                <Award className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-950 mb-2">100% Pre-Dispatch Burn-In QA</h3>
              <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                Every assembled luminaire and driver batch undergoes 4-hour continuous thermal load cycling, high-voltage impulse testing, and spectral lux calibration prior to packing into distributor master cartons.
              </p>
              <div className="mt-4 pt-4 border-t border-slate-100 flex items-center gap-2 text-xs font-semibold text-emerald-600">
                <span>Zero Failure Tolerance Quality Policy</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Manufacturing Scope Overview (NO PRICES / NO CATALOG / NO PURCHASES) */}
      <section className="py-20 bg-white border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Assembly Scope</span>
            <h2 className="mt-2 text-2xl sm:text-3xl font-extrabold text-slate-950">
              Electronics & LED Products Manufactured
            </h2>
            <p className="mt-2 text-slate-600 text-xs sm:text-sm">
              We engineer and assemble high-efficiency hardware across residential, retail, industrial, and outdoor sectors:
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="p-5 rounded-xl bg-slate-50 border border-slate-200/80 text-center flex flex-col items-center">
              <div className="w-10 h-10 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center mb-3">
                <Zap className="w-5 h-5" />
              </div>
              <h4 className="text-xs font-bold text-slate-900 uppercase">LED Bulbs & Lamps</h4>
              <p className="text-[11px] text-slate-500 mt-1">5W to 20W B22/E27 surge-proof bulbs</p>
            </div>

            <div className="p-5 rounded-xl bg-slate-50 border border-slate-200/80 text-center flex flex-col items-center">
              <div className="w-10 h-10 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center mb-3">
                <Boxes className="w-5 h-5" />
              </div>
              <h4 className="text-xs font-bold text-slate-900 uppercase">Slim Ceiling Panels</h4>
              <p className="text-[11px] text-slate-500 mt-1">Edge-lit & backlit glare-free downlights</p>
            </div>

            <div className="p-5 rounded-xl bg-slate-50 border border-slate-200/80 text-center flex flex-col items-center">
              <div className="w-10 h-10 rounded-lg bg-cyan-100 text-cyan-700 flex items-center justify-center mb-3">
                <Cpu className="w-5 h-5" />
              </div>
              <h4 className="text-xs font-bold text-slate-900 uppercase">LED Power Drivers</h4>
              <p className="text-[11px] text-slate-500 mt-1">Isolated constant-current & potted units</p>
            </div>

            <div className="p-5 rounded-xl bg-slate-50 border border-slate-200/80 text-center flex flex-col items-center">
              <div className="w-10 h-10 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center mb-3">
                <FileCheck className="w-5 h-5" />
              </div>
              <h4 className="text-xs font-bold text-slate-900 uppercase">MCPCB Modules</h4>
              <p className="text-[11px] text-slate-500 mt-1">High-efficiency aluminium substrate arrays</p>
            </div>

            <div className="p-5 rounded-xl bg-slate-50 border border-slate-200/80 text-center flex flex-col items-center">
              <div className="w-10 h-10 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center mb-3">
                <Factory className="w-5 h-5" />
              </div>
              <h4 className="text-xs font-bold text-slate-900 uppercase">Aluminium Housings</h4>
              <p className="text-[11px] text-slate-500 mt-1">Die-cast street light & bay fixtures</p>
            </div>
          </div>
        </div>
      </section>

      {/* Plant Specifications & Institutional Data */}
      <section className="py-16 bg-slate-50 border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs">
              <div className="text-3xl sm:text-4xl font-black text-blue-600">50,000+</div>
              <div className="text-xs uppercase font-bold text-slate-700 mt-1.5">Monthly Assembly Units</div>
              <p className="text-[11px] text-slate-400 mt-0.5">High-speed dual placement line</p>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs">
              <div className="text-3xl sm:text-4xl font-black text-slate-900">4.5 kV</div>
              <div className="text-xs uppercase font-bold text-slate-700 mt-1.5">Surge Endurance Rating</div>
              <p className="text-[11px] text-slate-400 mt-0.5">Dual MOV high-voltage immunity</p>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs">
              <div className="text-3xl sm:text-4xl font-black text-emerald-600">100%</div>
              <div className="text-xs uppercase font-bold text-slate-700 mt-1.5">Thermal Aging Tested</div>
              <p className="text-[11px] text-slate-400 mt-0.5">4-hour full-load chamber test</p>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs">
              <div className="text-3xl sm:text-4xl font-black text-indigo-600">OEM / ODM</div>
              <div className="text-xs uppercase font-bold text-slate-700 mt-1.5">Contract Manufacturing</div>
              <p className="text-[11px] text-slate-400 mt-0.5">White-label & custom branding</p>
            </div>
          </div>
        </div>
      </section>

      {/* Corporate Facility & Direct Contact */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-950">Manufacturing Facility & Direct Inquiries</h2>
            <p className="text-slate-600 text-xs sm:text-sm mt-2">
              For commercial supply contracts, institutional OEM partnerships, and technical specifications:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-start gap-4 p-6 rounded-2xl bg-slate-50 border border-slate-200">
              <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-950 uppercase tracking-wider">Manufacturing Plant</h4>
                <p className="mt-1 text-slate-600 text-xs leading-relaxed">{settings.company_address}</p>
                <span className="inline-block mt-2 text-[10px] font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                  Faridabad Industrial EMC Hub
                </span>
              </div>
            </div>

            <div className="flex items-start gap-4 p-6 rounded-2xl bg-slate-50 border border-slate-200">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                <Phone className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-950 uppercase tracking-wider">Direct Business Lines</h4>
                <p className="mt-1 text-slate-700 text-xs font-semibold">{settings.company_phone}</p>
                <p className="text-slate-600 text-xs mt-0.5">WhatsApp: +{cleanWhatsApp}</p>
                <span className="inline-block mt-2 text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  Mon - Sat &bull; 9:00 AM - 6:30 PM
                </span>
              </div>
            </div>

            <div className="flex items-start gap-4 p-6 rounded-2xl bg-slate-50 border border-slate-200">
              <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center shrink-0">
                <Mail className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-950 uppercase tracking-wider">Corporate Communications</h4>
                <p className="mt-1 text-slate-700 text-xs font-semibold">{settings.company_email}</p>
                <p className="text-slate-500 text-xs mt-0.5">Official inquiry desk for OEMs & Wholesalers</p>
                <span className="inline-block mt-2 text-[10px] font-semibold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
                  Response within 24 business hours
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer (No Admin Links, Pure Corporate Trust) */}
      <footer className="mt-auto py-10 border-t border-slate-200 bg-slate-50 text-slate-500 text-xs text-center">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-slate-200 pb-6 mb-6">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded bg-blue-600 flex items-center justify-center text-white font-bold text-xs">
                <Zap className="w-4 h-4 fill-white" />
              </div>
              <span className="font-extrabold text-sm text-slate-900 uppercase">
                Pro Tech <span className="text-blue-600">Enterprises</span>
              </span>
            </div>
            <p className="text-[11px] text-slate-500">
              Electronics Manufacturing, PCBA Assembly & LED Lighting OEM Plant &bull; Faridabad, Haryana, India
            </p>
          </div>

          <p>&copy; {new Date().getFullYear()} PRO TECH ENTERPRISES. All Rights Reserved. Electronics Manufacturing Division.</p>
          <p className="mt-1.5 text-slate-400 text-[11px]">
            Notice: Private distributor product catalogs and wholesale pricing portals are accessible strictly via authorized, tokenized partner access keys.
          </p>
        </div>
      </footer>
    </div>
  );
}
