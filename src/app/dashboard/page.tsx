"use client";
import { motion } from "framer-motion";
import { FloatingNav } from "@/components/aceternity/floating-nav";
import { AuroraBackground } from "@/components/aceternity/aurora-background";
import { GlowingCard } from "@/components/aceternity/glowing-card";
import { RadialGauge } from "@/components/aceternity/radial-gauge";
import { StatBlock } from "@/components/aceternity/animated-counter";
import { SolarFlareIndicator, PulseRing } from "@/components/aceternity/solar-effects";
import { BEST_MODEL, getFlareClass } from "@/lib/data";
import { Activity, BarChart3, Settings, Sun, Zap, Target, Cpu, TrendingUp, Shield, AlertTriangle } from "lucide-react";
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
  const m = BEST_MODEL.metrics;
  const flux = 2.34e-7;
  const cls = getFlareClass(flux);

  return (
    <main className="min-h-screen">
      <FloatingNav items={NAV} />
      <AuroraBackground className="pt-28 pb-16 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-1">Dashboard</h1>
            <p className="text-white/40 text-sm">Solar flare monitoring and model performance overview</p>
          </motion.div>

          {/* Status */}
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

          {/* Gauges */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
            <GlowingCard className="p-6 mb-6" glowColor="#30d158">
              <div className="text-[10px] text-white/30 uppercase tracking-[0.15em] mb-4 font-medium">Model Metrics</div>
              <div className="flex items-center justify-center gap-6 flex-wrap">
                <RadialGauge value={m.tss} label="TSS" color="#06b6d4" glowColor="#22d3ee" size={120} />
                <RadialGauge value={m.auc} label="AUC" color="#30d158" glowColor="#4ade80" size={120} />
                <RadialGauge value={m.pod} label="POD" color="#ff9f0a" glowColor="#fbbf24" size={120} />
                <RadialGauge value={m.hss} label="HSS" color="#8b5cf6" glowColor="#a78bfa" size={120} />
                <RadialGauge value={m.precision} label="Prec." color="#3b82f6" glowColor="#60a5fa" size={120} />
                <RadialGauge value={m.f1} label="F1" color="#ec4899" glowColor="#f472b6" size={120} />
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
                <p className="text-sm text-white/35">Real-time X-ray flux and flare classification</p>
              </GlowingCard>
            </Link>
            <Link href="/dashboard/performance">
              <GlowingCard className="p-6 group cursor-pointer h-full glow-green" glowColor="#30d158">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-neon-green/10 mb-4 group-hover:scale-110 transition-transform">
                  <BarChart3 className="w-5 h-5 text-neon-green" />
                </div>
                <h3 className="text-base font-semibold text-white mb-1.5">Model Performance</h3>
                <p className="text-sm text-white/35">Metrics, ROC analysis, feature importance</p>
              </GlowingCard>
            </Link>
            <Link href="/dashboard/configs">
              <GlowingCard className="p-6 group cursor-pointer h-full glow-amber" glowColor="#ff9f0a">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-neon-amber/10 mb-4 group-hover:scale-110 transition-transform">
                  <Settings className="w-5 h-5 text-neon-amber" />
                </div>
                <h3 className="text-base font-semibold text-white mb-1.5">Config Compare</h3>
                <p className="text-sm text-white/35">Compare all 6 model configurations</p>
              </GlowingCard>
            </Link>
          </motion.div>

          {/* Expanded Stats */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
            <GlowingCard className="p-6" glowColor="#8b5cf6">
              <div className="text-[10px] text-white/30 uppercase tracking-[0.15em] mb-4 font-medium">All Metrics</div>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3">
                <StatBlock label="MCC" value={m.mcc} decimals={4} color="#06b6d4" icon={<Activity className="w-3 h-3" />} />
                <StatBlock label="Accuracy" value={m.accuracy} decimals={4} color="#30d158" icon={<Target className="w-3 h-3" />} />
                <StatBlock label="Bal. Acc." value={m.balanced_accuracy} decimals={4} color="#3b82f6" icon={<TrendingUp className="w-3 h-3" />} />
                <StatBlock label="Specificity" value={m.specificity} decimals={4} color="#8b5cf6" icon={<Shield className="w-3 h-3" />} />
                <StatBlock label="NPV" value={m.npv} decimals={4} color="#ec4899" icon={<Target className="w-3 h-3" />} />
                <StatBlock label="FPR" value={m.fpr} decimals={4} color="#ff9f0a" icon={<AlertTriangle className="w-3 h-3" />} />
                <StatBlock label="FNR" value={m.fnr} decimals={4} color="#ff2d55" icon={<AlertTriangle className="w-3 h-3" />} />
                <StatBlock label="Brier" value={m.brier} decimals={4} color="#06b6d4" icon={<Target className="w-3 h-3" />} />
              </div>
            </GlowingCard>
          </motion.div>
        </div>
      </AuroraBackground>
    </main>
  );
}
