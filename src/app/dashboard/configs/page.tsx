"use client";
import { motion } from "framer-motion";
import { FloatingNav } from "@/components/aceternity/floating-nav";
import { AuroraBackground } from "@/components/aceternity/aurora-background";
import { GlowingCard } from "@/components/aceternity/glowing-card";
import { EXPERT_RESULTS, STACKING_RESULTS, SCIENTIFIC_EVAL } from "@/lib/data";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  ScatterChart, Scatter, ZAxis, Cell
} from "recharts";
import { Trophy, Clock, Database, ChevronDown, ChevronUp, Sun, Telescope, Satellite, Zap, Layers } from "lucide-react";
import { useState } from "react";

const NAV = [
  { label: "Home", href: "/" },
  { label: "Dashboard", href: "/dashboard" },{ label: "Pipeline", href: "/dashboard/pipeline" },
  { label: "Monitor", href: "/dashboard/monitor" },
  { label: "Performance", href: "/dashboard/performance" },
  { label: "Configs", href: "/dashboard/configs", active: true },
];

const EXPERT_COLORS: Record<string, string> = {
  "SHARP (HMI/SDO)": "#ef4444",
  "GOES-18 (XRS)": "#3b82f6",
  "SOLEXS (Aditya-L1)": "#22c55e",
  "HEL1OS (Aditya-L1)": "#a855f7",
};

