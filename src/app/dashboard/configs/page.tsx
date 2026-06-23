"use client";
import { motion } from "framer-motion";
import { FloatingNav } from "@/components/aceternity/floating-nav";
import { AuroraBackground } from "@/components/aceternity/aurora-background";
import { GlowingCard } from "@/components/aceternity/glowing-card";
import { RadialGauge } from "@/components/aceternity/radial-gauge";
import { MODEL_RESULTS } from "@/lib/data";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  ScatterChart, Scatter, ZAxis, Cell
} from "recharts";
import { Trophy, Clock, Database, ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";

const NAV = [
  { label: "Home", href: "/" },
  { label: "Dashboard", href: "/dashboard" },{ label: "Pipeline", href: "/dashboard/pipeline" },
  { label: "Monitor", href: "/dashboard/monitor" },
  { label: "Performance", href: "/dashboard/performance" },
  { label: "Configs", href: "/dashboard/configs", active: true },
];

const TooltipBox = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-space-900/95 backdrop-blur-xl border border-white/10 rounded-xl px-4 py-3 shadow-2xl">
      <div className="text-xs text-white/40 mb-1.5 font-medium">{label}</div>
      {payload.map((p: any) => (
        <div key={p.name} className="flex items-center gap-2 text-sm">
          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: p.color }} />
          <span className="font-mono font-bold" style={{ color: p.color }}>
            {typeof p.value === "number" ? p.value.toFixed(4) : p.value}
          </span>
        </div>
      ))}
    </div>
  );
};

