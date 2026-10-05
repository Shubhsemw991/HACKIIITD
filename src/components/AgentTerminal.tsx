"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useRef, useState } from "react";

interface LogEntry {
  id: number;
  timestamp: string;
  message: string;
  type: "info" | "success" | "processing" | "warn";
}

interface AgentTerminalProps {
  logs: LogEntry[];
  isRunning: boolean;
  title?: string;
}

const typeColors = {
  info: "text-cyan-400",
  success: "text-green-400",
  processing: "text-yellow-400",
  warn: "text-orange-400",
};

const typePrefixes = {
  info: "[INFO]",
  success: "[✓ OK]",
  processing: "[PROC]",
  warn: "[WARN]",
};

export function AgentTerminal({ logs, isRunning, title = "TinyFish Autonomous Agent" }: AgentTerminalProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [logs]);

  return (
    <div className="terminal rounded-xl overflow-hidden">
      {/* Terminal Header */}
      <div className="flex items-center gap-2 px-4 py-3 bg-black/50 border-b border-green-500/20">
        <div className="flex gap-1.5">
          <div className="w-3 h-3 rounded-full bg-red-500/80" />
          <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
          <div className="w-3 h-3 rounded-full bg-green-500/80" />
        </div>
        <span className="ml-2 text-xs text-green-400/70 font-mono flex-1">{title}</span>
        {isRunning && (
          <span className="flex items-center gap-1.5 text-xs text-green-400 font-mono">
            <span className="w-2 h-2 rounded-full bg-green-400 pulse-ring inline-block" />
            LIVE
          </span>
        )}
      </div>

      {/* Terminal Body */}
      <div className="relative p-4 min-h-[260px] max-h-[380px] overflow-y-auto font-mono text-xs space-y-1.5">
        {isRunning && <div className="scanline" />}

        <AnimatePresence initial={false}>
          {logs.map((log) => (
            <motion.div
              key={log.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.25 }}
              className="flex gap-2 leading-relaxed"
            >
              <span className="text-gray-600 shrink-0">{log.timestamp}</span>
              <span className={`${typeColors[log.type]} shrink-0 font-bold`}>{typePrefixes[log.type]}</span>
              <span className="text-gray-300">{log.message}</span>
            </motion.div>
          ))}
        </AnimatePresence>

        {isRunning && (
          <div className="flex gap-2 mt-2">
            <span className="text-green-400">{">"}</span>
            <span className="text-green-400 blink">█</span>
          </div>
        )}

        <div ref={bottomRef} />
      </div>
    </div>
  );
}

export function useAgentLogs() {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const counterRef = useRef(0);

  const addLog = (message: string, type: LogEntry["type"] = "info") => {
    const now = new Date();
    const timestamp = `${now.getHours().toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}:${now.getSeconds().toString().padStart(2, "0")}`;
    setLogs((prev) => [...prev, { id: counterRef.current++, timestamp, message, type }]);
  };

  const clearLogs = () => {
    setLogs([]);
    counterRef.current = 0;
  };

  return { logs, isRunning, setIsRunning, addLog, clearLogs };
}
