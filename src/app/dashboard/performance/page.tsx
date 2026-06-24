"use client";
import { motion } from "framer-motion";
import { FloatingNav } from "@/components/aceternity/floating-nav";
import { AuroraBackground } from "@/components/aceternity/aurora-background";
import { GlowingCard } from "@/components/aceternity/glowing-card";
import { RadialGauge } from "@/components/aceternity/radial-gauge";
import { StatBlock } from "@/components/aceternity/animated-counter";
import { EXPERT_RESULTS, STACKING_RESULTS } from "@/lib/data";
import { Activity, Target, TrendingUp, Shield, AlertTriangle, CheckCircle2, Layers, Zap, Sun, Telescope, Satellite } from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar,
  ScatterChart, Scatter, ZAxis, Cell, PieChart, Pie
} from "recharts";

const NAV = [
  { label: "Home", href: "/" },
  { label: "Dashboard", href: "/dashboard" },{ label: "Pipeline", href: "/dashboard/pipeline" },
  { label: "Monitor", href: "/dashboard/monitor" },
  { label: "Performance", href: "/dashboard/performance", active: true },
  { label: "Configs", href: "/dashboard/configs" },
];

const EXPERT_COLORS: Record<string, string> = {
  "SHARP (HMI/SDO)": "#ef4444",
  "GOES-18 (XRS)": "#3b82f6",
  "SOLEXS (Aditya-L1)": "#22c55e",
  "HEL1OS (Aditya-L1)": "#a855f7",
};

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
  const sr = STACKING_RESULTS;
  const m = sr.metrics;
  const sorted = [...EXPERT_RESULTS].sort((a, b) => b.metrics.tss - a.metrics.tss);

  const tssData = sorted.map((r) => ({
    name: r.label.split(" ")[0],
    tss: r.metrics.tss,
    color: EXPERT_COLORS[r.label] || "#3b82f6",
  }));

  // Add stacked result
  tssData.push({ name: "Stacked 4", tss: m.tss, color: "#06b6d4" });

  const radarKeys = ["tss", "hss", "auc", "pod", "precision", "f1"];
  const radarData = radarKeys.map((key) => {
    const entry: any = { metric: key.toUpperCase() };
    sorted.forEach((r) => {
      entry[r.label.split(" ")[0]] = r.metrics[key as keyof typeof r.metrics];
    });
    entry["Stacked"] = m[key as keyof typeof m] as number;
    return entry;
  });

  // ROC space
  const rocData = sorted.map((r) => ({
    name: r.label.split(" ")[0],
    pofd: r.metrics.pofd,
    pod: r.metrics.pod,
    tss: r.metrics.tss,
    color: EXPERT_COLORS[r.label] || "#3b82f6",
  }));
  rocData.push({ name: "Stacked", pofd: m.pofd, pod: m.pod, tss: m.tss, color: "#06b6d4" });

  // Confusion matrix (stacked)
  const confCells = [
    { x: "Pred Flare", y: "Actual Flare", value: m.tp, color: "rgba(6,182,212,0.4)" },
    { x: "Pred Quiet", y: "Actual Flare", value: m.fn, color: "rgba(255,45,85,0.3)" },
    { x: "Pred Flare", y: "Actual Quiet", value: m.fp, color: "rgba(255,159,10,0.3)" },
    { x: "Pred Quiet", y: "Actual Quiet", value: m.tn, color: "rgba(48,209,88,0.3)" },
  ];

  // SHAP top features across all experts
  const allFeatures = sorted.flatMap((r) =>
    r.feature_importance.map((f) => ({ ...f, expert: r.label.split(" ")[0] }))
  );
  const top10 = allFeatures.sort((a, b) => b.importance - a.importance).slice(0, 10);

  return (
    <main className="min-h-screen">
      <FloatingNav items={NAV} />
      <AuroraBackground className="pt-28 pb-16 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-1">Model Performance</h1>
            <p className="text-white/40 text-sm">4-expert stacking: GOES-18 + HEL1OS + HMI/SHARP + SOLEXS — 5x10 stratified CV</p>
          </motion.div>

          {/* Primary Gauges */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <GlowingCard className="p-8 mb-6" glowColor="#06b6d4">
              <div className="flex items-center gap-2 mb-4">
                <Layers className="w-4 h-4 text-cyan-400" />
                <div className="text-[10px] text-white/30 uppercase tracking-[0.15em] font-medium">4-Expert Stacked Model</div>
              </div>
              <div className="flex items-center justify-center gap-6 flex-wrap">
                <RadialGauge value={m.tss} label="TSS" color="#06b6d4" glowColor="#22d3ee" size={150} />
                <RadialGauge value={m.auc} label="AUC-ROC" color="#30d158" glowColor="#4ade80" size={150} />
                <RadialGauge value={m.pod} label="POD" color="#ff9f0a" glowColor="#fbbf24" size={150} />
                <RadialGauge value={m.hss} label="HSS" color="#8b5cf6" glowColor="#a78bfa" size={150} />
                <RadialGauge value={m.precision} label="Precision" color="#3b82f6" glowColor="#60a5fa" size={150} />
                <RadialGauge value={m.f1} label="F1" color="#ec4899" glowColor="#f472b6" size={150} />
              </div>
              <div className="text-center mt-3 text-xs text-white/30">
                Bootstrap 95% CI — TSS: [{sr.bootstrap.tss_ci[0].toFixed(3)}, {sr.bootstrap.tss_ci[1].toFixed(3)}] | AUC: [{sr.bootstrap.auc_ci[0].toFixed(3)}, {sr.bootstrap.auc_ci[1].toFixed(3)}]
              </div>
            </GlowingCard>
          </motion.div>

          {/* Secondary Metrics */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3 mb-6">
              <StatBlock label="MCC" value={m.mcc} decimals={4} color="#06b6d4" icon={<Activity className="w-3 h-3" />} />
              <StatBlock label="Accuracy" value={m.accuracy} decimals={4} color="#30d158" icon={<CheckCircle2 className="w-3 h-3" />} />
              <StatBlock label="Bal. Acc." value={m.balanced_accuracy} decimals={4} color="#3b82f6" icon={<Target className="w-3 h-3" />} />
              <StatBlock label="Specificity" value={m.specificity} decimals={4} color="#8b5cf6" icon={<Shield className="w-3 h-3" />} />
              <StatBlock label="NPV" value={m.npv} decimals={4} color="#ec4899" icon={<TrendingUp className="w-3 h-3" />} />
              <StatBlock label="FPR" value={m.fpr} decimals={4} color="#ff9f0a" icon={<AlertTriangle className="w-3 h-3" />} />
              <StatBlock label="FNR" value={m.fnr} decimals={4} color="#ff2d55" icon={<AlertTriangle className="w-3 h-3" />} />
              <StatBlock label="Brier" value={m.brier} decimals={4} color="#06b6d4" icon={<Target className="w-3 h-3" />} />
            </div>
          </motion.div>

          {/* Confusion Matrix + Expert Weights */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
              <GlowingCard className="p-6 h-full" glowColor="#06b6d4">
                <div className="text-[10px] text-white/30 uppercase tracking-[0.15em] mb-4 font-medium">Confusion Matrix (Stacked 4-Expert)</div>
                <div className="grid grid-cols-2 gap-2 max-w-sm mx-auto">
                  {confCells.map((c) => (
                    <div key={c.x + c.y} className="rounded-xl p-4 text-center border border-white/[0.04] transition-all hover:scale-105 cursor-default"
                      style={{ background: c.color }}>
                      <div className="text-3xl font-black font-mono text-white">{c.value}</div>
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
                <div className="text-[10px] text-white/30 uppercase tracking-[0.15em] mb-4 font-medium">Meta-Learner Weights</div>
                <div className="space-y-3">
                  {[
                    { name: "SHARP", weight: sr.meta_learner.weights.sharp, color: "#ef4444", coef: sr.meta_learner.sharp_coef },
                    { name: "GOES", weight: sr.meta_learner.weights.goes, color: "#3b82f6", coef: sr.meta_learner.goes_coef },
                    { name: "HEL1OS", weight: sr.meta_learner.weights.hel1os, color: "#a855f7", coef: sr.meta_learner.hel1os_coef },
                    { name: "SOLEXS", weight: sr.meta_learner.weights.solexs, color: "#22c55e", coef: sr.meta_learner.solexs_coef },
                  ].map((e) => (
                    <div key={e.name} className="flex items-center gap-3 p-2 rounded-lg bg-white/[0.02] border border-white/[0.04]">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: e.color }} />
                      <span className="text-sm font-medium text-white w-16">{e.name}</span>
                      <div className="flex-1 h-3 bg-white/5 rounded-full overflow-hidden">
                        <div className="h-full rounded-full" style={{ width: `${e.weight}%`, backgroundColor: e.color }} />
                      </div>
                      <span className="text-xs font-mono text-white/50 w-20 text-right">coef: {e.coef.toFixed(2)}</span>
                      <span className="text-sm font-bold font-mono w-12 text-right" style={{ color: e.color }}>{e.weight}%</span>
                    </div>
                  ))}
                </div>
              </GlowingCard>
            </motion.div>
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* TSS Bar */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
              <GlowingCard className="p-6 h-full" glowColor="#06b6d4">
                <div className="text-[10px] text-white/30 uppercase tracking-[0.15em] mb-4 font-medium">TSS by Expert (5x10 CV)</div>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={tssData} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" />
                    <XAxis type="number" domain={[0, 1]} stroke="rgba(255,255,255,0.1)" tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 10 }} />
                    <YAxis type="category" dataKey="name" width={80} stroke="rgba(255,255,255,0.1)" tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 11 }} />
                    <Tooltip content={<TooltipBox />} />
                    <Bar dataKey="tss" radius={[0, 6, 6, 0]}>
                      {tssData.map((d, i) => (
                        <Cell key={i} fill={d.color} fillOpacity={i === tssData.length - 1 ? 1 : 0.6} />
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
                    <Radar name="SHARP" dataKey="SHARP" stroke="#ef4444" fill="#ef4444" fillOpacity={0.1} strokeWidth={1.5} />
                    <Radar name="GOES" dataKey="GOES" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.1} strokeWidth={1.5} />
                    <Radar name="SOLEXS" dataKey="SOLEXS" stroke="#22c55e" fill="#22c55e" fillOpacity={0.1} strokeWidth={1.5} />
                    <Radar name="HEL1OS" dataKey="HEL1OS" stroke="#a855f7" fill="#a855f7" fillOpacity={0.1} strokeWidth={1.5} />
                    <Radar name="Stacked" dataKey="Stacked" stroke="#06b6d4" fill="#06b6d4" fillOpacity={0.2} strokeWidth={2} />
                  </RadarChart>
                </ResponsiveContainer>
              </GlowingCard>
            </motion.div>
          </div>

          {/* Top SHAP Features */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
            className="mb-6">
            <GlowingCard className="p-6" glowColor="#30d158">
              <div className="flex items-center gap-3 mb-4">
                <Zap className="w-5 h-5 text-cyan-400" />
                <h2 className="text-xl font-bold text-white">Top 10 SHAP Features (Across All Experts)</h2>
              </div>
              <div className="space-y-2">
                {top10.map((f, i) => {
                  const maxImp = top10[0].importance;
                  const pct = (f.importance / maxImp) * 100;
                  const color = EXPERT_COLORS[`${f.expert}`] || "#3b82f6";
                  return (
                    <div key={f.feature} className="flex items-center gap-3">
                      <span className="text-white/30 text-xs w-4 text-right">{i + 1}.</span>
                      <span className="text-white/60 text-sm w-40 text-right truncate font-mono">{f.feature}</span>
                      <div className="flex-1 h-5 bg-white/5 rounded-full overflow-hidden">
                        <div className="h-full rounded-full" style={{ width: `${pct}%`, backgroundColor: color }} />
                      </div>
                      <span className="text-white/60 text-sm w-16 font-mono">{f.importance.toFixed(4)}</span>
                      <span className="text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: `${color}20`, color }}>{f.expert}</span>
                    </div>
                  );
                })}
              </div>
            </GlowingCard>
          </motion.div>

          {/* ROC Space */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }}>
            <GlowingCard className="p-6" glowColor="#3b82f6">
              <div className="text-[10px] text-white/30 uppercase tracking-[0.15em] mb-4 font-medium">ROC Space — All Experts + Stacked</div>
              <ResponsiveContainer width="100%" height={320}>
                <ScatterChart>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" />
                  <XAxis type="number" dataKey="pofd" stroke="rgba(255,255,255,0.1)" tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 10 }}
                    label={{ value: "False Positive Rate", position: "bottom", fill: "rgba(255,255,255,0.3)", fontSize: 10 }} />
                  <YAxis type="number" dataKey="pod" stroke="rgba(255,255,255,0.1)" tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 10 }}
                    label={{ value: "True Positive Rate", angle: -90, position: "left", fill: "rgba(255,255,255,0.3)", fontSize: 10 }} />
                  <ZAxis type="number" dataKey="tss" range={[80, 300]} />
                  <Tooltip content={<TooltipBox />} />
                  <Scatter data={rocData} fill="#06b6d4">
                    {rocData.map((d, i) => <Cell key={i} fill={d.color} />)}
                  </Scatter>
                </ScatterChart>
              </ResponsiveContainer>
            </GlowingCard>
          </motion.div>

          {/* Model Info */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
            <GlowingCard className="p-6 mt-6" glowColor="#8b5cf6">
              <div className="text-[10px] text-white/30 uppercase tracking-[0.15em] mb-4 font-medium">Methodology</div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { l: "Algorithm", v: "XGBoost + LR Meta-Learner" },
                  { l: "Total Features", v: "48 (8+22+7+11)" },
                  { l: "Samples", v: `${sr.samples} (${sr.flare_samples} flare / ${sr.quiet_samples} quiet)` },
                  { l: "Valid Samples", v: `${sr.valid_samples} (after NaN)` },
                  { l: "CV Method", v: sr.cv },
                  { l: "Bootstrap", v: "1000 resamples" },
                  { l: "Horizon", v: "6 hours" },
                  { l: "Threshold", v: "C-class (1e-6 W/m²)" },
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
