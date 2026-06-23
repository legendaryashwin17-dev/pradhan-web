"use client";
import { motion } from "framer-motion";
import { FloatingNav } from "@/components/aceternity/floating-nav";
import { AuroraBackground } from "@/components/aceternity/aurora-background";
import { GlowingCard } from "@/components/aceternity/glowing-card";
import { RadialGauge } from "@/components/aceternity/radial-gauge";
import { StatBlock, HeatmapCell } from "@/components/aceternity/animated-counter";
import { BEST_MODEL, MODEL_RESULTS } from "@/lib/data";
import { Activity, Target, TrendingUp, Shield, AlertTriangle, CheckCircle2 } from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar,
  ScatterChart, Scatter, ZAxis, AreaChart, Area, Cell, PieChart, Pie
} from "recharts";

const NAV = [
  { label: "Home", href: "/" },
  { label: "Dashboard", href: "/dashboard" },
  { label: "Monitor", href: "/dashboard/monitor" },
  { label: "Performance", href: "/dashboard/performance", active: true },
  { label: "Configs", href: "/dashboard/configs" },
];

const TooltipBox = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-space-900/95 backdrop-blur-xl border border-white/10 rounded-xl px-4 py-3 shadow-2xl">
      <div className="text-xs text-white/40 mb-1.5 font-medium">{label}</div>
      {payload.map((p: any) => (
        <div key={p.name} className="flex items-center gap-2 text-sm">
          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: p.color }} />
          <span className="text-white/60">{p.name}:</span>
          <span className="font-mono font-bold" style={{ color: p.color }}>
            {typeof p.value === "number" ? p.value.toFixed(4) : p.value}
          </span>
        </div>
      ))}
    </div>
  );
};

