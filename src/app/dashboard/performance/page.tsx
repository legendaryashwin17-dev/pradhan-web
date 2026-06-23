"use client";
import { motion } from "framer-motion";
import { FloatingNav } from "@/components/aceternity/floating-nav";
import { AuroraBackground } from "@/components/aceternity/aurora-background";
import { GlowingCard, MetricCard } from "@/components/aceternity/glowing-card";
import { BEST_MODEL, MODEL_RESULTS } from "@/lib/data";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Legend,
  ScatterChart, Scatter, ZAxis
} from "recharts";

const NAV_ITEMS = [
  { label: "Home", href: "/" },
  { label: "Dashboard", href: "/dashboard" },
  { label: "Monitor", href: "/dashboard/monitor" },
  { label: "Performance", href: "/dashboard/performance", active: true },
  { label: "Configs", href: "/dashboard/configs" },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-space-800/95 backdrop-blur-xl border border-white/10 rounded-lg px-4 py-3">
      <div className="text-xs text-white/40 mb-1">{label}</div>
      {payload.map((p: any) => (
        <div key={p.name} className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: p.color }} />
          <span className="text-sm font-mono text-white">{typeof p.value === "number" ? p.value.toFixed(4) : p.value}</span>
        </div>
      ))}
    </div>
  );
};

