"use client";
import { motion } from "framer-motion";
import { FloatingNav } from "@/components/aceternity/floating-nav";
import { AuroraBackground } from "@/components/aceternity/aurora-background";
import { GlowingCard, MetricCard } from "@/components/aceternity/glowing-card";
import { MODEL_RESULTS } from "@/lib/data";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  ScatterChart, Scatter, ZAxis
} from "recharts";

const NAV_ITEMS = [
  { label: "Home", href: "/" },
  { label: "Dashboard", href: "/dashboard" },
  { label: "Monitor", href: "/dashboard/monitor" },
  { label: "Performance", href: "/dashboard/performance" },
  { label: "Configs", href: "/dashboard/configs", active: true },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-space-800/95 backdrop-blur-xl border border-white/10 rounded-lg px-4 py-3">
      <div className="text-xs text-white/40 mb-1">{label}</div>
      {payload.map((p: any) => (
        <div key={p.name} className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: p.color }} />
          <span className="text-sm font-mono text-white">{typeof p.value === "number" ? p.value.toFixed(4) : p.value}</span>
        </div>
      ))}
    </div>
  );
};

export default function ConfigsPage() {
  const sorted = [...MODEL_RESULTS].sort((a, b) => b.metrics.tss - a.metrics.tss);

  // Event rate vs TSS
  const scatterData = sorted.map((r) => ({
    name: r.label,
    event_rate: r.event_rate * 100,
    tss: r.metrics.tss,
    pod: r.metrics.pod,
  }));

  return (
    <main className="min-h-screen">
      <FloatingNav items={NAV_ITEMS} />

      <AuroraBackground className="pt-28 pb-16 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-3xl font-bold text-white mb-1">Config Compare</h1>
            <p className="text-white/40 text-sm">Compare all 6 model configurations</p>
          </motion.div>

          {/* Config Table */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <GlowingCard className="p-6 mb-8 overflow-x-auto" glowColor="#f59e0b">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/10">
                    {["Config", "TSS", "HSS", "AUC", "POD", "POFD", "CSI", "Brier", "Event Rate"].map((h) => (
                      <th key={h} className="text-left py-3 px-3 text-xs font-medium text-white/40 uppercase tracking-wider">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {sorted.map((r, i) => (
                    <tr
                      key={r.label}
                      className={`border-b border-white/5 hover:bg-white/5 transition-colors ${
                        i === 0 ? "bg-cyan-500/5" : ""
                      }`}
                    >
                      <td className="py-3 px-3 font-medium text-white">
                        {r.label}
                        {i === 0 && (
                          <span className="ml-2 text-[10px] px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-400">
                            BEST
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-3 font-mono text-cyan-400">{r.metrics.tss.toFixed(4)}</td>
                      <td className="py-3 px-3 font-mono text-white/70">{r.metrics.hss.toFixed(4)}</td>
                      <td className="py-3 px-3 font-mono text-white/70">{r.metrics.auc.toFixed(4)}</td>
                      <td className="py-3 px-3 font-mono text-emerald-400">{r.metrics.pod.toFixed(4)}</td>
                      <td className="py-3 px-3 font-mono text-amber-400">{r.metrics.pofd.toFixed(4)}</td>
                      <td className="py-3 px-3 font-mono text-white/70">{r.metrics.csi.toFixed(4)}</td>
                      <td className="py-3 px-3 font-mono text-white/70">{r.metrics.brier.toFixed(4)}</td>
                      <td className="py-3 px-3 font-mono text-white/50">{(r.event_rate * 100).toFixed(1)}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </GlowingCard>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Event Rate vs TSS */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <GlowingCard className="p-6 h-full" glowColor="#06b6d4">
                <h3 className="text-sm font-medium text-white/60 uppercase tracking-wider mb-4">
                  Event Rate vs TSS
                </h3>
                <ResponsiveContainer width="100%" height={320}>
                  <ScatterChart>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" />
                    <XAxis
                      type="number"
                      dataKey="event_rate"
                      name="Event Rate"
                      stroke="rgba(255,255,255,0.15)"
                      tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 10 }}
                      label={{ value: "Event Rate (%)", position: "bottom", fill: "rgba(255,255,255,0.3)", fontSize: 11 }}
                    />
                    <YAxis
                      type="number"
                      dataKey="tss"
                      name="TSS"
                      stroke="rgba(255,255,255,0.15)"
                      tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 10 }}
                      domain={[0, 1]}
                      label={{ value: "TSS", angle: -90, position: "left", fill: "rgba(255,255,255,0.3)", fontSize: 11 }}
                    />
                    <ZAxis type="number" dataKey="pod" range={[100, 400]} />
                    <Tooltip content={<CustomTooltip />} />
                    <Scatter data={scatterData} fill="#06b6d4" />
                  </ScatterChart>
                </ResponsiveContainer>
              </GlowingCard>
            </motion.div>

            {/* Config Cards */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
            >
              <GlowingCard className="p-6 h-full" glowColor="#8b5cf6">
                <h3 className="text-sm font-medium text-white/60 uppercase tracking-wider mb-4">
                  Configuration Details
                </h3>
                <div className="space-y-3">
                  {sorted.map((r, i) => (
                    <div
                      key={r.label}
                      className={`flex items-center justify-between p-3 rounded-lg border transition-colors ${
                        i === 0
                          ? "border-cyan-500/30 bg-cyan-500/5"
                          : "border-white/5 hover:border-white/10"
                      }`}
                    >
                      <div>
                        <div className="text-sm font-medium text-white">{r.label}</div>
                        <div className="text-xs text-white/30 mt-0.5">
                          {r.horizon} horizon • {r.threshold}-class threshold
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold font-mono text-cyan-400">
                          {r.metrics.tss.toFixed(3)}
                        </div>
                        <div className="text-[10px] text-white/30 uppercase">TSS</div>
                      </div>
                    </div>
                  ))}
                </div>
              </GlowingCard>
            </motion.div>
          </div>
        </div>
      </AuroraBackground>
    </main>
  );
}
