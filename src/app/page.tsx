"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Recycle,
  Zap,
  Shield,
  Globe,
  ArrowRight,
  ChevronDown,
  Cpu,
  BarChart3,
  Leaf,
} from "lucide-react";

// Lazy load 3D canvas so it only renders client-side
const HeroCanvas = dynamic(() => import("@/components/HeroCanvas"), { ssr: false });

const features = [
  {
    icon: Cpu,
    title: "TinyFish AI Agent",
    description:
      "Autonomous web navigation agent that browses regional e-waste directories, bypasses SPAs and anti-bot systems to extract live recycling data.",
    color: "text-green-400",
    border: "border-green-500/20",
    bg: "bg-green-500/5",
  },
  {
    icon: BarChart3,
    title: "Smart Recycling Score",
    description:
      "AI-computed recycling scores for every asset. Know the CO₂ impact, compliance status, and fair market payout for your e-waste instantly.",
    color: "text-cyan-400",
    border: "border-cyan-500/20",
    bg: "bg-cyan-500/5",
  },
  {
    icon: Shield,
    title: "Verified Recycler Network",
    description:
      "Every recycler is cross-referenced with ISO 14001 and R2 Certification databases, ensuring compliance and responsible material handling.",
    color: "text-purple-400",
    border: "border-purple-500/20",
    bg: "bg-purple-500/5",
  },
  {
    icon: Globe,
    title: "Green Supply Chain",
    description:
      "Enterprise-grade supply chain intelligence. Monitor hardware lifecycle, predict end-of-life timelines, and automate responsible disposal.",
    color: "text-yellow-400",
    border: "border-yellow-500/20",
    bg: "bg-yellow-500/5",
  },
];

const stats = [
  { value: "12K+", label: "Assets Audited" },
  { value: "94T kg", label: "CO₂ Offset" },
  { value: "3,200+", label: "Recyclers Found" },
  { value: "99.2%", label: "Compliance Rate" },
];

export default function HomePage() {
  return (
    <main className="flex flex-col min-h-screen">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 glass border-b border-green-500/10 backdrop-blur-xl">
        <Link href="/" className="flex items-center gap-2" id="nav-logo">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-green-400 to-cyan-500 flex items-center justify-center">
            <Recycle className="w-4 h-4 text-black" />
          </div>
          <span className="font-bold text-white text-lg tracking-tight">EcoSync</span>
        </Link>

        <div className="hidden md:flex items-center gap-6 text-sm text-gray-400">
          <Link href="#features" className="hover:text-green-400 transition-colors">Features</Link>
          <Link href="#stats" className="hover:text-green-400 transition-colors">Impact</Link>
          <Link href="/dashboard" className="hover:text-green-400 transition-colors">Dashboard</Link>
        </div>

        <Link href="/dashboard" id="nav-cta">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-green-500 to-cyan-500 text-black text-sm font-semibold glow-green"
          >
            <Zap className="w-4 h-4" />
            Launch App
          </motion.button>
        </Link>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* 3D Canvas Background */}
        <HeroCanvas />

        {/* Radial gradient overlay */}
        <div className="absolute inset-0 bg-radial-gradient pointer-events-none"
          style={{
            background: "radial-gradient(ellipse 80% 60% at 50% 50%, transparent 30%, #030712 100%)"
          }}
        />

        {/* Grid bg */}
        <div className="absolute inset-0 grid-bg opacity-50 pointer-events-none" />

        {/* Hero Content */}
        <div className="relative z-10 text-center px-4 max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-2 text-xs text-green-400 border border-green-500/30 bg-green-500/5 px-4 py-2 rounded-full mb-6">
              <div className="w-1.5 h-1.5 rounded-full bg-green-400 pulse-ring" />
              Autonomous AI Agent — Live
            </div>

            <h1 className="text-5xl md:text-7xl font-black mb-6 leading-none tracking-tight">
              <span className="text-white">The Future of</span>
              <br />
              <span className="gradient-text">E-Waste Intelligence</span>
            </h1>

            <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
              EcoSync&apos;s autonomous AI agent navigates the web, finds verified local recyclers,
              extracts live payout rates, and scores your hardware — all in seconds.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link href="/dashboard" id="hero-cta-primary">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center gap-2 px-7 py-3.5 rounded-2xl bg-gradient-to-r from-green-500 to-cyan-500 text-black font-bold text-base glow-green"
                >
                  <Leaf className="w-5 h-5" />
                  Start Recycling
                  <ArrowRight className="w-4 h-4" />
                </motion.button>
              </Link>

              <Link href="#features" id="hero-cta-secondary">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center gap-2 px-7 py-3.5 rounded-2xl glass glow-border text-white font-semibold text-base"
                >
                  Learn More
                  <ChevronDown className="w-4 h-4" />
                </motion.button>
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
        >
          <ChevronDown className="w-6 h-6 text-green-400/50" />
        </motion.div>
      </section>

      {/* Stats Section */}
      <section id="stats" className="py-20 px-4 border-y border-green-500/10">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center glass glow-border rounded-2xl p-6"
              >
                <div className="text-3xl md:text-4xl font-black gradient-text mb-2">{stat.value}</div>
                <div className="text-sm text-gray-500">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-black text-white mb-4">
              Built for the <span className="gradient-text">Green Economy</span>
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Enterprise-grade e-waste management powered by an autonomous AI that does the heavy lifting.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {features.map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className={`glass rounded-2xl p-6 border ${feature.border} ${feature.bg} group hover:scale-[1.02] transition-transform duration-300`}
              >
                <div className={`w-12 h-12 rounded-xl ${feature.bg} border ${feature.border} flex items-center justify-center mb-4`}>
                  <feature.icon className={`w-6 h-6 ${feature.color}`} />
                </div>
                <h3 className={`text-lg font-bold ${feature.color} mb-2`}>{feature.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="glass glow-border rounded-3xl p-12 relative overflow-hidden"
          >
            <div className="scanline opacity-50" />
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-green-400 to-cyan-500 flex items-center justify-center mx-auto mb-6">
              <Recycle className="w-8 h-8 text-black" />
            </div>
            <h2 className="text-3xl md:text-4xl font-black text-white mb-4">
              Start Recycling Smarter<span className="gradient-text">.</span>
            </h2>
            <p className="text-gray-400 mb-8 max-w-xl mx-auto">
              Join thousands of individuals and enterprises using EcoSync to turn e-waste into value and protect the planet.
            </p>
            <Link href="/dashboard" id="cta-launch-btn">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-gradient-to-r from-green-500 to-cyan-500 text-black font-bold text-base glow-green"
              >
                <Zap className="w-5 h-5" />
                Launch EcoSync Dashboard
                <ArrowRight className="w-4 h-4" />
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-green-500/10 py-8 px-6 text-center text-gray-600 text-sm">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Recycle className="w-4 h-4 text-green-500/50" />
          <span className="text-green-500/50 font-semibold">EcoSync</span>
        </div>
        <p>Built for HackIIITD — Autonomous Green Supply Chain &amp; E-Waste Intelligence Platform</p>
      </footer>
    </main>
  );
}