export default function PerformancePage() {
  const m = BEST_MODEL.metrics;
  const fi = BEST_MODEL.feature_importance;

  // TSS comparison data
  const tssData = [...MODEL_RESULTS]
    .sort((a, b) => b.metrics.tss - a.metrics.tss)
    .map((r) => ({
      name: r.label,
      tss: r.metrics.tss,
      fill: r.metrics.tss >= 0.65 ? "#06b6d4" : "#f59e0b",
    }));

  // Radar data
  const radarKeys = ["tss", "hss", "auc", "pod", "csi"];
  const radarData = radarKeys.map((key) => {
    const entry: any = { metric: key.toUpperCase() };
    MODEL_RESULTS.slice(0, 4).forEach((r, i) => {
      entry[r.label] = r.metrics[key as keyof typeof r.metrics];
    });
    return entry;
  });

  // ROC space data
  const rocData = MODEL_RESULTS.map((r) => ({
    name: r.label,
    pofd: r.metrics.pofd,
    pod: r.metrics.pod,
    tss: r.metrics.tss,
  }));

  // Confusion matrix
  const tp = Math.round(m.pod * 1000);
  const fn = 1000 - tp;
  const fp = Math.round(m.pofd * 1000);
  const tn = 1000 - fp;
  const confMatrix = [
    { name: "Pred Flare", Actual_Flare: tp, Actual_Quiet: fp },
    { name: "Pred Quiet", Actual_Flare: fn, Actual_Quiet: tn },
  ];

  return (
    <main className="min-h-screen">
      <FloatingNav items={NAV_ITEMS} />

      <AuroraBackground className="pt-28 pb-16 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-3xl font-bold text-white mb-1">Model Performance</h1>
            <p className="text-white/40 text-sm">Best model: 1h C-class XGBoost</p>
          </motion.div>

          {/* Metrics Strip */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8"
          >
            <MetricCard label="TSS" value={m.tss.toFixed(4)} color="#06b6d4" />
            <MetricCard label="AUC-ROC" value={m.auc.toFixed(4)} color="#0ea5e9" />
            <MetricCard label="HSS" value={m.hss.toFixed(4)} color="#8b5cf6" />
            <MetricCard label="POD" value={m.pod.toFixed(4)} color="#10b981" />
            <MetricCard label="POFD" value={m.pofd.toFixed(4)} color="#f59e0b" />
            <MetricCard label="Brier" value={m.brier.toFixed(4)} color="#ef4444" />
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* TSS Comparison */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
            >
              <GlowingCard className="p-6 h-full" glowColor="#06b6d4">
                <h3 className="text-sm font-medium text-white/60 uppercase tracking-wider mb-4">
                  TSS Across Configurations
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={tssData} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" />
                    <XAxis type="number" domain={[0, 1]} stroke="rgba(255,255,255,0.15)" tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 10 }} />
                    <YAxis type="category" dataKey="name" width={130} stroke="rgba(255,255,255,0.15)" tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 11 }} />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="tss" radius={[0, 4, 4, 0]}>
                      {tssData.map((entry, i) => (
                        <rect key={i} fill={entry.fill} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </GlowingCard>
            </motion.div>

            {/* Radar */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <GlowingCard className="p-6 h-full" glowColor="#8b5cf6">
                <h3 className="text-sm font-medium text-white/60 uppercase tracking-wider mb-4">
                  Metrics Radar (Top 4)
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                  <RadarChart data={radarData}>
                    <PolarGrid stroke="rgba(255,255,255,0.05)" />
                    <PolarAngleAxis dataKey="metric" tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 11 }} />
                    <PolarRadiusAxis tick={{ fill: "rgba(255,255,255,0.2)", fontSize: 9 }} domain={[0, 1]} />
                    <Radar name="1h C-class" dataKey="1h C-class (Best)" stroke="#06b6d4" fill="#06b6d4" fillOpacity={0.15} />
                    <Radar name="3h C-class" dataKey="3h C-class" stroke="#0ea5e9" fill="#0ea5e9" fillOpacity={0.1} />
                    <Radar name="1h M-class" dataKey="1h M-class" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.1} />
                    <Radar name="6h C-class" dataKey="6h C-class" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.1} />
                  </RadarChart>
                </ResponsiveContainer>
              </GlowingCard>
            </motion.div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Feature Importance */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
            >
              <GlowingCard className="p-6 h-full" glowColor="#0ea5e9">
                <h3 className="text-sm font-medium text-white/60 uppercase tracking-wider mb-4">
                  Feature Importance (Top 10)
                </h3>
                <ResponsiveContainer width="100%" height={350}>
                  <BarChart data={fi} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" />
                    <XAxis type="number" stroke="rgba(255,255,255,0.15)" tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 10 }} />
                    <YAxis type="category" dataKey="feature" width={120} stroke="rgba(255,255,255,0.15)" tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 11 }} />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="importance" fill="#0ea5e9" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </GlowingCard>
            </motion.div>

            {/* ROC Space */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <GlowingCard className="p-6 h-full" glowColor="#10b981">
                <h3 className="text-sm font-medium text-white/60 uppercase tracking-wider mb-4">
                  ROC Space
                </h3>
                <ResponsiveContainer width="100%" height={350}>
                  <ScatterChart>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" />
                    <XAxis type="number" dataKey="pofd" name="POFD" stroke="rgba(255,255,255,0.15)" tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 10 }} label={{ value: "POFD", position: "bottom", fill: "rgba(255,255,255,0.3)", fontSize: 11 }} />
                    <YAxis type="number" dataKey="pod" name="POD" stroke="rgba(255,255,255,0.15)" tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 10 }} label={{ value: "POD", angle: -90, position: "left", fill: "rgba(255,255,255,0.3)", fontSize: 11 }} />
                    <ZAxis type="number" dataKey="tss" range={[100, 400]} />
                    <Tooltip content={<CustomTooltip />} />
                    <Scatter data={rocData} fill="#06b6d4" />
                  </ScatterChart>
                </ResponsiveContainer>
              </GlowingCard>
            </motion.div>
          </div>

          {/* Confusion Matrix */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
          >
            <GlowingCard className="p-6" glowColor="#8b5cf6">
              <h3 className="text-sm font-medium text-white/60 uppercase tracking-wider mb-6">
                Confusion Matrix (normalized per 1000)
              </h3>
              <div className="max-w-md mx-auto">
                <div className="grid grid-cols-3 gap-1">
                  <div />
                  <div className="text-center text-xs text-white/40 pb-2">Pred Flare</div>
                  <div className="text-center text-xs text-white/40 pb-2">Pred Quiet</div>
                  <div className="text-xs text-white/40 flex items-center justify-end pr-2">Actual Flare</div>
                  <div className="bg-cyan-500/20 border border-cyan-500/30 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold font-mono text-cyan-400">{tp}</div>
                    <div className="text-[10px] text-white/30 mt-1">TP</div>
                  </div>
                  <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold font-mono text-red-400">{fn}</div>
                    <div className="text-[10px] text-white/30 mt-1">FN</div>
                  </div>
                  <div className="text-xs text-white/40 flex items-center justify-end pr-2">Actual Quiet</div>
                  <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold font-mono text-amber-400">{fp}</div>
                    <div className="text-[10px] text-white/30 mt-1">FP</div>
                  </div>
                  <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold font-mono text-emerald-400">{tn}</div>
                    <div className="text-[10px] text-white/30 mt-1">TN</div>
                  </div>
                </div>
              </div>
            </GlowingCard>
          </motion.div>
        </div>
      </AuroraBackground>
    </main>
  );
}
