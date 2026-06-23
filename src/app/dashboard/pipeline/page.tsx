"use client";

import { motion } from "framer-motion";
import { RadialGauge } from "@/components/aceternity/radial-gauge";
import { StatBlock } from "@/components/aceternity/animated-counter";
import { GlowingCard } from "@/components/aceternity/glowing-card";
import { MULTI_INPUT_RESULTS } from "@/lib/data";
import { Activity, Zap, BarChart3, Target, TrendingUp, Database, Clock } from "lucide-react";

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const stagger = {
  visible: { transition: { staggerChildren: 0.1 } },
};

export default function PipelinePage() {
  const r = MULTI_INPUT_RESULTS;
  const cv = r.cv;
  const bs = r.bootstrap;
  const m = r.metrics;

  return (
    <div className="min-h-screen bg-[#0a0a1a] p-4 md:p-8">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeIn}
        className="mb-8"
      >
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
          Multi-Input Pipeline
        </h1>
        <p className="text-cyan-400/70 text-lg">
          HEL1OS Hard X-ray + GOES-18 Soft X-ray | 6-hour Flare Forecast | Balanced 50/50
        </p>
      </motion.div>

      {/* Top Stats */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={stagger}
        className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
      >
        <StatBlock label="Total Samples" value={r.samples} color="#06b6d4" />
        <StatBlock label="Flare Samples" value={r.flare_samples} color="#ff6b6b" />
        <StatBlock label="CV Folds (5x10)" value={r.cv.n_folds} color="#a855f7" />
        <StatBlock label="Bootstrap" value={r.bootstrap.n_bootstrap} color="#10b981" />
      </motion.div>

      {/* Main Gauges - CV results */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={stagger}
        className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
      >
        <GlowingCard className="p-6 flex flex-col items-center">
          <h3 className="text-sm font-medium text-cyan-400/70 mb-4 uppercase tracking-wider">
            TSS (5x10 CV)
          </h3>
          <RadialGauge
            value={cv.tss_mean}
            max={1}
            size={160}
            color="#00ff88"
            label="TSS"
          />
          <p className="text-white/60 text-sm mt-3 font-mono">
            {cv.tss_mean.toFixed(4)} ± {cv.tss_std.toFixed(4)}
          </p>
        </GlowingCard>

        <GlowingCard className="p-6 flex flex-col items-center">
          <h3 className="text-sm font-medium text-cyan-400/70 mb-4 uppercase tracking-wider">
            AUC-ROC
          </h3>
          <RadialGauge
            value={cv.auc_mean}
            max={1}
            size={160}
            color="#3b82f6"
            label="AUC"
          />
          <p className="text-white/60 text-sm mt-3 font-mono">
            {cv.auc_mean.toFixed(4)} ± {cv.auc_std.toFixed(4)}
          </p>
        </GlowingCard>

        <GlowingCard className="p-6 flex flex-col items-center">
          <h3 className="text-sm font-medium text-cyan-400/70 mb-4 uppercase tracking-wider">
            F1 Score
          </h3>
          <RadialGauge
            value={cv.f1_mean}
            max={1}
            size={160}
            color="#f472b6"
            label="F1"
          />
          <p className="text-white/60 text-sm mt-3 font-mono">
            {cv.f1_mean.toFixed(4)} ± {cv.f1_std.toFixed(4)}
          </p>
        </GlowingCard>
      </motion.div>

      {/* Bootstrap CI Row */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeIn}
        className="mb-8"
      >
        <GlowingCard className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <BarChart3 className="w-5 h-5 text-cyan-400" />
            <h2 className="text-xl font-bold text-white">Bootstrap 95% Confidence Intervals</h2>
            <span className="text-xs text-white/40 ml-2">(1000 resamples)</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white/[0.02] rounded-xl p-5 border border-white/[0.04]">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium text-white/60">TSS</span>
                <span className="text-xs text-white/30">95% CI</span>
              </div>
              <div className="text-3xl font-bold font-mono text-neon-green mb-2">
                {bs.tss_mean.toFixed(4)} ± {bs.tss_std.toFixed(4)}
              </div>
              <div className="text-sm text-white/40 font-mono">
                CI: [{bs.tss_ci_95[0].toFixed(4)}, {bs.tss_ci_95[1].toFixed(4)}]
              </div>
              <div className="text-xs text-white/30 mt-1">
                Median: {bs.tss_median.toFixed(4)}
              </div>
            </div>
            <div className="bg-white/[0.02] rounded-xl p-5 border border-white/[0.04]">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium text-white/60">AUC</span>
                <span className="text-xs text-white/30">95% CI</span>
              </div>
              <div className="text-3xl font-bold font-mono text-neon-blue mb-2">
                {bs.auc_mean.toFixed(4)} ± {bs.auc_std.toFixed(4)}
              </div>
              <div className="text-sm text-white/40 font-mono">
                CI: [{bs.auc_ci_95[0].toFixed(4)}, {bs.auc_ci_95[1].toFixed(4)}]
              </div>
            </div>
          </div>
        </GlowingCard>
      </motion.div>

      {/* All CV Metrics Grid */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeIn}
        className="mb-8"
      >
        <GlowingCard className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <Target className="w-5 h-5 text-cyan-400" />
            <h2 className="text-xl font-bold text-white">All Metrics (5x10 Stratified CV)</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
            {[
              { l: "TSS", v: cv.tss_mean, s: cv.tss_std, c: "#00ff88" },
              { l: "AUC", v: cv.auc_mean, s: cv.auc_std, c: "#3b82f6" },
              { l: "HSS", v: cv.hss_mean, s: cv.hss_std, c: "#a855f7" },
              { l: "POD", v: cv.pod_mean, s: cv.pod_std, c: "#f59e0b" },
              { l: "Precision", v: cv.precision_mean, s: cv.precision_std, c: "#06b6d4" },
              { l: "F1", v: cv.f1_mean, s: cv.f1_std, c: "#ec4899" },
              { l: "MCC", v: cv.mcc_mean, s: cv.mcc_std, c: "#10b981" },
            ].map((s) => (
              <div key={s.l} className="bg-white/[0.02] rounded-lg p-3 border border-white/[0.04]">
                <div className="text-[10px] text-white/30 uppercase tracking-wider mb-1">{s.l}</div>
                <div className="text-lg font-bold font-mono" style={{ color: s.c }}>{s.v.toFixed(4)}</div>
                <div className="text-[10px] text-white/30 font-mono mt-1">± {s.s.toFixed(4)}</div>
              </div>
            ))}
          </div>
        </GlowingCard>
      </motion.div>

      {/* SHAP Feature Importance */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeIn}
        className="mb-8"
      >
        <GlowingCard className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <Zap className="w-5 h-5 text-cyan-400" />
            <h2 className="text-xl font-bold text-white">SHAP Feature Importance</h2>
          </div>
          <div className="space-y-3">
            {r.shap.top_features.map((f, i) => {
              const maxImp = r.shap.top_features[0].importance;
              const pct = (f.importance / maxImp) * 100;
              return (
                <div key={f.feature} className="flex items-center gap-3">
                  <span className="text-white/60 text-sm w-40 text-right truncate font-mono">
                    {f.feature}
                  </span>
                  <div className="flex-1 h-6 bg-white/5 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${pct}%` }}
                      transition={{ duration: 0.8, delay: i * 0.05 }}
                      className="h-full rounded-full"
                      style={{
                        background: "linear-gradient(90deg, #06b6d4, #a855f7)",
                      }}
                    />
                  </div>
                  <span className="text-white/80 text-sm w-16 font-mono">
                    {f.importance.toFixed(4)}
                  </span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-400">
                    HXR
                  </span>
                </div>
              );
            })}
          </div>
        </GlowingCard>
      </motion.div>

      {/* Physics Conclusion */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeIn}
        className="mb-8"
      >
        <GlowingCard className="p-6 border-l-4 border-cyan-400">
          <div className="flex items-center gap-3 mb-4">
            <Activity className="w-5 h-5 text-cyan-400" />
            <h2 className="text-xl font-bold text-white">Physics Conclusion</h2>
          </div>
          <p className="text-white/80 text-lg leading-relaxed mb-4">
            {r.physics_conclusion}
          </p>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-cyan-500/10 rounded-lg p-4">
              <p className="text-cyan-400 text-sm font-medium">HEL1OS HXR Contribution</p>
              <p className="text-white text-2xl font-bold">100.0%</p>
            </div>
            <div className="bg-orange-500/10 rounded-lg p-4">
              <p className="text-orange-400 text-sm font-medium">GOES X-ray Contribution</p>
              <p className="text-white text-2xl font-bold">0.0%</p>
              <p className="text-xs text-white/40 mt-1">(dropped: low variance)</p>
            </div>
          </div>
        </GlowingCard>
      </motion.div>

      {/* Methodology */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeIn}
      >
        <GlowingCard className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <Database className="w-5 h-5 text-cyan-400" />
            <h2 className="text-xl font-bold text-white">Methodology</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white/5 rounded-lg p-4">
              <h3 className="text-cyan-400 font-medium mb-2">Balanced Sampling</h3>
              <p className="text-white/60 text-sm">
                98 flare windows + 98 matched quiet windows (50/50 balance).
                Quiet windows selected from GOES periods with max xrsb &lt; 1e-6 and
                &gt;2h gap from any C+ flare. Bootstrapped to match flare count.
              </p>
            </div>
            <div className="bg-white/5 rounded-lg p-4">
              <h3 className="text-cyan-400 font-medium mb-2">5x10 Stratified CV</h3>
              <p className="text-white/60 text-sm">
                5-fold stratified cross-validation repeated 10 times = 50 folds.
                Reports mean ± std for all metrics. Replaces single LOGO split
                that was unreliable with small sample sizes.
              </p>
            </div>
            <div className="bg-white/5 rounded-lg p-4">
              <h3 className="text-cyan-400 font-medium mb-2">Bootstrap 95% CI</h3>
              <p className="text-white/60 text-sm">
                1000 bootstrap resamples with replacement (70/30 split).
                Reports 95% percentile CI for TSS and AUC. TSS 95% CI: [
                {bs.tss_ci_95[0].toFixed(3)}, {bs.tss_ci_95[1].toFixed(3)}].
              </p>
            </div>
          </div>
        </GlowingCard>
      </motion.div>
    </div>
  );
}