export default function PerformancePage() {
  const m = BEST_MODEL.metrics;
  const fi = BEST_MODEL.feature_importance;

  const tssData = [...MODEL_RESULTS]
    .sort((a, b) => b.metrics.tss - a.metrics.tss)
    .map((r) => ({ name: r.label, tss: r.metrics.tss }));

  const radarKeys = ["tss", "hss", "auc", "pod", "csi", "precision"];
  const radarData = radarKeys.map((key) => {
    const entry: any = { metric: key.toUpperCase() };
    MODEL_RESULTS.slice(0, 4).forEach((r) => {
      entry[r.label] = r.metrics[key as keyof typeof r.metrics];
    });
    return entry;
  });

  const rocData = MODEL_RESULTS.map((r) => ({
    name: r.label, pofd: r.metrics.pofd, pod: r.metrics.pod, tss: r.metrics.tss,
  }));

  // Confusion matrix heatmap
  const confCells = [
    { x: "Pred Flare", y: "Actual Flare", value: m.tp / 10, color: "rgba(6,182,212,0.4)" },
    { x: "Pred Quiet", y: "Actual Flare", value: m.fn / 10, color: "rgba(255,45,85,0.3)" },
    { x: "Pred Flare", y: "Actual Quiet", value: m.fp / 10, color: "rgba(255,159,10,0.3)" },
    { x: "Pred Quiet", y: "Actual Quiet", value: m.tn / 10, color: "rgba(48,209,88,0.3)" },
  ];

  // Feature category breakdown
  const categories = fi.reduce((acc, f) => {
    acc[f.category] = (acc[f.category] || 0) + f.importance;
    return acc;
  }, {} as Record<string, number>);
  const catData = Object.entries(categories).map(([name, value]) => ({ name, value }));
  const CAT_COLORS = ["#06b6d4", "#30d158", "#ff9f0a", "#8b5cf6", "#ec4899", "#3b82f6", "#ff2d55"];

  // Threshold comparison
  const thresholdData = [
    { name: "C-class", tss: 0.7931, pod: 0.854, f1: 0.842, color: "#30d158" },
    { name: "M-class", tss: 0.6823, pod: 0.7845, f1: 0.753, color: "#ff9f0a" },
    { name: "X-class", tss: 0.5234, pod: 0.6543, f1: 0.633, color: "#ff2d55" },
  ];

  return (
    <main className="min-h-screen">
      <FloatingNav items={NAV} />
      <AuroraBackground className="pt-28 pb-16 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-1">Model Performance</h1>
            <p className="text-white/40 text-sm">Best model: 1h C-class XGBoost — 7.8M training samples</p>
          </motion.div>

          {/* Primary Gauges */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <GlowingCard className="p-8 mb-6" glowColor="#06b6d4">
              <div className="text-[10px] text-white/30 uppercase tracking-[0.15em] mb-6 font-medium">Primary Metrics</div>
              <div className="flex items-center justify-center gap-6 flex-wrap">
                <RadialGauge value={m.tss} label="TSS" color="#06b6d4" glowColor="#22d3ee" size={150} />
                <RadialGauge value={m.auc} label="AUC-ROC" color="#30d158" glowColor="#4ade80" size={150} />
                <RadialGauge value={m.pod} label="POD (Sensitivity)" color="#ff9f0a" glowColor="#fbbf24" size={150} />
                <RadialGauge value={m.hss} label="HSS" color="#8b5cf6" glowColor="#a78bfa" size={150} />
                <RadialGauge value={m.precision} label="Precision" color="#3b82f6" glowColor="#60a5fa" size={150} />
                <RadialGauge value={m.f1} label="F1 Score" color="#ec4899" glowColor="#f472b6" size={150} />
              </div>
            </GlowingCard>
          </motion.div>

          {/* Secondary Metrics Strip */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3 mb-6">
              <StatBlock label="MCC" value={m.mcc} decimals={4} color="#06b6d4" icon={<Activity className="w-3 h-3" />} />
              <StatBlock label="Accuracy" value={m.accuracy} decimals={4} color="#30d158" icon={<CheckCircle2 className="w-3 h-3" />} />
              <StatBlock label="Bal. Accuracy" value={m.balanced_accuracy} decimals={4} color="#3b82f6" icon={<Target className="w-3 h-3" />} />
              <StatBlock label="Specificity" value={m.specificity} decimals={4} color="#8b5cf6" icon={<Shield className="w-3 h-3" />} />
              <StatBlock label="NPV" value={m.npv} decimals={4} color="#ec4899" icon={<TrendingUp className="w-3 h-3" />} />
              <StatBlock label="FPR" value={m.fpr} decimals={4} color="#ff9f0a" icon={<AlertTriangle className="w-3 h-3" />} />
              <StatBlock label="FNR" value={m.fnr} decimals={4} color="#ff2d55" icon={<AlertTriangle className="w-3 h-3" />} />
              <StatBlock label="Brier" value={m.brier} decimals={4} color="#06b6d4" icon={<Target className="w-3 h-3" />} />
            </div>
          </motion.div>

          {/* Confusion Matrix + Pie */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
              <GlowingCard className="p-6 h-full" glowColor="#06b6d4">
                <div className="text-[10px] text-white/30 uppercase tracking-[0.15em] mb-4 font-medium">Confusion Matrix</div>
                <div className="grid grid-cols-2 gap-2 max-w-sm mx-auto">
                  {confCells.map((c) => (
                    <div key={c.x + c.y} className="rounded-xl p-4 text-center border border-white/[0.04] transition-all hover:scale-105 cursor-default"
                      style={{ background: c.color }}>
                      <div className="text-3xl font-black font-mono text-white">{Math.round(c.value * 10)}</div>
                      <div className="text-[9px] text-white/40 mt-1">{c.x} / {c.y}</div>
                    </div>
                  ))}
                </div>
                <div className="flex items-center justify-center gap-6 mt-4 text-xs text-white/30">
                  <span>TP: <span className="text-neon-cyan font-mono">{m.tp}</span></span>
                  <span>FN: <span className="text-neon-red font-mono">{m.fn}</span></span>
                  <span>FP: <span className="text-neon-amber font-mono">{m.fp}</span></span>
                  <span>TN: <span className="text-neon-green font-mono">{m.tn}</span></span>
                </div>
              </GlowingCard>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
              <GlowingCard className="p-6 h-full" glowColor="#8b5cf6">
                <div className="text-[10px] text-white/30 uppercase tracking-[0.15em] mb-4 font-medium">Feature Categories</div>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie data={catData} cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={3} dataKey="value">
                      {catData.map((_, i) => <Cell key={i} fill={CAT_COLORS[i % CAT_COLORS.length]} />)}
                    </Pie>
                    <TooltipBox />
                  </PieChart>
                </ResponsiveContainer>
                <div className="flex flex-wrap gap-3 justify-center mt-2">
                  {catData.map((c, i) => (
                    <div key={c.name} className="flex items-center gap-1.5 text-xs text-white/40">
                      <div className="w-2 h-2 rounded-full" style={{ background: CAT_COLORS[i % CAT_COLORS.length] }} />
                      {c.name} ({(c.value * 100).toFixed(1)}%)
                    </div>
                  ))}
                </div>
              </GlowingCard>
            </motion.div>
          </div>

          {/* Charts Row 1 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* TSS Bar */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
              <GlowingCard className="p-6 h-full" glowColor="#06b6d4">
                <div className="text-[10px] text-white/30 uppercase tracking-[0.15em] mb-4 font-medium">TSS Across Configurations</div>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={tssData} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" />
                    <XAxis type="number" domain={[0, 1]} stroke="rgba(255,255,255,0.1)" tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 10 }} />
                    <YAxis type="category" dataKey="name" width={130} stroke="rgba(255,255,255,0.1)" tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 11 }} />
                    <Tooltip content={<TooltipBox />} />
                    <Bar dataKey="tss" radius={[0, 6, 6, 0]}>
                      {tssData.map((_, i) => (
                        <Cell key={i} fill={i === 0 ? "#06b6d4" : "#06b6d450"} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </GlowingCard>
            </motion.div>

            {/* Radar */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}>
              <GlowingCard className="p-6 h-full" glowColor="#8b5cf6">
                <div className="text-[10px] text-white/30 uppercase tracking-[0.15em] mb-4 font-medium">Metrics Radar</div>
                <ResponsiveContainer width="100%" height={300}>
                  <RadarChart data={radarData}>
                    <PolarGrid stroke="rgba(255,255,255,0.05)" />
                    <PolarAngleAxis dataKey="metric" tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 11 }} />
                    <PolarRadiusAxis tick={{ fill: "rgba(255,255,255,0.2)", fontSize: 9 }} domain={[0, 1]} />
                    <Radar name="1h C" dataKey="1h C-class (Best)" stroke="#06b6d4" fill="#06b6d4" fillOpacity={0.2} strokeWidth={2} />
                    <Radar name="3h C" dataKey="3h C-class" stroke="#30d158" fill="#30d158" fillOpacity={0.1} strokeWidth={1.5} />
                    <Radar name="1h M" dataKey="1h M-class" stroke="#ff9f0a" fill="#ff9f0a" fillOpacity={0.1} strokeWidth={1.5} />
                    <Radar name="6h C" dataKey="6h C-class" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.1} strokeWidth={1.5} />
                  </RadarChart>
                </ResponsiveContainer>
              </GlowingCard>
            </motion.div>
          </div>

          {/* Charts Row 2 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* Feature Importance */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
              <GlowingCard className="p-6 h-full" glowColor="#30d158">
                <div className="text-[10px] text-white/30 uppercase tracking-[0.15em] mb-4 font-medium">Feature Importance (All 19)</div>
                <ResponsiveContainer width="100%" height={420}>
                  <BarChart data={fi} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" />
                    <XAxis type="number" stroke="rgba(255,255,255,0.1)" tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 10 }} />
                    <YAxis type="category" dataKey="feature" width={120} stroke="rgba(255,255,255,0.1)" tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 10 }} />
                    <Tooltip content={<TooltipBox />} />
                    <Bar dataKey="importance" radius={[0, 4, 4, 0]}>
                      {fi.map((f, i) => {
                        const catIdx = ["flux", "rolling", "ratio", "delta", "smoothed", "correlation"].indexOf(f.category);
                        return <Cell key={i} fill={CAT_COLORS[catIdx >= 0 ? catIdx : 0]} />;
                      })}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </GlowingCard>
            </motion.div>

            {/* ROC Space + Threshold Compare */}
            <div className="flex flex-col gap-6">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }}>
                <GlowingCard className="p-6" glowColor="#3b82f6">
                  <div className="text-[10px] text-white/30 uppercase tracking-[0.15em] mb-4 font-medium">ROC Space</div>
                  <ResponsiveContainer width="100%" height={220}>
                    <ScatterChart>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" />
                      <XAxis type="number" dataKey="pofd" stroke="rgba(255,255,255,0.1)" tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 10 }}
                        label={{ value: "POFD", position: "bottom", fill: "rgba(255,255,255,0.3)", fontSize: 10 }} />
                      <YAxis type="number" dataKey="pod" stroke="rgba(255,255,255,0.1)" tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 10 }}
                        label={{ value: "POD", angle: -90, position: "left", fill: "rgba(255,255,255,0.3)", fontSize: 10 }} />
                      <ZAxis type="number" dataKey="tss" range={[80, 300]} />
                      <Tooltip content={<TooltipBox />} />
                      <Scatter data={rocData} fill="#06b6d4" />
                    </ScatterChart>
                  </ResponsiveContainer>
                </GlowingCard>
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
                <GlowingCard className="p-6" glowColor="#ff9f0a">
                  <div className="text-[10px] text-white/30 uppercase tracking-[0.15em] mb-4 font-medium">Threshold Comparison</div>
                  <div className="space-y-3">
                    {thresholdData.map((t) => (
                      <div key={t.name} className="flex items-center gap-4 p-3 rounded-xl bg-white/[0.02] border border-white/[0.04] hover:border-white/[0.1] transition-all">
                        <div className="w-3 h-3 rounded-full" style={{ background: t.color, boxShadow: `0 0 12px ${t.color}60` }} />
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-sm font-medium text-white">{t.name}</span>
                            <span className="text-xs font-mono" style={{ color: t.color }}>{t.tss.toFixed(3)} TSS</span>
                          </div>
                          <div className="w-full h-1.5 bg-white/[0.04] rounded-full overflow-hidden">
                            <div className="h-full rounded-full transition-all duration-1000" style={{ width: `${t.tss * 100}%`, background: `linear-gradient(90deg, ${t.color}, ${t.color}80)` }} />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </GlowingCard>
              </motion.div>
            </div>
          </div>

          {/* Model Info */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.55 }}>
            <GlowingCard className="p-6" glowColor="#8b5cf6">
              <div className="text-[10px] text-white/30 uppercase tracking-[0.15em] mb-4 font-medium">Model Details</div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { l: "Algorithm", v: "XGBoost" },
                  { l: "Training Samples", v: "7,803,585" },
                  { l: "Features", v: "19" },
                  { l: "Training Time", v: BEST_MODEL.training_time },
                  { l: "Horizon", v: "1 hour" },
                  { l: "Threshold", v: "C-class (1e-6 W/m²)" },
                  { l: "Split", v: "80/20 chronological" },
                  { l: "Test Event Rate", v: "46.64%" },
                ].map((d) => (
                  <div key={d.l} className="p-3 rounded-lg bg-white/[0.02] border border-white/[0.04]">
                    <div className="text-[9px] text-white/25 uppercase tracking-wider mb-1">{d.l}</div>
                    <div className="text-sm font-mono text-white/80">{d.v}</div>
                  </div>
                ))}
              </div>
            </GlowingCard>
          </motion.div>
        </div>
      </AuroraBackground>
    </main>
  );
}
