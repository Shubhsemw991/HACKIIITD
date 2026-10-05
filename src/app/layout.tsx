import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "EcoSync — Autonomous Green Supply Chain & E-Waste Intelligence",
  description:
    "EcoSync is an AI-powered platform for green supply chain management, e-waste intelligence, autonomous recycler discovery, and real-time sustainability scoring.",
  keywords: ["e-waste", "recycling", "sustainability", "green supply chain", "AI"],
  openGraph: {
    title: "EcoSync — E-Waste Intelligence Platform",
    description: "Autonomous AI agent for finding local recyclers, live payout rates & compliance.",
    type: "website",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#030712] text-[#f0fdf4]">
        {children}
      </body>
    </html>
  );
}
