"use client";
import { motion } from "framer-motion";
import { AuroraBackground } from "@/components/aceternity/aurora-background";
import { FloatingNav } from "@/components/aceternity/floating-nav";
import { GlowingCard, MetricCard } from "@/components/aceternity/glowing-card";
import { TextGenerateEffect } from "@/components/aceternity/text-generate";
import { BEST_MODEL, getFlareClass, getFlareColor } from "@/lib/data";
import { Activity, Zap, Target, TrendingUp, ChevronRight, ExternalLink } from "lucide-react";
import Link from "next/link";

const NAV_ITEMS = [
  { label: "Dashboard", href: "/dashboard", active: false },
  { label: "Monitor", href: "/dashboard/monitor", active: false },
  { label: "Performance", href: "/dashboard/performance", active: false },
  { label: "Configs", href: "/dashboard/configs", active: false },
];

export default function HomePage() {
  const m = BEST_MODEL.metrics;
  const currentFlux = 2.34e-7;
  const currentClass = getFlareClass(currentFlux);
  const currentColor = getFlareColor(currentFlux);

  return (
    <main className="min-h-screen">
      <FloatingNav items={NAV_ITEMS} />

      {/* Hero Section */}
      <AuroraBackground className="min-h-screen flex items-center justify-center">
        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-cyan-500/20 bg-cyan-500/5 mb-8"
          >
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            <span className="text-xs font-medium text-cyan-400 tracking-wider uppercase">
              Live Solar Monitoring
            </span>
          </motion.div>

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-6xl md:text-8xl font-bold tracking-tight mb-6"
          >
            <span className="bg-gradient-to-r from-white via-white/80 to-white/50 bg-clip-text text-transparent">
              PRADHAN
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-lg md:text-xl text-white/40 max-w-2xl mx-auto mb-4 font-light"
          >
            Predictive Real-time Analysis of Data from<br />
            Heliospheric Aditya-Navigation
          </motion.p>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="text-sm text-white/25 mb-12 font-mono"
          >
            ISRO Aditya-L1 × GOES XRS × XGBoost
          </motion.p>

          {/* Live Status Card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
          >
            <GlowingCard className="max-w-2xl mx-auto p-8" glowColor={currentColor}>
              <div className="flex items-center justify-between mb-6">
                <div className="text-left">
                  <div className="text-xs font-medium text-white/40 uppercase tracking-widest mb-1">
                    Current Status
                  </div>
                  <div className="flex items-center gap-3">
                    <div
                      className="w-3 h-3 rounded-full animate-pulse"
                      style={{ backgroundColor: currentColor }}
                    />
                    <span className="text-2xl font-bold font-mono" style={{ color: currentColor }}>
                      {currentClass}-class
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs font-medium text-white/40 uppercase tracking-widest mb-1">
                    XRS-B Flux
                  </div>
                  <div className="text-2xl font-bold font-mono text-white">
                    {currentFlux.toExponential(2)}
                    <span className="text-sm text-white/30 ml-1">W/m²</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-4 gap-4">
                <div className="text-center p-3 rounded-lg bg-white/5">
                  <div className="text-lg font-bold font-mono text-cyan-400">{m.tss.toFixed(3)}</div>
                  <div className="text-[10px] text-white/30 uppercase tracking-wider mt-1">TSS</div>
                </div>
                <div className="text-center p-3 rounded-lg bg-white/5">
                  <div className="text-lg font-bold font-mono text-cyan-400">{m.auc.toFixed(3)}</div>
                  <div className="text-[10px] text-white/30 uppercase tracking-wider mt-1">AUC</div>
                </div>
                <div className="text-center p-3 rounded-lg bg-white/5">
                  <div className="text-lg font-bold font-mono text-cyan-400">{m.pod.toFixed(3)}</div>
                  <div className="text-[10px] text-white/30 uppercase tracking-wider mt-1">POD</div>
                </div>
                <div className="text-center p-3 rounded-lg bg-white/5">
                  <div className="text-lg font-bold font-mono text-cyan-400">{m.hss.toFixed(3)}</div>
                  <div className="text-[10px] text-white/30 uppercase tracking-wider mt-1">HSS</div>
                </div>
              </div>
            </GlowingCard>
          </motion.div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 1 }}
            className="mt-10 flex items-center justify-center gap-4"
          >
            <Link
              href="/dashboard"
              className="flex items-center gap-2 px-6 py-3 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 font-medium text-sm hover:bg-cyan-500/20 transition-all duration-200"
            >
              Open Dashboard
              <ChevronRight className="w-4 h-4" />
            </Link>
            <a
              href="https://github.com/legendaryashwin17-dev/pradhan-solar-flare"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-6 py-3 rounded-full bg-white/5 border border-white/10 text-white/60 font-medium text-sm hover:bg-white/10 transition-all duration-200"
            >
              <ExternalLink className="w-4 h-4" />
              GitHub
            </a>
          </motion.div>
        </div>
      </AuroraBackground>

      {/* Features Section */}
      <section className="py-32 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl font-bold text-white mb-4">Space Weather Intelligence</h2>
            <p className="text-white/40 max-w-lg mx-auto">
              Real-time solar flare prediction using 19 engineered features from GOES X-ray satellite data
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: Activity,
                title: "Real-time Monitoring",
                desc: "1-minute cadence X-ray flux data from GOES-16/18 satellites",
                color: "#06b6d4",
              },
              {
                icon: Zap,
                title: "ML Prediction",
                desc: "XGBoost model trained on 7.8M samples with TSS = 0.79",
                color: "#0ea5e9",
              },
              {
                icon: Target,
                title: "ISRO Compliant",
                desc: "Exceeds ISRO targets: TSS ≥ 0.65, AUC ≥ 0.80, POD ≥ 0.80",
                color: "#f59e0b",
              },
            ].map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
              >
                <GlowingCard className="p-8 h-full" glowColor={feature.color}>
                  <feature.icon className="w-8 h-8 mb-4" style={{ color: feature.color }} />
                  <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
                  <p className="text-sm text-white/40 leading-relaxed">{feature.desc}</p>
                </GlowingCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-20 px-6 border-t border-white/5">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { label: "Training Samples", value: "7.8M" },
              { label: "Feature Count", value: "19" },
              { label: "Model Config", value: "1h C" },
              { label: "Best TSS", value: "0.793" },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center"
              >
                <div className="text-3xl font-bold font-mono text-cyan-400 mb-1">{stat.value}</div>
                <div className="text-xs text-white/30 uppercase tracking-widest">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-white/5">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="text-xs text-white/20">
            PRADHAN v1.0 — ISRO Aditya-L1
          </div>
          <div className="text-xs text-white/20">
            GOES XRS × XGBoost
          </div>
        </div>
      </footer>
    </main>
  );
}