export default function ConfigsPage() {
  const sorted = [...MODEL_RESULTS].sort((a, b) => b.metrics.tss - a.metrics.tss);
  const [expanded, setExpanded] = useState<string | null>(sorted[0].label);

  const scatterData = sorted.map((r) => ({
    name: r.label, event_rate: r.event_rate * 100, tss: r.metrics.tss, pod: r.metrics.pod,
  }));

  return (
    <main className="min-h-screen">
      <FloatingNav items={NAV} />
      <AuroraBackground className="pt-28 pb-16 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-1">Config Compare</h1>
            <p className="text-white/40 text-sm">Compare all 6 model configurations side-by-side</p>
          </motion.div>

          {/* Config Cards */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="space-y-3 mb-8">
            {sorted.map((r, i) => {
              const isOpen = expanded === r.label;
              const m = r.metrics;
              return (
                <GlowingCard key={r.label} className={`overflow-hidden transition-all ${i === 0 ? "glow-cyan" : ""}`}
                  glowColor={i === 0 ? "#06b6d4" : i < 3 ? "#30d158" : "#8b5cf6"}>
                  <button onClick={() => setExpanded(isOpen ? null : r.label)}
                    className="w-full p-5 flex items-center gap-4 text-left hover:bg-white/[0.02] transition-colors">
                    <div className="flex items-center gap-3">
                      {i === 0 && <Trophy className="w-5 h-5 text-neon-cyan" />}
                      <span className="text-base font-semibold text-white">{r.label}</span>
                      {i === 0 && (
                        <span className="text-[9px] px-2 py-0.5 rounded-full bg-neon-cyan/10 text-neon-cyan border border-neon-cyan/20 font-medium uppercase tracking-wider">
                          BEST
                        </span>
                      )}
                    </div>
                    <div className="ml-auto flex items-center gap-6">
                      <div className="text-right">
                        <div className="text-lg font-bold font-mono text-neon-cyan">{m.tss.toFixed(3)}</div>
                        <div className="text-[9px] text-white/25 uppercase">TSS</div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-mono text-white/50">{m.auc.toFixed(3)}</div>
                        <div className="text-[9px] text-white/25 uppercase">AUC</div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-mono text-white/50">{m.pod.toFixed(3)}</div>
                        <div className="text-[9px] text-white/25 uppercase">POD</div>
                      </div>
                      {isOpen ? <ChevronUp className="w-4 h-4 text-white/30" /> : <ChevronDown className="w-4 h-4 text-white/30" />}
                    </div>
                  </button>
                  {isOpen && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }}
                      transition={{ duration: 0.3 }}
                      className="border-t border-white/[0.04] p-5 bg-white/[0.01]">
                      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3 mb-4">
                        {[
                          { l: "TSS", v: m.tss, c: "#06b6d4" }, { l: "HSS", v: m.hss, c: "#30d158" },
                          { l: "AUC", v: m.auc, c: "#3b82f6" }, { l: "POD", v: m.pod, c: "#ff9f0a" },
                          { l: "POFD", v: m.pofd, c: "#ff2d55" }, { l: "Precision", v: m.precision, c: "#8b5cf6" },
                          { l: "Recall", v: m.recall, c: "#ec4899" }, { l: "F1", v: m.f1, c: "#06b6d4" },
                          { l: "MCC", v: m.mcc, c: "#30d158" }, { l: "CSI", v: m.csi, c: "#ff9f0a" },
                          { l: "Accuracy", v: m.accuracy, c: "#3b82f6" }, { l: "Brier", v: m.brier, c: "#ec4899" },
                        ].map((s) => (
                          <div key={s.l} className="p-2.5 rounded-lg bg-white/[0.02] border border-white/[0.04] text-center">
                            <div className="text-sm font-bold font-mono" style={{ color: s.c }}>{s.v.toFixed(4)}</div>
                            <div className="text-[9px] text-white/25 uppercase tracking-wider mt-0.5">{s.l}</div>
                          </div>
                        ))}
                      </div>
                      <div className="flex items-center gap-4 text-xs text-white/30">
                        <span className="flex items-center gap-1.5"><Database className="w-3 h-3" /> {r.samples.toLocaleString()} samples</span>
                        <span className="flex items-center gap-1.5"><Clock className="w-3 h-3" /> {r.training_time}</span>
                        <span>Event rate: <span className="text-white/50 font-mono">{(r.event_rate * 100).toFixed(1)}%</span></span>
                      </div>
                    </motion.div>
                  )}
                </GlowingCard>
              );
            })}
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Event Rate vs TSS */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
              <GlowingCard className="p-6 h-full" glowColor="#06b6d4">
                <div className="text-[10px] text-white/30 uppercase tracking-[0.15em] mb-4 font-medium">Event Rate vs TSS</div>
                <ResponsiveContainer width="100%" height={320}>
                  <ScatterChart>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" />
                    <XAxis type="number" dataKey="event_rate" name="Event Rate" stroke="rgba(255,255,255,0.1)"
                      tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 10 }}
                      label={{ value: "Event Rate (%)", position: "bottom", fill: "rgba(255,255,255,0.3)", fontSize: 10 }} />
                    <YAxis type="number" dataKey="tss" name="TSS" stroke="rgba(255,255,255,0.1)"
                      tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 10 }} domain={[0, 1]}
                      label={{ value: "TSS", angle: -90, position: "left", fill: "rgba(255,255,255,0.3)", fontSize: 10 }} />
                    <ZAxis type="number" dataKey="pod" range={[80, 300]} />
                    <Tooltip content={<TooltipBox />} />
                    <Scatter data={scatterData} fill="#06b6d4" />
                  </ScatterChart>
                </ResponsiveContainer>
              </GlowingCard>
            </motion.div>

            {/* TSS Bars */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
              <GlowingCard className="p-6 h-full" glowColor="#30d158">
                <div className="text-[10px] text-white/30 uppercase tracking-[0.15em] mb-4 font-medium">TSS Ranking</div>
                <ResponsiveContainer width="100%" height={320}>
                  <BarChart data={sorted.map((r) => ({ name: r.label, tss: r.metrics.tss }))} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" />
                    <XAxis type="number" domain={[0, 1]} stroke="rgba(255,255,255,0.1)" tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 10 }} />
                    <YAxis type="category" dataKey="name" width={130} stroke="rgba(255,255,255,0.1)" tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 11 }} />
                    <Tooltip content={<TooltipBox />} />
                    <Bar dataKey="tss" radius={[0, 6, 6, 0]}>
                      {sorted.map((_, i) => <Cell key={i} fill={i === 0 ? "#06b6d4" : i < 3 ? "#30d15860" : "#8b5cf640"} />)}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </GlowingCard>
            </motion.div>
          </div>
        </div>
      </AuroraBackground>
    </main>
  );
}
