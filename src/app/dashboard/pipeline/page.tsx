"use client";

import { motion } from "framer-motion";
import { RadialGauge } from "@/components/aceternity/radial-gauge";
import { StatBlock } from "@/components/aceternity/animated-counter";
import { GlowingCard } from "@/components/aceternity/glowing-card";
import { MULTI_INPUT_RESULTS, MODEL_RESULTS } from "@/lib/data";
import { Activity, Zap, BarChart3, Target, TrendingUp } from "lucide-react";

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const stagger = {
  visible: { transition: { staggerChildren: 0.1 } },
};

export default function PipelinePage() {
  const r = MULTI_INPUT_RESULTS;
  const multiModel = MODEL_RESULTS[0];

  return (
    <div className="min-h-screen bg-[#0a0a1a] p-4 md:p-8">
      {/* Header */}
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
          HEL1OS Hard X-ray + GOES-18 Soft X-ray | 6-hour Flare Forecast
        </p>
      </motion.div>

      {/* Top Stats */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={stagger}
        className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
      >
        <StatBlock label="Samples" value={r.samples} color="cyan" />
        <StatBlock label="Unique ARs" value={r.unique_ars} color="purple" />
        <StatBlock label="Features" value={r.features_selected} color="pink" />
        <StatBlock label="Flare Rate" value={r.positive_rate * 100} color="orange" />
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
            Bootstrap TSS (95% CI)
          </h3>
          <RadialGauge
            value={r.bootstrap.tss_mean}
            max={1}
            size={160}
            color="#00ff88"
            label="TSS"
          />
          <p className="text-white/60 text-sm mt-3">
            [{r.bootstrap.tss_ci_95[0].toFixed(3)}, {r.bootstrap.tss_ci_95[1].toFixed(3)}]
          </p>
        </GlowingCard>

        <GlowingCard className="p-6 flex flex-col items-center">
          <h3 className="text-sm font-medium text-cyan-400/70 mb-4 uppercase tracking-wider">
            Bootstrap AUC (95% CI)
          </h3>
          <RadialGauge
            value={r.bootstrap.auc_mean}
            max={1}
            size={160}
            color="#ff6b6b"
            label="AUC"
          />
          <p className="text-white/60 text-sm mt-3">
            [{r.bootstrap.auc_ci_95[0].toFixed(3)}, {r.bootstrap.auc_ci_95[1].toFixed(3)}]
          </p>
        </GlowingCard>

        <GlowingCard className="p-6 flex flex-col items-center">
          <h3 className="text-sm font-medium text-cyan-400/70 mb-4 uppercase tracking-wider">
            HEL1OS Dominance
          </h3>
          <RadialGauge
            value={r.shap.hel1os_contribution}
            max={1}
            size={160}
            color="#a855f7"
            label="HXR %"
          />
          <p className="text-white/60 text-sm mt-3">
            {r.shap.dominance_ratio}x over GOES
          </p>
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
            <BarChart3 className="w-5 h-5 text-cyan-400" />
            <h2 className="text-xl font-bold text-white">SHAP Feature Importance</h2>
          </div>

          <div className="space-y-3">
            {multiModel.feature_importance.map((f, i) => {
              const maxImp = multiModel.feature_importance[0].importance;
              const pct = (f.importance / maxImp) * 100;
              const isHxr = f.category === "hxr";
              return (
                <div key={f.feature} className="flex items-center gap-3">
                  <span className="text-white/60 text-sm w-40 text-right truncate">
                    {f.feature}
                  </span>
                  <div className="flex-1 h-6 bg-white/5 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${pct}%` }}
                      transition={{ duration: 0.8, delay: i * 0.05 }}
                      className="h-full rounded-full"
                      style={{
                        background: isHxr
                          ? "linear-gradient(90deg, #a855f7, #06b6d4)"
                          : "linear-gradient(90deg, #ff6b6b, #ff9f0a)",
                      }}
                    />
                  </div>
                  <span className="text-white/80 text-sm w-16">
                    {f.importance.toFixed(4)}
                  </span>
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full ${
                      isHxr
                        ? "bg-purple-500/20 text-purple-400"
                        : "bg-orange-500/20 text-orange-400"
                    }`}
                  >
                    {isHxr ? "HXR" : "X-ray"}
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
        <GlowingCard className="p-6 border-l-4 border-purple-500">
          <div className="flex items-center gap-3 mb-4">
            <Zap className="w-5 h-5 text-purple-400" />
            <h2 className="text-xl font-bold text-white">Physics Conclusion</h2>
          </div>
          <p className="text-white/80 text-lg leading-relaxed">
            {r.physics_conclusion}
          </p>
          <div className="mt-4 grid grid-cols-2 gap-4">
            <div className="bg-purple-500/10 rounded-lg p-4">
              <p className="text-purple-400 text-sm font-medium">HEL1OS HXR Contribution</p>
              <p className="text-white text-2xl font-bold">
                {(r.shap.hel1os_contribution * 100).toFixed(1)}%
              </p>
            </div>
            <div className="bg-orange-500/10 rounded-lg p-4">
              <p className="text-orange-400 text-sm font-medium">GOES X-ray Contribution</p>
              <p className="text-white text-2xl font-bold">
                {(r.shap.goes_contribution * 100).toFixed(1)}%
              </p>
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
            <Target className="w-5 h-5 text-cyan-400" />
            <h2 className="text-xl font-bold text-white">Methodology</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white/5 rounded-lg p-4">
              <h3 className="text-cyan-400 font-medium mb-2">Sliding Window</h3>
              <p className="text-white/60 text-sm">
                105 HEL1OS observations x 6 time windows = 630 samples.
                Each window: 1-hour feature lookback, 6-hour forecast horizon.
              </p>
            </div>
            <div className="bg-white/5 rounded-lg p-4">
              <h3 className="text-cyan-400 font-medium mb-2">LOGO Cross-Validation</h3>
              <p className="text-white/60 text-sm">
                Leave-One-AR-Out CV across {r.logo_cv.n_folds} active regions.
                Reports TSS = {r.logo_cv.tss_mean.toFixed(3)} +/- {r.logo_cv.tss_std.toFixed(3)}.
              </p>
            </div>
            <div className="bg-white/5 rounded-lg p-4">
              <h3 className="text-cyan-400 font-medium mb-2">Bootstrap CI</h3>
              <p className="text-white/60 text-sm">
                1000 bootstrap resamples for robust confidence intervals.
                TSS 95% CI: [{r.bootstrap.tss_ci_95[0].toFixed(3)}, {r.bootstrap.tss_ci_95[1].toFixed(3)}].
              </p>
            </div>
          </div>
        </GlowingCard>
      </motion.div>
    </div>
  );
}
