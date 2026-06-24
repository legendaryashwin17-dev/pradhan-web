"use client";

import { motion } from "framer-motion";
import { RadialGauge } from "@/components/aceternity/radial-gauge";
import { StatBlock } from "@/components/aceternity/animated-counter";
import { GlowingCard } from "@/components/aceternity/glowing-card";
import { MULTI_INPUT_RESULTS } from "@/lib/data";
import { Activity, Zap, BarChart3, Target, Database, Layers, Sun, Telescope, Satellite } from "lucide-react";

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const stagger = {
  visible: { transition: { staggerChildren: 0.1 } },
};

const expertColors = {
  GOES: "#3b82f6",
  HEL1OS: "#a855f7",
  SHARP: "#ef4444",
  SOLEXS: "#22c55e",
};

const expertIcons = {
  GOES: Sun,
  HEL1OS: Telescope,
  SHARP: Zap,
  SOLEXS: Satellite,
};

export default function PipelinePage() {
  const r = MULTI_INPUT_RESULTS;
  const cv = r.cv;
  const bs = r.bootstrap;
  const m = r.metrics;
  const ec = r.expert_comparison;
  const shap = r.shap;

  return (
    <div className="min-h-screen bg-[#0a0a1a] p-4 md:p-8">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeIn}
        className="mb-8"
      >
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
          4-Expert Stacking Pipeline
        </h1>
        <p className="text-cyan-400/70 text-lg">
          GOES-18 + HEL1OS + HMI/SHARP + SOLEXS | Logistic Regression Meta-Learner | 6h C-class Forecast
        </p>
      </motion.div>

      {/* Architecture Diagram */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeIn}
        className="mb-8"
      >
        <GlowingCard className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <Layers className="w-5 h-5 text-cyan-400" />
            <h2 className="text-xl font-bold text-white">Stacking Architecture</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-center">
            {r.experts.map((expert, i) => {
              const Icon = expertIcons[expert.name.split("-")[0] as keyof typeof expertIcons] || Sun;
              const color = expertColors[expert.name.split("-")[0] as keyof typeof expertColors] || "#3b82f6";
              return (
                <div key={expert.name} className="flex flex-col items-center">
                  <div
                    className="w-20 h-20 rounded-2xl flex items-center justify-center mb-3 border"
                    style={{ backgroundColor: `${color}15`, borderColor: `${color}30` }}
                  >
                    <Icon className="w-8 h-8" style={{ color }} />
                  </div>
                  <p className="text-white font-medium text-sm">{expert.name}</p>
                  <p className="text-white/40 text-xs">{expert.features} features</p>
                  <p className="text-white/60 text-[10px] text-center mt-1 px-2">{expert.description}</p>
                  <div className="mt-2 px-3 py-1 rounded-full text-xs font-mono" style={{ backgroundColor: `${color}20`, color }}>
                    {ec[expert.name.split("-")[0].toLowerCase() as keyof typeof ec]?.weight}%
                  </div>
                </div>
              );
            })}
            <div className="flex flex-col items-center md:col-span-5">
              <div className="w-px h-6 bg-white/20" />
              <div className="w-full max-w-xs h-12 rounded-xl bg-gradient-to-r from-cyan-500/20 via-purple-500/20 to-pink-500/20 border border-cyan-500/30 flex items-center justify-center">
                <span className="text-cyan-400 font-medium text-sm">Logistic Regression Meta-Learner</span>
              </div>
              <div className="w-px h-4 bg-white/20" />
              <div className="px-4 py-2 rounded-lg bg-green-500/10 border border-green-500/20">
                <span className="text-green-400 font-bold">Final Prediction</span>
              </div>
            </div>
          </div>
        </GlowingCard>
      </motion.div>

      {/* Top Stats */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={stagger}
        className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
      >
        <StatBlock label="Total Samples" value={r.samples} color="#06b6d4" />
        <StatBlock label="Valid (4-expert)" value={r.valid_samples || 107} color="#10b981" />
        <StatBlock label="CV Folds (5x10)" value={r.cv.n_folds} color="#a855f7" />
        <StatBlock label="Total Features" value={r.features_raw} color="#f59e0b" />
      </motion.div>

      {/* Main Gauges */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={stagger}
        className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
      >
        <GlowingCard className="p-6 flex flex-col items-center">
          <h3 className="text-sm font-medium text-cyan-400/70 mb-4 uppercase tracking-wider">
            Stacked TSS (5x10 CV)
          </h3>
          <RadialGauge value={cv.tss_mean} max={1} size={160} color="#00ff88" label="TSS" />
          <p className="text-white/60 text-sm mt-3 font-mono">
            {cv.tss_mean.toFixed(4)} ± {cv.tss_std.toFixed(4)}
          </p>
        </GlowingCard>

        <GlowingCard className="p-6 flex flex-col items-center">
          <h3 className="text-sm font-medium text-cyan-400/70 mb-4 uppercase tracking-wider">
            AUC-ROC
          </h3>
          <RadialGauge value={cv.auc_mean} max={1} size={160} color="#3b82f6" label="AUC" />
          <p className="text-white/60 text-sm mt-3 font-mono">
            {cv.auc_mean.toFixed(4)} ± {cv.auc_std.toFixed(4)}
          </p>
        </GlowingCard>

        <GlowingCard className="p-6 flex flex-col items-center">
          <h3 className="text-sm font-medium text-cyan-400/70 mb-4 uppercase tracking-wider">
            F1 Score
          </h3>
          <RadialGauge value={cv.f1_mean} max={1} size={160} color="#f472b6" label="F1" />
          <p className="text-white/60 text-sm mt-3 font-mono">
            {cv.f1_mean.toFixed(4)} ± {cv.f1_std.toFixed(4)}
          </p>
        </GlowingCard>
      </motion.div>

      {/* Expert Comparison Table */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeIn}
        className="mb-8"
      >
        <GlowingCard className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <BarChart3 className="w-5 h-5 text-cyan-400" />
            <h2 className="text-xl font-bold text-white">Expert Comparison</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left text-white/60 py-3 px-2">Expert</th>
                  <th className="text-center text-white/60 py-3 px-2">Weight</th>
                  <th className="text-center text-white/60 py-3 px-2">TSS</th>
                  <th className="text-center text-white/60 py-3 px-2">AUC</th>
                  <th className="text-center text-white/60 py-3 px-2">POD</th>
                  <th className="text-center text-white/60 py-3 px-2">Precision</th>
                  <th className="text-center text-white/60 py-3 px-2">F1</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { name: "GOES-18", key: "goes", color: expertColors.GOES },
                  { name: "HEL1OS", key: "hel1os", color: expertColors.HEL1OS },
                  { name: "SHARP", key: "sharp", color: expertColors.SHARP },
                  { name: "SOLEXS", key: "solexs", color: expertColors.SOLEXS },
                ].map(({ name, key, color }) => {
                  const data = ec[key as keyof typeof ec];
                  return (
                    <tr key={key} className="border-b border-white/5 hover:bg-white/[0.02]">
                      <td className="py-3 px-2 font-medium" style={{ color }}>{name}</td>
                      <td className="text-center py-3 px-2">
                        <span className="px-2 py-1 rounded-full text-xs font-mono" style={{ backgroundColor: `${color}20`, color }}>
                          {data.weight}%
                        </span>
                      </td>
                      <td className="text-center py-3 px-2 font-mono text-white/80">{data.tss.toFixed(4)}</td>
                      <td className="text-center py-3 px-2 font-mono text-white/80">{data.auc.toFixed(4)}</td>
                      <td className="text-center py-3 px-2 font-mono text-white/80">{data.pod.toFixed(4)}</td>
                      <td className="text-center py-3 px-2 font-mono text-white/80">{data.precision.toFixed(4)}</td>
                      <td className="text-center py-3 px-2 font-mono text-white/80">{data.f1.toFixed(4)}</td>
                    </tr>
                  );
                })}
                <tr className="border-t-2 border-cyan-500/30 bg-cyan-500/5">
                  <td className="py-3 px-2 font-bold text-cyan-400">Stacked 4-Expert</td>
                  <td className="text-center py-3 px-2"><span className="px-2 py-1 rounded-full text-xs font-mono bg-cyan-500/20 text-cyan-400">100%</span></td>
                  <td className="text-center py-3 px-2 font-mono font-bold text-cyan-400">{cv.tss_mean.toFixed(4)}</td>
                  <td className="text-center py-3 px-2 font-mono font-bold text-cyan-400">{cv.auc_mean.toFixed(4)}</td>
                  <td className="text-center py-3 px-2 font-mono font-bold text-cyan-400">{cv.pod_mean.toFixed(4)}</td>
                  <td className="text-center py-3 px-2 font-mono font-bold text-cyan-400">{cv.precision_mean.toFixed(4)}</td>
                  <td className="text-center py-3 px-2 font-mono font-bold text-cyan-400">{cv.f1_mean.toFixed(4)}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </GlowingCard>
      </motion.div>

      {/* Bootstrap CI */}
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

      {/* All CV Metrics */}
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
            <h2 className="text-xl font-bold text-white">SHAP Feature Importance (Top 10)</h2>
          </div>
          <div className="space-y-3">
            {shap.top_features.map((f, i) => {
              const maxImp = shap.top_features[0].importance;
              const pct = (f.importance / maxImp) * 100;
              const color = expertColors[f.expert as keyof typeof expertColors] || "#3b82f6";
              return (
                <div key={f.feature} className="flex items-center gap-3">
                  <span className="text-white/60 text-sm w-48 text-right truncate font-mono">
                    {f.feature}
                  </span>
                  <div className="flex-1 h-6 bg-white/5 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${pct}%` }}
                      transition={{ duration: 0.8, delay: i * 0.05 }}
                      className="h-full rounded-full"
                      style={{ background: `linear-gradient(90deg, ${color}80, ${color})` }}
                    />
                  </div>
                  <span className="text-white/80 text-sm w-16 font-mono">
                    {f.importance.toFixed(4)}
                  </span>
                  <span className="text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: `${color}20`, color }}>
                    {f.expert}
                  </span>
                </div>
              );
            })}
          </div>
        </GlowingCard>
      </motion.div>

      {/* Data Sources */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeIn}
        className="mb-8"
      >
        <GlowingCard className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <Database className="w-5 h-5 text-cyan-400" />
            <h2 className="text-xl font-bold text-white">Data Sources</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(r.data_sources).map(([key, desc]) => {
              const color = expertColors[key.toUpperCase() as keyof typeof expertColors] || "#3b82f6";
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
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: "GOES-18", pct: shap.expert_percentages.goes, color: expertColors.GOES },
              { label: "HEL1OS", pct: shap.expert_percentages.hel1os, color: expertColors.HEL1OS },
              { label: "SHARP", pct: shap.expert_percentages.sharp, color: expertColors.SHARP },
              { label: "SOLEXS", pct: shap.expert_percentages.solexs, color: expertColors.SOLEXS },
            ].map(({ label, pct, color }) => (
              <div key={label} className="rounded-lg p-4" style={{ backgroundColor: `${color}10` }}>
                <p className="text-sm font-medium" style={{ color }}>{label}</p>
                <p className="text-white text-2xl font-bold">{pct}%</p>
                <p className="text-xs text-white/40 mt-1">SHAP contribution</p>
              </div>
            ))}
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
              <h3 className="text-cyan-400 font-medium mb-2">4-Expert Stacking</h3>
              <p className="text-white/60 text-sm">
                Each expert trains an XGBoost classifier on its own features. Meta-learner (logistic regression)
                combines expert predictions into final forecast. Weights learned from 50 CV folds.
              </p>
            </div>
            <div className="bg-white/5 rounded-lg p-4">
              <h3 className="text-cyan-400 font-medium mb-2">5x10 Stratified CV</h3>
              <p className="text-white/60 text-sm">
                5-fold stratified cross-validation repeated 10 times = 50 folds.
                Reports mean ± std for all metrics. Balanced 50/50 flare/quiet split.
              </p>
            </div>
            <div className="bg-white/5 rounded-lg p-4">
              <h3 className="text-cyan-400 font-medium mb-2">Bootstrap 95% CI</h3>
              <p className="text-white/60 text-sm">
                1000 bootstrap resamples with replacement (70/30 split).
                Reports 95% percentile CI for TSS and AUC. TSS CI: [{bs.tss_ci_95[0].toFixed(3)}, {bs.tss_ci_95[1].toFixed(3)}].
              </p>
            </div>
          </div>
        </GlowingCard>
      </motion.div>
    </div>
  );
}
