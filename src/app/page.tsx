"use client";
import { motion } from "framer-motion";
import { AuroraBackground } from "@/components/aceternity/aurora-background";
import { FloatingNav } from "@/components/aceternity/floating-nav";
import { GlowingCard, MetricCard } from "@/components/aceternity/glowing-card";
import { RadialGauge } from "@/components/aceternity/radial-gauge";
import { AnimatedCounter, StatBlock } from "@/components/aceternity/animated-counter";
import { SolarFlareIndicator } from "@/components/aceternity/solar-effects";
import { STACKING_RESULTS, SCIENTIFIC_EVAL, getFlareClass } from "@/lib/data";
import { ChevronRight, ExternalLink, Activity, Zap, Target, Cpu, Database, Clock, Sun } from "lucide-react";
import Link from "next/link";

const NAV = [
  { label: "Dashboard", href: "/dashboard" },{ label: "Pipeline", href: "/dashboard/pipeline" },
  { label: "Monitor", href: "/dashboard/monitor" },
  { label: "Performance", href: "/dashboard/performance" },
  { label: "Configs", href: "/dashboard/configs" },
];

export default function HomePage() {
  const m = STACKING_RESULTS.metrics;
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
                <RadialGauge value={SCIENTIFIC_EVAL.goeOnly.walk_forward.tss} label="GOES TSS" color="#ff2d55" glowColor="#ff4d6d" size={130} />
                <RadialGauge value={SCIENTIFIC_EVAL.goeOnly.cv_5fold_biased.tss} label="CV (biased)" color="#ff9f0a" glowColor="#fbbf24" size={130} />
                <RadialGauge value={SCIENTIFIC_EVAL.goeOnly.walk_forward.auc} label="GOES AUC" color="#30d158" glowColor="#34d399" size={130} />
              </div>

              <div className="text-center mb-6">
                <div className="text-xs text-white/30 uppercase tracking-widest mb-1">Honest Metrics (Time-Based Splits)</div>
                <div className="text-sm text-white/20">GOES-only model: {SCIENTIFIC_EVAL.goeOnly.walk_forward.n_splits} walk-forward splits, no threshold tuning</div>
              </div>

              <div className="grid grid-cols-6 gap-3">
                {[
                  { l: "Walk-Forward TSS", v: SCIENTIFIC_EVAL.goeOnly.walk_forward.tss, c: "#ff2d55" },
                  { l: "Expanding TSS", v: SCIENTIFIC_EVAL.goeOnly.expanding_window.tss, c: "#ff9f0a" },
                  { l: "CV TSS (biased)", v: SCIENTIFIC_EVAL.goeOnly.cv_5fold_biased.tss, c: "#30d158" },
                  { l: "Walk-Forward AUC", v: SCIENTIFIC_EVAL.goeOnly.walk_forward.auc, c: "#8b5cf6" },
                  { l: "POD", v: SCIENTIFIC_EVAL.goeOnly.walk_forward.pod, c: "#06b6d4" },
                  { l: "F1", v: SCIENTIFIC_EVAL.goeOnly.walk_forward.f1, c: "#ec4899" },
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
              4-expert stacking solar flare prediction using GOES-18, HEL1OS, HMI/SHARP, and SOLEXS data
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              { icon: Activity, title: "Multi-Instrument", desc: "4 data sources: GOES-18 XRS, HEL1OS, HMI/SHARP, SOLEXS — 48 features total", color: "#06b6d4", glow: "glow-cyan" },
              { icon: Zap, title: "Scientific Reality", desc: `GOES-only TSS = ${SCIENTIFIC_EVAL.goeOnly.walk_forward.tss.toFixed(3)} with time-based splits. 4-expert stacked model: TSS = 0.933 (random CV — biased)`, color: "#ff2d55", glow: "glow-red" },
              { icon: Target, title: "Honest Evaluation", desc: "Walk-forward, expanding window, and cross-year validation. No threshold tuning on test data.", color: "#30d158", glow: "glow-green" },
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
            { icon: Database, label: "GOES Samples", value: SCIENTIFIC_EVAL.dataset.n_samples, color: "#06b6d4" },
            { icon: Cpu, label: "GOES Features", value: SCIENTIFIC_EVAL.dataset.features, color: "#30d158" },
            { icon: Sun, label: "Horizon", value: 6, suffix: "h", color: "#ff9f0a" },
            { icon: Clock, label: "GOES TSS (honest)", value: SCIENTIFIC_EVAL.goeOnly.walk_forward.tss, decimals: 3, color: "#ff2d55" },
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
          <div className="text-xs text-white/15">PRADHAN v2.0 — ISRO Aditya-L1 — Honest Scientific Evaluation</div>
          <div className="text-xs text-white/15">GOES XRS × XGBoost</div>
        </div>
      </footer>
    </main>
  );
}