const EXPERT_ICONS: Record<string, any> = {
  "SHARP (HMI/SDO)": Zap,
  "GOES-18 (XRS)": Sun,
  "SOLEXS (Aditya-L1)": Satellite,
  "HEL1OS (Aditya-L1)": Telescope,
};

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
  const sorted = [...EXPERT_RESULTS].sort((a, b) => b.metrics.tss - a.metrics.tss);
  const [expanded, setExpanded] = useState<string | null>(sorted[0].label);
  const sr = STACKING_RESULTS;

  const scatterData = sorted.map((r) => ({
    name: r.label.split(" ")[0],
    tss: r.metrics.tss,
    pod: r.metrics.pod,
    features: r.features,
  }));

  return (
    <main className="min-h-screen">
      <FloatingNav items={NAV} />
      <AuroraBackground className="pt-28 pb-16 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-1">Expert Comparison</h1>
            <p className="text-white/40 text-sm">GOES-only with time-based splits: TSS = {SCIENTIFIC_EVAL.goeOnly.walk_forward.tss.toFixed(3)} (honest). 4-expert stacked: TSS = 0.933 (random CV — biased by temporal leakage)</p>
            <div className="mt-3 p-3 rounded-lg bg-red-500/5 border border-red-500/20">
              <p className="text-xs text-red-400/80">
                ⚠️ Scientific warning: The 4-expert stacked model (TSS=0.933) uses random CV on 190 samples without timestamps — this is NOT scientifically validated.
                GOES-only with proper time-based splits gives TSS = -0.091. The true 4-expert TSS with temporal validation is unknown.
              </p>
            </div>
          </motion.div>

          {/* Expert Config Cards */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="space-y-3 mb-8">
            {sorted.map((r, i) => {
              const isOpen = expanded === r.label;
              const m = r.metrics;
              const color = EXPERT_COLORS[r.label] || "#3b82f6";
              const Icon = EXPERT_ICONS[r.label] || Sun;
              return (
                <GlowingCard key={r.label} className={`overflow-hidden transition-all ${i === 0 ? "" : ""}`}
                  glowColor={color}>
                  <button onClick={() => setExpanded(isOpen ? null : r.label)}
                    className="w-full p-5 flex items-center gap-4 text-left hover:bg-white/[0.02] transition-colors">
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${color}15` }}>
                      <Icon className="w-5 h-5" style={{ color }} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <span className="text-base font-semibold text-white">{r.label}</span>
                        {i === 0 && (
                          <span className="text-[9px] px-2 py-0.5 rounded-full bg-green-500/10 text-green-400 border border-green-500/20 font-medium uppercase tracking-wider">
                            BEST SINGLE EXPERT
                          </span>
                        )}
                        <span className="text-[10px] text-white/30">{r.features} features</span>
                      </div>
                      <p className="text-xs text-white/40 mt-0.5">{r.description}</p>
                    </div>
                    <div className="ml-auto flex items-center gap-6">
                      <div className="text-right">
                        <div className="text-lg font-bold font-mono" style={{ color }}>{m.tss.toFixed(3)}</div>
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
                          { l: "F1", v: m.f1, c: "#ec4899" }, { l: "MCC", v: m.mcc, c: "#06b6d4" },
                          { l: "Accuracy", v: m.accuracy, c: "#30d158" }, { l: "Bal. Acc.", v: m.balanced_accuracy, c: "#3b82f6" },
                          { l: "Specificity", v: m.specificity, c: "#8b5cf6" }, { l: "NPV", v: m.npv, c: "#ec4899" },
                        ].map((s) => (
                          <div key={s.l} className="p-2.5 rounded-lg bg-white/[0.02] border border-white/[0.04] text-center">
                            <div className="text-sm font-bold font-mono" style={{ color: s.c }}>{s.v.toFixed(4)}</div>
                            <div className="text-[9px] text-white/25 uppercase tracking-wider mt-0.5">{s.l}</div>
                          </div>
                        ))}
                      </div>
                      <div className="text-xs text-white/30 mb-3 font-medium uppercase tracking-wider">Top SHAP Features</div>
                      <div className="space-y-1.5">
                        {r.feature_importance.slice(0, 5).map((f) => {
                          const maxImp = r.feature_importance[0].importance;
                          const pct = (f.importance / maxImp) * 100;
                          return (
                            <div key={f.feature} className="flex items-center gap-3">
                              <span className="text-white/50 text-xs w-40 text-right truncate font-mono">{f.feature}</span>
                              <div className="flex-1 h-4 bg-white/5 rounded-full overflow-hidden">
                                <div className="h-full rounded-full" style={{ width: `${pct}%`, backgroundColor: color }} />
                              </div>
                              <span className="text-white/60 text-xs w-14 font-mono">{f.importance.toFixed(4)}</span>
                            </div>
                          );
                        })}
                      </div>
                    </motion.div>
                  )}
                </GlowingCard>
              );
            })}
          </motion.div>

          {/* Stacking Comparison */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
            className="mb-8">
            <GlowingCard className="p-6" glowColor="#06b6d4">
              <div className="flex items-center gap-3 mb-4">
                <Layers className="w-5 h-5 text-cyan-400" />
                <h2 className="text-xl font-bold text-white">Stacking Progression</h2>
                <span className="text-xs text-white/40 ml-2">How adding experts improves prediction</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-white/10">
                      <th className="text-left text-white/60 py-3 px-2">Configuration</th>
                      <th className="text-center text-white/60 py-3 px-2">TSS</th>
                      <th className="text-center text-white/60 py-3 px-2">AUC</th>
                      <th className="text-center text-white/60 py-3 px-2">POD</th>
                      <th className="text-center text-white/60 py-3 px-2">F1</th>
                      <th className="text-center text-white/60 py-3 px-2">Improvement</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sr.stacking_comparison.map((s, i) => {
                      const prev = i > 0 ? sr.stacking_comparison[i - 1].tss : 0;
                      const improvement = i > 0 ? ((s.tss - prev) / prev * 100).toFixed(1) : "baseline";
                      const is4 = i === 2;
                      return (
                        <tr key={s.name} className={`border-b border-white/5 hover:bg-white/[0.02] ${is4 ? "bg-cyan-500/5 border-t-2 border-cyan-500/30" : ""}`}>
                          <td className={`py-3 px-2 font-medium ${is4 ? "text-cyan-400" : "text-white"}`}>{s.name}</td>
                          <td className={`text-center py-3 px-2 font-mono ${is4 ? "font-bold text-cyan-400" : "text-white/80"}`}>{s.tss.toFixed(4)}</td>
                          <td className="text-center py-3 px-2 font-mono text-white/80">{s.auc.toFixed(4)}</td>
                          <td className="text-center py-3 px-2 font-mono text-white/80">{s.pod.toFixed(4)}</td>
                          <td className="text-center py-3 px-2 font-mono text-white/80">{s.f1.toFixed(4)}</td>
                          <td className="text-center py-3 px-2 font-mono">
                            {typeof improvement === "string" ? (
                              <span className="text-white/30 text-xs">{improvement}</span>
                            ) : (
                              <span className="text-green-400 text-xs">+{improvement}%</span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </GlowingCard>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* TSS Bar */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
              <GlowingCard className="p-6 h-full" glowColor="#06b6d4">
                <div className="text-[10px] text-white/30 uppercase tracking-[0.15em] mb-4 font-medium">TSS by Expert (5x10 CV)</div>
                <ResponsiveContainer width="100%" height={320}>
                  <BarChart data={sorted.map((r) => ({
                    name: r.label.split(" ")[0],
                    tss: r.metrics.tss,
                  }))} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" />
                    <XAxis type="number" domain={[0, 1]} stroke="rgba(255,255,255,0.1)" tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 10 }} />
                    <YAxis type="category" dataKey="name" width={80} stroke="rgba(255,255,255,0.1)" tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 11 }} />
                    <Tooltip content={<TooltipBox />} />
                    <Bar dataKey="tss" radius={[0, 6, 6, 0]}>
                      {sorted.map((r, i) => (
                        <Cell key={i} fill={EXPERT_COLORS[r.label] || "#3b82f6"} fillOpacity={i === 0 ? 1 : 0.5} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </GlowingCard>
            </motion.div>

            {/* Expert Weight Distribution */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
              <GlowingCard className="p-6 h-full" glowColor="#8b5cf6">
                <div className="text-[10px] text-white/30 uppercase tracking-[0.15em] mb-4 font-medium">Meta-Learner Weight Distribution</div>
                <div className="space-y-4">
                  {[
                    { name: "SHARP", weight: sr.meta_learner.weights.sharp, color: "#ef4444", coef: sr.meta_learner.sharp_coef },
                    { name: "GOES", weight: sr.meta_learner.weights.goes, color: "#3b82f6", coef: sr.meta_learner.goes_coef },
                    { name: "HEL1OS", weight: sr.meta_learner.weights.hel1os, color: "#a855f7", coef: sr.meta_learner.hel1os_coef },
                    { name: "SOLEXS", weight: sr.meta_learner.weights.solexs, color: "#22c55e", coef: sr.meta_learner.solexs_coef },
                  ].map((e) => (
                    <div key={e.name}>
                      <div className="flex items-center justify-between mb-1.5">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: e.color }} />
                          <span className="text-sm font-medium text-white">{e.name}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-xs text-white/40">coef: {e.coef.toFixed(2)}</span>
                          <span className="text-sm font-bold font-mono" style={{ color: e.color }}>{e.weight}%</span>
                        </div>
                      </div>
                      <div className="w-full h-3 bg-white/5 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${e.weight}%` }}
                          transition={{ duration: 1, delay: 0.3 }}
                          className="h-full rounded-full"
                          style={{ backgroundColor: e.color }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 p-3 rounded-lg bg-white/[0.02] border border-white/[0.04]">
                  <p className="text-xs text-white/40">
                    <span className="text-white/60 font-medium">Logistic Regression Intercept:</span>{" "}
                    <span className="font-mono text-white/60">{sr.meta_learner.intercept.toFixed(4)}</span>
                  </p>
                </div>
              </GlowingCard>
            </motion.div>
          </div>

          {/* Data Sources */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
            className="mt-6">
            <GlowingCard className="p-6" glowColor="#06b6d4">
              <div className="flex items-center gap-3 mb-4">
                <Database className="w-5 h-5 text-cyan-400" />
                <h2 className="text-xl font-bold text-white">Data Sources</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(sr.data_sources).map(([key, desc]) => {
                  const colorMap: Record<string, string> = { goes: "#3b82f6", hel1os: "#a855f7", sharp: "#ef4444", solexs: "#22c55e" };
                  const color = colorMap[key] || "#3b82f6";
                  return (
                    <div key={key} className="bg-white/5 rounded-lg p-4 border-l-4" style={{ borderLeftColor: color }}>
                      <h3 className="font-medium mb-1" style={{ color }}>{key.toUpperCase()}</h3>
                      <p className="text-white/60 text-sm">{desc}</p>
                    </div>
                  );
                })}
              </div>
            </GlowingCard>
          </motion.div>
        </div>
      </AuroraBackground>
    </main>
  );
}
