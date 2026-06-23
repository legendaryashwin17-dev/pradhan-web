"use client";
import { motion } from "framer-motion";
import { AuroraBackground } from "@/components/aceternity/aurora-background";
import { FloatingNav } from "@/components/aceternity/floating-nav";
import { GlowingCard, MetricCard } from "@/components/aceternity/glowing-card";
import { RadialGauge } from "@/components/aceternity/radial-gauge";
import { AnimatedCounter, StatBlock } from "@/components/aceternity/animated-counter";
import { SolarFlareIndicator } from "@/components/aceternity/solar-effects";
import { BEST_MODEL, getFlareClass } from "@/lib/data";
import { ChevronRight, ExternalLink, Activity, Zap, Target, Cpu, Database, Clock, Sun } from "lucide-react";
import Link from "next/link";

const NAV = [
  { label: "Dashboard", href: "/dashboard" },
  { label: "Monitor", href: "/dashboard/monitor" },
  { label: "Performance", href: "/dashboard/performance" },
  { label: "Configs", href: "/dashboard/configs" },
];

export default function HomePage() {
  const m = BEST_MODEL.metrics;
  const flux = 2.34e-7;
  const cls = getFlareClass(flux);

  return (
    <main className="min-h-screen">
      <FloatingNav items={NAV} />

      <AuroraBackground className="min-h-screen flex items-center justify-center">
        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
          {/* Badge */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-neon-cyan/20 bg-neon-cyan/5 mb-8">
            <span className="w-2 h-2 rounded-full bg-neon-cyan animate-pulse" />
            <span className="text-xs font-medium text-neon-cyan tracking-wider uppercase">Live Solar Monitoring</span>
          </motion.div>

          {/* Title */}
          <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }}
            className="text-7xl md:text-9xl font-black tracking-tighter mb-6">
            <span className="bg-gradient-to-r from-neon-cyan via-neon-blue to-neon-violet bg-clip-text text-transparent text-glow-cyan">
              PRADHAN
            </span>
          </motion.h1>

          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.4 }}
            className="text-lg text-white/30 max-w-xl mx-auto mb-3 font-light tracking-wide">
            Predictive Real-time Analysis of Data from<br />
            Heliospheric Aditya-Navigation
          </motion.p>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6, delay: 0.6 }}
            className="text-xs text-white/15 mb-14 font-mono tracking-[0.2em] uppercase">
            ISRO Aditya-L1 × GOES XRS × XGBoost
          </motion.p>

          {/* Live Status */}
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.7 }}>
            <GlowingCard className="max-w-3xl mx-auto p-8" glowColor="#06b6d4">
              <div className="flex items-center justify-between mb-8">
                <SolarFlareIndicator classType={cls} flux={flux} />
                <div className="text-right">
                  <div className="text-[10px] text-white/30 uppercase tracking-[0.15em] mb-1">XRS-B Flux</div>
                  <div className="text-2xl font-bold font-mono text-neon-cyan text-glow-cyan">
                    {flux.toExponential(2)}
                    <span className="text-sm text-white/20 ml-1">W/m²</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-center gap-8 mb-8">
                <RadialGauge value={m.tss} label="TSS" color="#06b6d4" glowColor="#3b82f6" size={130} />
                <RadialGauge value={m.auc} label="AUC-ROC" color="#30d158" glowColor="#34d399" size={130} />
                <RadialGauge value={m.pod} label="POD" color="#ff9f0a" glowColor="#fbbf24" size={130} />
                <RadialGauge value={m.hss} label="HSS" color="#8b5cf6" glowColor="#a78bfa" size={130} />
              </div>

              <div className="grid grid-cols-6 gap-3">
                {[
                  { l: "Precision", v: m.precision, c: "#06b6d4" },
                  { l: "Recall", v: m.recall, c: "#30d158" },
                  { l: "F1", v: m.f1, c: "#3b82f6" },
                  { l: "MCC", v: m.mcc, c: "#8b5cf6" },
                  { l: "CSI", v: m.csi, c: "#ff9f0a" },
                  { l: "Brier", v: m.brier, c: "#ec4899" },
                ].map((s) => (
                  <div key={s.l} className="text-center p-2 rounded-lg bg-white/[0.03] border border-white/[0.04]">
                    <div className="text-sm font-bold font-mono" style={{ color: s.c }}>{s.v.toFixed(3)}</div>
                    <div className="text-[9px] text-white/25 uppercase tracking-wider mt-1">{s.l}</div>
                  </div>
                ))}
              </div>
            </GlowingCard>
          </motion.div>

          {/* CTA */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6, delay: 1 }}
            className="mt-10 flex items-center justify-center gap-4">
            <Link href="/dashboard"
              className="flex items-center gap-2 px-6 py-3 rounded-full bg-neon-cyan/10 border border-neon-cyan/20 text-neon-cyan font-medium text-sm hover:bg-neon-cyan/20 hover:border-neon-cyan/40 transition-all duration-200 glow-cyan">
              Open Dashboard <ChevronRight className="w-4 h-4" />
            </Link>
            <a href="https://github.com/legendaryashwin17-dev/pradhan-solar-flare" target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-2 px-6 py-3 rounded-full bg-white/[0.03] border border-white/[0.08] text-white/50 font-medium text-sm hover:bg-white/[0.06] transition-all duration-200">
              <ExternalLink className="w-4 h-4" /> GitHub
            </a>
          </motion.div>
        </div>
      </AuroraBackground>

      {/* Features */}
      <section className="py-28 px-6 grid-pattern">
        <div className="max-w-6xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
            <h2 className="text-3xl font-bold text-white mb-3">Space Weather Intelligence</h2>
            <p className="text-white/30 max-w-lg mx-auto text-sm">
              Real-time solar flare prediction using 19 engineered features from GOES X-ray satellite data
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              { icon: Activity, title: "Real-time Monitoring", desc: "1-minute cadence X-ray flux data from GOES-16/18 satellites", color: "#06b6d4", glow: "glow-cyan" },
              { icon: Zap, title: "ML Prediction", desc: "XGBoost model trained on 7.8M samples with TSS = 0.79", color: "#30d158", glow: "glow-green" },
              { icon: Target, title: "ISRO Compliant", desc: "Exceeds ISRO targets: TSS ≥ 0.65, AUC ≥ 0.80, POD ≥ 0.80", color: "#ff9f0a", glow: "glow-amber" },
            ].map((f, i) => (
              <motion.div key={f.title} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.15 }}>
                <GlowingCard className={`p-7 h-full ${f.glow}`} glowColor={f.color}>
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center mb-4" style={{ background: `${f.color}15` }}>
                    <f.icon className="w-5 h-5" style={{ color: f.color }} />
                  </div>
                  <h3 className="text-base font-semibold text-white mb-2">{f.title}</h3>
                  <p className="text-sm text-white/35 leading-relaxed">{f.desc}</p>
                </GlowingCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-20 px-6 border-t border-white/[0.04]">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { icon: Database, label: "Training Samples", value: 7803585, color: "#06b6d4" },
            { icon: Cpu, label: "Feature Count", value: 19, color: "#30d158" },
            { icon: Sun, label: "Model Config", value: 1, suffix: "h C", color: "#ff9f0a" },
            { icon: Clock, label: "Best TSS", value: 0.793, decimals: 3, color: "#8b5cf6" },
          ].map((s, i) => (
            <motion.div key={s.label} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
              <StatBlock label={s.label} value={s.value} decimals={s.decimals ?? 0} suffix={s.suffix} color={s.color} icon={<s.icon className="w-3.5 h-3.5" />} />
            </motion.div>
          ))}
        </div>
      </section>

      <footer className="py-8 px-6 border-t border-white/[0.04]">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="text-xs text-white/15">PRADHAN v2.0 — ISRO Aditya-L1</div>
          <div className="text-xs text-white/15">GOES XRS × XGBoost</div>
        </div>
      </footer>
    </main>
  );
}
