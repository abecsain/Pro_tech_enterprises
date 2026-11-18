import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import NoWheelNumberInputs from "@/components/NoWheelNumberInputs";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "PRO TECH ENTERPRISES | Electronics & LED Lighting Assembly",
  description:
    "OEM/ODM Electronics Manufacturing & Assembly - LED Bulbs, Downlights, Constant Current Drivers, and Precision Assemblies.",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full">
      <body className={`${inter.className} min-h-full flex flex-col bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100`}>
        <NoWheelNumberInputs />
        {children}
      </body>
    </html>
  );
}
