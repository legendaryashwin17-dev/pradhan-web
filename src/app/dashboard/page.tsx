"use client";
import { motion } from "framer-motion";
import { FloatingNav } from "@/components/aceternity/floating-nav";
import { AuroraBackground } from "@/components/aceternity/aurora-background";
import { GlowingCard, MetricCard } from "@/components/aceternity/glowing-card";
import { BEST_MODEL, MODEL_RESULTS, getFlareClass, getFlareColor } from "@/lib/data";
import { Activity, Zap, Target, TrendingUp, BarChart3, Settings, Sun } from "lucide-react";
import Link from "next/link";

const NAV_ITEMS = [
  { label: "Home", href: "/" },
  { label: "Dashboard", href: "/dashboard", active: true },
  { label: "Monitor", href: "/dashboard/monitor" },
  { label: "Performance", href: "/dashboard/performance" },
  { label: "Configs", href: "/dashboard/configs" },
];

export default function DashboardPage() {
  const m = BEST_MODEL.metrics;
  const currentFlux = 2.34e-7;
  const currentClass = getFlareClass(currentFlux);
  const currentColor = getFlareColor(currentFlux);

  return (
    <main className="min-h-screen">
      <FloatingNav items={NAV_ITEMS} />

      <AuroraBackground className="pt-28 pb-16 px-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-10"
          >
            <h1 className="text-4xl font-bold text-white mb-2">Dashboard</h1>
            <p className="text-white/40">Solar flare monitoring and model performance</p>
          </motion.div>

          {/* Status Strip */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <GlowingCard className="p-6 mb-8" glowColor={currentColor}>
              <div className="flex items-center justify-between flex-wrap gap-6">
                <div className="flex items-center gap-4">
                  <div
                    className="w-4 h-4 rounded-full animate-pulse"
                    style={{ backgroundColor: currentColor }}
                  />
                  <div>
                    <div className="text-xs text-white/40 uppercase tracking-widest">Status</div>
                    <div className="text-xl font-bold font-mono" style={{ color: currentColor }}>
                      {currentClass}-class Activity
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-8">
                  <div>
                    <div className="text-xs text-white/40 uppercase tracking-widest">XRS-B</div>
                    <div className="text-lg font-bold font-mono text-white">
                      {currentFlux.toExponential(2)} W/m²
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-white/40 uppercase tracking-widest">XRS-A</div>
                    <div className="text-lg font-bold font-mono text-white">
                      8.12e-8 W/m²
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-white/40 uppercase tracking-widest">Ratio</div>
                    <div className="text-lg font-bold font-mono text-white">2.88</div>
                  </div>
                </div>
              </div>
            </GlowingCard>
          </motion.div>

          {/* Metrics Grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8"
          >
            <MetricCard label="TSS" value={m.tss.toFixed(4)} color="#06b6d4" />
            <MetricCard label="AUC-ROC" value={m.auc.toFixed(4)} color="#0ea5e9" />
            <MetricCard label="HSS" value={m.hss.toFixed(4)} color="#8b5cf6" />
            <MetricCard label="POD" value={m.pod.toFixed(4)} color="#10b981" />
            <MetricCard label="POFD" value={m.pofd.toFixed(4)} color="#f59e0b" />
            <MetricCard label="Brier" value={m.brier.toFixed(4)} color="#ef4444" />
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            <Link href="/dashboard/monitor">
              <GlowingCard className="p-6 group cursor-pointer h-full" glowColor="#06b6d4">
                <Activity className="w-8 h-8 text-cyan-400 mb-4 group-hover:scale-110 transition-transform" />
                <h3 className="text-lg font-semibold text-white mb-2">Live Monitor</h3>
                <p className="text-sm text-white/40">Real-time X-ray flux and flare classification</p>
              </GlowingCard>
            </Link>

            <Link href="/dashboard/performance">
              <GlowingCard className="p-6 group cursor-pointer h-full" glowColor="#0ea5e9">
                <BarChart3 className="w-8 h-8 text-sky-400 mb-4 group-hover:scale-110 transition-transform" />
                <h3 className="text-lg font-semibold text-white mb-2">Model Performance</h3>
                <p className="text-sm text-white/40">Metrics, ROC analysis, and feature importance</p>
              </GlowingCard>
            </Link>

            <Link href="/dashboard/configs">
              <GlowingCard className="p-6 group cursor-pointer h-full" glowColor="#f59e0b">
                <Settings className="w-8 h-8 text-amber-400 mb-4 group-hover:scale-110 transition-transform" />
                <h3 className="text-lg font-semibold text-white mb-2">Config Compare</h3>
                <p className="text-sm text-white/40">Compare all 6 model configurations</p>
              </GlowingCard>
            </Link>
          </motion.div>
        </div>
      </AuroraBackground>
    </main>
  );
}
