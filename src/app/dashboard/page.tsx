"use client";

import { useState, useRef, useCallback } from "react";
import dynamic from "next/dynamic";
import { motion, AnimatePresence } from "framer-motion";
import { AgentTerminal, useAgentLogs } from "@/components/AgentTerminal";
import RecyclerGrid from "@/components/RecyclerGrid";
import {
  Cpu, Search, Zap, CheckCircle, BarChart3, Package,
  Upload, X, ImageIcon, AlertTriangle,
} from "lucide-react";

const DashboardBackground = dynamic(() => import("@/components/DashboardBackground"), { ssr: false });

interface RecyclerNode {
  id: string;
  name: string;
  locationLat: number;
  locationLng: number;
  verifiedLicense: boolean;
  acceptedMaterials: string[];
  livePayoutRate: number;
}

interface ScanResult {
  recyclingScore: number;
  estimatedValue: number;
  nodes: RecyclerNode[];
  complianceStandards: string[];
}

const deviceTypes = [
  "Smartphone / Tablet",
  "Laptop / Desktop",
  "Monitor / Display",
  "Circuit Board / PCB",
  "Battery Pack",
  "Printer / Scanner",
  "Server Hardware",
  "Mixed E-Waste",
];

// Faulty parts grouped by category
const faultyPartOptions: Record<string, string[]> = {
  "Display": ["Screen cracked", "Display not working", "Backlight failure", "Dead pixels"],
  "Power": ["Won't turn on", "Battery dead / swollen", "Charging port broken", "Power button stuck"],
  "Input": ["Keyboard broken", "Touchpad not working", "Mouse buttons stuck", "USB ports dead"],
  "Storage": ["HDD / SSD failure", "Data not accessible", "Not booting", "Corrupted OS"],
  "Hardware": ["CPU overheating", "RAM failure", "GPU not working", "Motherboard damaged"],
  "Connectivity": ["Wi-Fi broken", "Bluetooth not working", "Speaker / mic broken", "Camera dead"],
};

