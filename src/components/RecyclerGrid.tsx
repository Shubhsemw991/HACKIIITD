"use client";

import { motion } from "framer-motion";
import { CheckCircle, AlertTriangle, MapPin, DollarSign, Recycle } from "lucide-react";

interface RecyclerNode {
  id: string;
  name: string;
  locationLat: number;
  locationLng: number;
  verifiedLicense: boolean;
  acceptedMaterials: string[];
  livePayoutRate: number;
}

interface RecyclerGridProps {
  nodes: RecyclerNode[];
}

const materialColors: Record<string, string> = {
  smartphones: "bg-cyan-500/20 text-cyan-300 border-cyan-500/30",
  laptops: "bg-green-500/20 text-green-300 border-green-500/30",
  pcb: "bg-purple-500/20 text-purple-300 border-purple-500/30",
  batteries: "bg-yellow-500/20 text-yellow-300 border-yellow-500/30",
  monitors: "bg-pink-500/20 text-pink-300 border-pink-500/30",
  default: "bg-gray-500/20 text-gray-300 border-gray-500/30",
};

function RecyclerCard({ node, index }: { node: RecyclerNode; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.12, duration: 0.5 }}
      className="glass glow-border rounded-2xl p-5 group hover:border-green-400/50 transition-all duration-300 cursor-pointer"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center border border-green-500/20">
            <Recycle className="w-5 h-5 text-green-400" />
          </div>
          <div>
            <h3 className="font-semibold text-sm text-white leading-tight group-hover:text-green-400 transition-colors">
              {node.name}
            </h3>
            <div className="flex items-center gap-1 mt-0.5">
              <MapPin className="w-3 h-3 text-gray-500" />
              <span className="text-xs text-gray-500">
                {node.locationLat.toFixed(4)}, {node.locationLng.toFixed(4)}
              </span>
            </div>
          </div>
        </div>
        {node.verifiedLicense ? (
          <div className="flex items-center gap-1 text-xs text-green-400 bg-green-400/10 border border-green-400/20 px-2 py-1 rounded-full">
            <CheckCircle className="w-3 h-3" />
            Verified
          </div>
        ) : (
          <div className="flex items-center gap-1 text-xs text-orange-400 bg-orange-400/10 border border-orange-400/20 px-2 py-1 rounded-full">
            <AlertTriangle className="w-3 h-3" />
            Unverified
          </div>
        )}
      </div>

      {/* Payout Rate */}
      <div className="flex items-center gap-2 mb-4 p-3 rounded-xl bg-black/30 border border-green-500/10">
        <DollarSign className="w-4 h-4 text-green-400" />
        <div>
          <div className="text-xs text-gray-500">Live Payout Rate</div>
          <div className="text-lg font-bold text-green-400">${node.livePayoutRate.toFixed(2)}<span className="text-xs text-gray-400 font-normal">/kg</span></div>
        </div>
        <div className="ml-auto">
          <div className="w-2 h-2 rounded-full bg-green-400 pulse-ring" />
        </div>
      </div>

      {/* Materials */}
      <div>
        <div className="text-xs text-gray-500 mb-2">Accepted Materials</div>
        <div className="flex flex-wrap gap-1.5">
          {node.acceptedMaterials.map((material) => (
            <span
              key={material}
              className={`text-xs px-2 py-0.5 rounded-md border ${materialColors[material] || materialColors.default}`}
            >
              {material}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

export default function RecyclerGrid({ nodes }: RecyclerGridProps) {
  if (nodes.length === 0) return null;

  return (
    <div>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex items-center justify-between mb-4"
      >
        <h3 className="text-lg font-semibold text-white">
          Found <span className="text-green-400">{nodes.length}</span> Verified Recyclers
        </h3>
        <span className="text-xs text-gray-500">Sorted by payout rate</span>
      </motion.div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {nodes.map((node, i) => (
          <RecyclerCard key={node.id} node={node} index={i} />
        ))}
      </div>
    </div>
  );
}
