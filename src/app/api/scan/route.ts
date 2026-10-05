import { NextRequest } from "next/server";
import { extractRecyclingData } from "@/lib/tinyfish";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { deviceType, specsDescription, location, quantity } = body;

    if (!deviceType || !location) {
      return Response.json({ error: "deviceType and location are required" }, { status: 400 });
    }

    const query = `${deviceType} — ${specsDescription || "general e-waste"} (quantity: ${quantity || 1})`;

    const result = await extractRecyclingData(query, location);

    // Compute a simple recycling score based on device type
    const scoreMap: Record<string, number> = {
      "Smartphone / Tablet": 82,
      "Laptop / Desktop": 76,
      "Monitor / Display": 65,
      "Circuit Board / PCB": 91,
      "Battery Pack": 58,
      "Printer / Scanner": 60,
      "Server Hardware": 88,
      "Mixed E-Waste": 70,
    };

    const recyclingScore = scoreMap[deviceType] ?? 72;
    const estimatedValue = result.data.nodes.reduce((sum, n) => sum + n.livePayoutRate * (parseInt(quantity) || 1), 0);

    return Response.json({
      recyclingScore,
      estimatedValue: parseFloat(estimatedValue.toFixed(2)),
      nodes: result.data.nodes,
      complianceStandards: result.data.complianceStandards,
      logs: result.data.logs,
    });
  } catch (err) {
    console.error("[EcoSync API] Scan error:", err);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