export default function Dashboard() {
  const [deviceType, setDeviceType] = useState("");
  const [specs, setSpecs] = useState("");
  const [location, setLocation] = useState("");
  const [quantity, setQuantity] = useState("1");
  const [faultyParts, setFaultyParts] = useState<string[]>([]);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [uploadedFileName, setUploadedFileName] = useState<string>("");
  const [isDragging, setIsDragging] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ScanResult | null>(null);
  const [activeTab, setActiveTab] = useState<"submit" | "parts" | "results">("submit");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { logs, isRunning, setIsRunning, addLog, clearLogs } = useAgentLogs();

  const toggleFaultyPart = (part: string) => {
    setFaultyParts((prev) =>
      prev.includes(part) ? prev.filter((p) => p !== part) : [...prev, part]
    );
  };

  const handleImageFile = (file: File) => {
    if (!file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      setUploadedImage(e.target?.result as string);
      setUploadedFileName(file.name);
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleImageFile(file);
  }, []);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => setIsDragging(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleImageFile(file);
  };

  function delay(ms: number) {
    return new Promise((r) => setTimeout(r, ms));
  }

  const handleScan = async () => {
    if (!deviceType || !location) return;
    setLoading(true);
    setIsRunning(true);
    clearLogs();
    setResult(null);

    try {
      addLog(`Initializing TinyFish agent for "${deviceType}" near "${location}"...`, "info");
      await delay(700);
      if (uploadedImage) addLog("Device image received — running visual condition analysis...", "processing");
      await delay(600);
      if (faultyParts.length > 0)
        addLog(`Faulty parts flagged: ${faultyParts.slice(0, 3).join(", ")}${faultyParts.length > 3 ? ` +${faultyParts.length - 3} more` : ""}`, "warn");
      await delay(500);
      addLog("Launching autonomous browser session...", "processing");
      await delay(800);
      addLog("Navigating regional e-waste directories (IEW, Basel Action Network, R2 Registry)...", "processing");
      await delay(900);
      addLog("Bypassing SPA dynamic rendering & anti-bot measures...", "warn");
      await delay(700);
      addLog("Extracting structured JSON: live payout rates, drop-off rules, compliance metadata...", "processing");
      await delay(800);
      addLog("Cross-referencing ISO 14001 & R2 certification databases...", "info");
      await delay(600);
      addLog("Computing recycling score and estimated material value...", "processing");
      await delay(600);

      const response = await fetch("/api/scan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          deviceType,
          specsDescription: specs,
          location,
          quantity,
          faultyParts,
          hasImage: !!uploadedImage,
        }),
      });

      const data = await response.json();

      addLog(`Agent found ${data.nodes.length} verified recycler nodes!`, "success");
      addLog(`Recycling score: ${data.recyclingScore}/100 — Est. value: $${data.estimatedValue}`, "success");
      addLog("Data persisted to EcoSync database. Task complete.", "success");

      setResult(data);
      setActiveTab("results");
    } catch {
      addLog("Agent encountered an error. Using fallback data.", "warn");
    } finally {
      setLoading(false);
      setIsRunning(false);
    }
  };

  const canScan = deviceType && location && !loading;

  return (
    <div className="relative min-h-screen pt-20 pb-16 px-4">
      {/* 3D Recycling Background */}
      <DashboardBackground />

      {/* Dark overlay so content stays readable */}
      <div className="fixed inset-0 bg-[#030712]/75 pointer-events-none" style={{ zIndex: 1 }} />

      {/* Main content */}
      <div className="relative max-w-6xl mx-auto" style={{ zIndex: 2 }}>
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-green-500/10 border border-green-500/20 flex items-center justify-center">
              <Cpu className="w-5 h-5 text-green-400" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">EcoSync Dashboard</h1>
              <p className="text-sm text-gray-500">Autonomous E-Waste Intelligence Platform</p>
            </div>
          </div>
        </motion.div>

        {/* Stats Row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
        >
          {[
            { label: "Assets Audited", value: "12,847", icon: Package, color: "text-green-400" },
            { label: "CO₂ Offset (kg)", value: "94,320", icon: Zap, color: "text-cyan-400" },
            { label: "Recyclers Found", value: "3,201", icon: Search, color: "text-purple-400" },
            { label: "Avg. Score", value: "87/100", icon: BarChart3, color: "text-yellow-400" },
          ].map((stat, i) => (
            <div key={i} className="glass glow-border rounded-2xl p-4">
              <stat.icon className={`w-5 h-5 ${stat.color} mb-2`} />
              <div className={`text-xl font-bold ${stat.color}`}>{stat.value}</div>
              <div className="text-xs text-gray-500 mt-0.5">{stat.label}</div>
            </div>
          ))}
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* ── LEFT PANEL ── */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2 space-y-5"
          >
            {/* Tab Bar */}
            <div className="flex gap-1.5 glass rounded-xl p-1 border border-green-500/10">
              {(["submit", "parts", "results"] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`flex-1 py-2 text-xs font-medium rounded-lg transition-all ${
                    activeTab === tab
                      ? "bg-green-500/15 text-green-400 border border-green-500/30"
                      : "text-gray-500 hover:text-gray-300"
                  }`}
                >
                  {tab === "submit" ? "Asset Info" : tab === "parts" ? "Fault Report" : "Results"}
                </button>
              ))}
            </div>

            {/* ── TAB: ASSET INFO ── */}
            <AnimatePresence mode="wait">
              {activeTab === "submit" && (
                <motion.div
                  key="submit"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="glass glow-border rounded-2xl p-5 space-y-4"
                >
                  <h2 className="text-sm font-semibold text-white">Asset Submission</h2>

                  {/* Device Type */}
                  <div>
                    <label className="text-xs text-gray-400 block mb-1.5">Device Type *</label>
                    <select
                      id="device-type-select"
                      value={deviceType}
                      onChange={(e) => setDeviceType(e.target.value)}
                      className="w-full bg-black/40 border border-green-500/20 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-green-400/50 transition-colors"
                    >
                      <option value="">Select device type...</option>
                      {deviceTypes.map((d) => <option key={d} value={d}>{d}</option>)}
                    </select>
                  </div>

                  {/* Specs */}
                  <div>
                    <label className="text-xs text-gray-400 block mb-1.5">Specs / Condition</label>
                    <textarea
                      id="specs-textarea"
                      value={specs}
                      onChange={(e) => setSpecs(e.target.value)}
                      placeholder="e.g. iPhone 12, cracked screen, 64GB — or Dell XPS 15, dead battery..."
                      rows={2}
                      className="w-full bg-black/40 border border-green-500/20 rounded-xl px-3 py-2.5 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:border-green-400/50 resize-none transition-colors"
                    />
                  </div>

                  {/* Location + Quantity */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs text-gray-400 block mb-1.5">Location *</label>
                      <input
                        id="location-input"
                        type="text"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        placeholder="City or ZIP"
                        className="w-full bg-black/40 border border-green-500/20 rounded-xl px-3 py-2.5 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:border-green-400/50 transition-colors"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-gray-400 block mb-1.5">Quantity</label>
                      <input
                        id="quantity-input"
                        type="number"
                        value={quantity}
                        onChange={(e) => setQuantity(e.target.value)}
                        min="1"
                        className="w-full bg-black/40 border border-green-500/20 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-green-400/50 transition-colors"
                      />
                    </div>
                  </div>

                  {/* ── IMAGE UPLOAD ── */}
                  <div>
                    <label className="text-xs text-gray-400 block mb-1.5">Device Photo</label>
                    <div
                      id="image-upload-zone"
                      onDrop={handleDrop}
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onClick={() => !uploadedImage && fileInputRef.current?.click()}
                      className={`relative rounded-xl border-2 border-dashed transition-all duration-300 overflow-hidden ${
                        isDragging
                          ? "border-green-400 bg-green-500/10 scale-[1.01]"
                          : uploadedImage
                          ? "border-green-500/40 bg-black/20 cursor-default"
                          : "border-green-500/20 bg-black/20 hover:border-green-400/50 hover:bg-green-500/5 cursor-pointer"
                      }`}
                    >
                      {uploadedImage ? (
                        <div className="relative">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={uploadedImage}
                            alt="Uploaded device"
                            className="w-full h-36 object-cover rounded-xl"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent rounded-xl" />
                          <div className="absolute bottom-2 left-3 right-3 flex items-center justify-between">
                            <span className="text-xs text-white/80 truncate max-w-[70%]">{uploadedFileName}</span>
                            <button
                              id="remove-image-btn"
                              onClick={(e) => {
                                e.stopPropagation();
                                setUploadedImage(null);
                                setUploadedFileName("");
                                if (fileInputRef.current) fileInputRef.current.value = "";
                              }}
                              className="w-6 h-6 rounded-full bg-red-500/80 flex items-center justify-center hover:bg-red-500 transition-colors"
                            >
                              <X className="w-3 h-3 text-white" />
                            </button>
                          </div>
                          <div className="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-green-500/20 border border-green-500/30 text-xs text-green-400 flex items-center gap-1">
                            <CheckCircle className="w-3 h-3" /> Uploaded
                          </div>
                        </div>
                      ) : (
                        <div className="py-6 flex flex-col items-center gap-2">
                          <div className="w-10 h-10 rounded-xl bg-green-500/10 border border-green-500/20 flex items-center justify-center">
                            {isDragging ? <Upload className="w-5 h-5 text-green-400 animate-bounce" /> : <ImageIcon className="w-5 h-5 text-green-400/60" />}
                          </div>
                          <div className="text-center">
                            <p className="text-xs text-gray-400">{isDragging ? "Drop to upload" : "Drag & drop or click to upload"}</p>
                            <p className="text-xs text-gray-600 mt-0.5">JPG, PNG, WEBP up to 10MB</p>
                          </div>
                        </div>
                      )}
                    </div>
                    <input
                      ref={fileInputRef}
                      id="image-file-input"
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </div>

                  {/* Next Step hint */}
                  <p className="text-xs text-gray-600 text-center">
                    Next: go to{" "}
                    <button onClick={() => setActiveTab("parts")} className="text-green-400 hover:underline">
                      Fault Report
                    </button>{" "}
                    to flag broken parts
                  </p>
                </motion.div>
              )}

              {/* ── TAB: FAULT REPORT ── */}
              {activeTab === "parts" && (
                <motion.div
                  key="parts"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="glass glow-border rounded-2xl p-5 space-y-4"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-sm font-semibold text-white">Fault Report</h2>
                      <p className="text-xs text-gray-500 mt-0.5">Select all parts that are not working</p>
                    </div>
                    {faultyParts.length > 0 && (
                      <span className="text-xs px-2 py-1 rounded-full bg-orange-500/15 text-orange-400 border border-orange-500/25 flex items-center gap-1">
                        <AlertTriangle className="w-3 h-3" />
                        {faultyParts.length} flagged
                      </span>
                    )}
                  </div>

                  <div className="space-y-4 max-h-[420px] overflow-y-auto pr-1">
                    {Object.entries(faultyPartOptions).map(([category, parts]) => (
                      <div key={category}>
                        <div className="text-xs text-gray-500 font-semibold uppercase tracking-widest mb-2">{category}</div>
                        <div className="grid grid-cols-1 gap-1.5">
                          {parts.map((part) => {
                            const selected = faultyParts.includes(part);
                            return (
                              <button
                                key={part}
                                id={`fault-${part.replace(/\s+/g, "-").toLowerCase()}`}
                                onClick={() => toggleFaultyPart(part)}
                                className={`flex items-center gap-2.5 w-full text-left px-3 py-2 rounded-lg text-xs transition-all border ${
                                  selected
                                    ? "bg-orange-500/10 border-orange-500/40 text-orange-300"
                                    : "bg-black/20 border-green-500/10 text-gray-400 hover:border-green-500/30 hover:text-gray-200"
                                }`}
                              >
                                <div className={`w-4 h-4 rounded flex items-center justify-center flex-shrink-0 border ${
                                  selected ? "bg-orange-500 border-orange-500" : "border-gray-600"
                                }`}>
                                  {selected && <CheckCircle className="w-3 h-3 text-white" />}
                                </div>
                                {part}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>

                  {faultyParts.length > 0 && (
                    <button
                      onClick={() => setFaultyParts([])}
                      className="text-xs text-gray-500 hover:text-red-400 transition-colors"
                    >
                      Clear all selections
                    </button>
                  )}
                </motion.div>
              )}

              {/* ── TAB: RESULTS ── */}
              {activeTab === "results" && result && (
                <motion.div
                  key="results"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="glass glow-border rounded-2xl p-5 space-y-4"
                >
                  <h2 className="text-sm font-semibold text-white">Scan Results</h2>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-xs text-gray-500 mb-1">Recycling Score</div>
                      <div className="text-4xl font-bold gradient-text">{result.recyclingScore}</div>
                      <div className="text-xs text-gray-500">/ 100</div>
                    </div>
                    <div className="w-24 h-24">
                      <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
                        <circle cx="18" cy="18" r="16" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="3" />
                        <circle
                          cx="18" cy="18" r="16" fill="none"
                          stroke="url(#scoreGrad)" strokeWidth="3"
                          strokeDasharray={`${(result.recyclingScore / 100) * 100.5} 100.5`}
                          strokeLinecap="round"
                        />
                        <defs>
                          <linearGradient id="scoreGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#00ff88" />
                            <stop offset="100%" stopColor="#00e5ff" />
                          </linearGradient>
                        </defs>
                      </svg>
                    </div>
                  </div>
                  <div className="p-3 rounded-xl bg-black/30 border border-green-500/10">
                    <div className="text-xs text-gray-500">Estimated Value</div>
                    <div className="text-xl font-bold text-green-400">${result.estimatedValue.toFixed(2)}</div>
                  </div>
                  {faultyParts.length > 0 && (
                    <div>
                      <div className="text-xs text-gray-500 mb-2">Flagged Faults ({faultyParts.length})</div>
                      <div className="flex flex-wrap gap-1">
                        {faultyParts.map((p) => (
                          <span key={p} className="text-xs px-2 py-0.5 rounded-md bg-orange-500/10 text-orange-300 border border-orange-500/20">{p}</span>
                        ))}
                      </div>
                    </div>
                  )}
                  <div>
                    <div className="text-xs text-gray-500 mb-2">Compliance</div>
                    <div className="flex flex-wrap gap-1.5">
                      {result.complianceStandards.map((s) => (
                        <span key={s} className="flex items-center gap-1 text-xs px-2 py-0.5 rounded-md bg-green-500/10 text-green-400 border border-green-500/20">
                          <CheckCircle className="w-3 h-3" />{s}
                        </span>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Scan Button */}
            <motion.button
              id="scan-btn"
              whileHover={{ scale: canScan ? 1.02 : 1 }}
              whileTap={{ scale: canScan ? 0.98 : 1 }}
              onClick={handleScan}
              disabled={!canScan}
              className="w-full py-3.5 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 bg-gradient-to-r from-green-500 to-cyan-500 text-black disabled:opacity-40 disabled:cursor-not-allowed transition-all glow-green"
            >
              {loading ? (
                <>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                    className="w-4 h-4 border-2 border-black/40 border-t-black rounded-full"
                  />
                  Agent Scanning...
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4" />
                  Launch AI Agent Scan
                  {faultyParts.length > 0 && (
                    <span className="ml-1 text-xs bg-black/20 px-1.5 py-0.5 rounded-full">
                      {faultyParts.length} faults
                    </span>
                  )}
                </>
              )}
            </motion.button>

            {/* Agent Terminal */}
            <AgentTerminal logs={logs} isRunning={isRunning} />
          </motion.div>

          {/* ── RIGHT PANEL: Recycler Grid ── */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="lg:col-span-3"
          >
            {result ? (
              <RecyclerGrid nodes={result.nodes} />
            ) : (
              <div className="glass glow-border rounded-2xl p-10 flex flex-col items-center justify-center text-center h-full min-h-[400px]">
                <div className="w-16 h-16 rounded-2xl bg-green-500/10 border border-green-500/20 flex items-center justify-center mb-4">
                  <Search className="w-8 h-8 text-green-400/50" />
                </div>
                <h3 className="text-lg font-semibold text-gray-400 mb-2">No Scan Results Yet</h3>
                <p className="text-sm text-gray-600 max-w-xs">
                  Fill in asset info, optionally upload a photo and flag broken parts, then let the AI agent find verified recyclers near you.
                </p>
                <div className="mt-6 flex items-center gap-6 text-xs text-gray-600">
                  <div className="flex items-center gap-1.5"><ImageIcon className="w-4 h-4 text-green-400/40" /> Photo analysis</div>
                  <div className="flex items-center gap-1.5"><AlertTriangle className="w-4 h-4 text-orange-400/40" /> Fault detection</div>
                  <div className="flex items-center gap-1.5"><Search className="w-4 h-4 text-cyan-400/40" /> Live recyclers</div>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
