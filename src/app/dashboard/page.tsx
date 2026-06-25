"use client";
import { motion } from "framer-motion";
import { FloatingNav } from "@/components/aceternity/floating-nav";
import { AuroraBackground } from "@/components/aceternity/aurora-background";
import { GlowingCard } from "@/components/aceternity/glowing-card";
import { RadialGauge } from "@/components/aceternity/radial-gauge";
import { StatBlock } from "@/components/aceternity/animated-counter";
import { SolarFlareIndicator, PulseRing } from "@/components/aceternity/solar-effects";
import { getFlareClass, STACKING_RESULTS, EXPERT_RESULTS, SCIENTIFIC_EVAL } from "@/lib/data";
import { Activity, BarChart3, Settings, Sun, Zap, Target, Cpu, TrendingUp, Shield, AlertTriangle, Database, Layers } from "lucide-react";
import Link from "next/link";

const NAV = [
  { label: "Home", href: "/" },
  { label: "Dashboard", href: "/dashboard", active: true },
  { label: "Pipeline", href: "/dashboard/pipeline" },
  { label: "Monitor", href: "/dashboard/monitor" },
  { label: "Performance", href: "/dashboard/performance" },
  { label: "Configs", href: "/dashboard/configs" },
];

export default function DashboardPage() {
  const sr = STACKING_RESULTS;
  const m = sr.metrics;
  const flux = 2.34e-7;
  const cls = getFlareClass(flux);

  return (
    <main className="min-h-screen">
      <FloatingNav items={NAV} />
      <AuroraBackground className="pt-28 pb-16 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-1">PRADHAN Dashboard</h1>
            <p className="text-white/40 text-sm">GOES-only with time-based splits: TSS = {SCIENTIFIC_EVAL.goeOnly.walk_forward.tss.toFixed(3)} (honest). 4-expert stacked: TSS = 0.933 (random CV — biased)</p>
            <div className="mt-3 p-3 rounded-lg bg-red-500/5 border border-red-500/20">
              <p className="text-xs text-red-400/80">
                ⚠️ Scientific warning: The 4-expert stacked model metrics below use random CV on 190 samples without timestamps — this is NOT scientifically validated.
                GOES-only with proper time-based splits gives TSS = -0.091. The true 4-expert TSS with temporal validation is unknown.
              </p>
            </div>
          </motion.div>

          {/* Live Status */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <GlowingCard className="p-6 mb-6" glowColor="#06b6d4">
              <div className="flex items-center justify-between flex-wrap gap-6">
                <SolarFlareIndicator classType={cls} flux={flux} />
                <div className="flex items-center gap-8">
                  <div>
                    <div className="text-[9px] text-white/25 uppercase tracking-wider">XRS-B</div>
                    <div className="text-lg font-bold font-mono text-neon-cyan">{flux.toExponential(2)} W/m²</div>
                  </div>
                  <div>
                    <div className="text-[9px] text-white/25 uppercase tracking-wider">XRS-A</div>
                    <div className="text-lg font-bold font-mono text-white/70">8.12e-8 W/m²</div>
                  </div>
                  <div>
                    <div className="text-[9px] text-white/25 uppercase tracking-wider">Ratio</div>
                    <div className="text-lg font-bold font-mono text-neon-violet">2.88</div>
                  </div>
                </div>
              </div>
            </GlowingCard>
          </motion.div>

          {/* Model Gauges */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
            <GlowingCard className="p-6 mb-6" glowColor="#30d158">
              <div className="flex items-center gap-2 mb-4">
                <Layers className="w-4 h-4 text-cyan-400" />
                <div className="text-[10px] text-white/30 uppercase tracking-[0.15em] font-medium">Honest GOES-Only Evaluation (Time-Based Splits)</div>
              </div>
              <div className="flex items-center justify-center gap-6 flex-wrap">
                <RadialGauge value={SCIENTIFIC_EVAL.goeOnly.walk_forward.tss} label="Walk-Forward TSS" color="#ff2d55" glowColor="#ff4d6d" size={120} />
                <RadialGauge value={SCIENTIFIC_EVAL.goeOnly.cv_5fold_biased.tss} label="CV TSS (biased)" color="#ff9f0a" glowColor="#fbbf24" size={120} />
                <RadialGauge value={SCIENTIFIC_EVAL.goeOnly.walk_forward.auc} label="Walk-Forward AUC" color="#30d158" glowColor="#4ade80" size={120} />
                <RadialGauge value={SCIENTIFIC_EVAL.goeOnly.walk_forward.pod} label="Walk-Forward POD" color="#8b5cf6" glowColor="#a78bfa" size={120} />
              </div>
              <div className="text-center mt-3 text-xs text-white/30">
                GOES-only model: {SCIENTIFIC_EVAL.goeOnly.walk_forward.n_splits} walk-forward splits, default XGBoost, threshold=0.5
              </div>
            </GlowingCard>
          </motion.div>

          {/* Quick Links */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-6">
            <Link href="/dashboard/monitor">
              <GlowingCard className="p-6 group cursor-pointer h-full glow-cyan" glowColor="#06b6d4">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-neon-cyan/10 mb-4 group-hover:scale-110 transition-transform">
                  <Activity className="w-5 h-5 text-neon-cyan" />
                </div>
                <h3 className="text-base font-semibold text-white mb-1.5">Live Monitor</h3>
                <p className="text-sm text-white/35">Real-time X-ray flux, multi-instrument light curves, threshold dial</p>
              </GlowingCard>
            </Link>
            <Link href="/dashboard/performance">
              <GlowingCard className="p-6 group cursor-pointer h-full glow-green" glowColor="#30d158">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-neon-green/10 mb-4 group-hover:scale-110 transition-transform">
                  <BarChart3 className="w-5 h-5 text-neon-green" />
                </div>
                <h3 className="text-base font-semibold text-white mb-1.5">Model Performance</h3>
                <p className="text-sm text-white/35">Expert comparison, SHAP analysis, stacking progression</p>
              </GlowingCard>
            </Link>
            <Link href="/dashboard/configs">
              <GlowingCard className="p-6 group cursor-pointer h-full glow-amber" glowColor="#ff9f0a">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-neon-amber/10 mb-4 group-hover:scale-110 transition-transform">
                  <Settings className="w-5 h-5 text-neon-amber" />
                </div>
                <h3 className="text-base font-semibold text-white mb-1.5">Expert Comparison</h3>
                <p className="text-sm text-white/35">4 experts, stacking progression, meta-learner weights</p>
              </GlowingCard>
            </Link>
          </motion.div>

          {/* Expert Overview */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
            <GlowingCard className="p-6" glowColor="#8b5cf6">
              <div className="text-[10px] text-white/30 uppercase tracking-[0.15em] mb-4 font-medium">Expert Overview</div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {EXPERT_RESULTS.map((e) => {
                  const colorMap: Record<string, string> = {
                    "SHARP (HMI/SDO)": "#ef4444",
                    "GOES-18 (XRS)": "#3b82f6",
                    "SOLEXS (Aditya-L1)": "#22c55e",
                    "HEL1OS (Aditya-L1)": "#a855f7",
                  };
                  const color = colorMap[e.label] || "#3b82f6";
                  return (
                    <div key={e.label} className="p-3 rounded-lg bg-white/[0.02] border border-white/[0.04]">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: color }} />
                        <span className="text-xs font-medium" style={{ color }}>{e.label.split(" ")[0]}</span>
                      </div>
                      <div className="text-lg font-bold font-mono text-white">{e.metrics.tss.toFixed(3)}</div>
                      <div className="text-[9px] text-white/30 uppercase">TSS | {e.features} features</div>
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
