"use client";
import { motion } from "framer-motion";
import { FloatingNav } from "@/components/aceternity/floating-nav";
import { AuroraBackground } from "@/components/aceternity/aurora-background";
import { GlowingCard, MetricCard } from "@/components/aceternity/glowing-card";
import { getFlareClass, getFlareColor, THRESHOLDS } from "@/lib/data";
import { useState, useEffect } from "react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  AreaChart, Area, ReferenceLine, BarChart, Bar
} from "recharts";

const NAV_ITEMS = [
  { label: "Home", href: "/" },
  { label: "Dashboard", href: "/dashboard" },
  { label: "Monitor", href: "/dashboard/monitor", active: true },
  { label: "Performance", href: "/dashboard/performance" },
  { label: "Configs", href: "/dashboard/configs" },
];

// Simulated 24h data
function generate24hData() {
  const data = [];
  const now = new Date();
  for (let i = 288; i >= 0; i--) {
    const t = new Date(now.getTime() - i * 5 * 60000);
    const base = 1e-7 + Math.random() * 5e-7;
    const flare = Math.random() > 0.95 ? base * (5 + Math.random() * 20) : base;
    data.push({
      time: t.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: false }),
      xrs_b: flare,
      xrs_a: flare * 0.6 + Math.random() * 1e-7,
      timestamp: t.getTime(),
    });
  }
  return data;
}

// Monthly stats
const MONTHLY_DATA = [
  { month: "Jan", c: 145, m: 23, x: 2 },
  { month: "Feb", c: 132, m: 18, x: 1 },
  { month: "Mar", c: 189, m: 31, x: 4 },
  { month: "Apr", c: 156, m: 22, x: 3 },
  { month: "May", c: 178, m: 28, x: 2 },
  { month: "Jun", c: 165, m: 25, x: 3 },
  { month: "Jul", c: 198, m: 35, x: 5 },
  { month: "Aug", c: 145, m: 19, x: 1 },
  { month: "Sep", c: 132, m: 16, x: 0 },
  { month: "Oct", c: 167, m: 24, x: 2 },
  { month: "Nov", c: 189, m: 30, x: 3 },
  { month: "Dec", c: 156, m: 21, x: 1 },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-space-800/95 backdrop-blur-xl border border-white/10 rounded-lg px-4 py-3">
      <div className="text-xs text-white/40 mb-1">{label}</div>
      {payload.map((p: any) => (
        <div key={p.name} className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: p.color }} />
          <span className="text-sm font-mono text-white">{p.value.toExponential?.(2) ?? p.value}</span>
        </div>
      ))}
    </div>
  );
};

export default function MonitorPage() {
  const [data, setData] = useState(generate24hData());
  const [selectedMonth, setSelectedMonth] = useState("All");

  const latest = data[data.length - 1];
  const flux = latest?.xrs_b ?? 0;
  const cls = getFlareClass(flux);
  const color = getFlareColor(flux);

  // Refresh data periodically
  useEffect(() => {
    const interval = setInterval(() => {
      setData((prev) => {
        const newData = [...prev.slice(1)];
        const now = new Date();
        const base = 1e-7 + Math.random() * 5e-7;
        const flare = Math.random() > 0.95 ? base * (5 + Math.random() * 20) : base;
        newData.push({
          time: now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: false }),
          xrs_b: flare,
          xrs_a: flare * 0.6 + Math.random() * 1e-7,
          timestamp: now.getTime(),
        });
        return newData;
      });
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <main className="min-h-screen">
      <FloatingNav items={NAV_ITEMS} />

      <AuroraBackground className="pt-28 pb-16 px-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-3xl font-bold text-white mb-1">Live Monitor</h1>
            <p className="text-white/40 text-sm">Real-time GOES X-ray flux monitoring</p>
          </motion.div>

          {/* Alert */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div
              className="flex items-center gap-3 px-5 py-3 rounded-xl border mb-8"
              style={{
                borderColor: `${color}30`,
                backgroundColor: `${color}08`,
              }}
            >
              <div className="w-2.5 h-2.5 rounded-full animate-pulse" style={{ backgroundColor: color }} />
              <span className="text-sm font-medium" style={{ color }}>
                {cls === "B" ? "QUIET" : cls === "C" ? "MODERATE" : cls === "M" ? "WARNING" : "EXTREME"} —
                {flux.toExponential(2)} W/m² — {new Date().toLocaleTimeString()}
              </span>
            </div>
          </motion.div>

          {/* Metrics Strip */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
          >
            <MetricCard label="XRS-B Flux" value={flux.toExponential(2)} unit="W/m²" color="#06b6d4" />
            <MetricCard label="XRS-A Flux" value={latest?.xrs_a.toExponential(2) ?? "—"} unit="W/m²" color="#0ea5e9" />
            <MetricCard label="Hard/Soft Ratio" value={(flux / (latest?.xrs_a || 1)).toFixed(2)} color="#8b5cf6" />
            <MetricCard label="Current Class" value={cls} color={color} />
          </motion.div>

          {/* 24h Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <GlowingCard className="p-6 mb-8" glowColor="#06b6d4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium text-white/60 uppercase tracking-wider">Last 24 Hours</h3>
                <div className="flex items-center gap-4 text-xs text-white/30">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-red-500" /> XRS-B
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-cyan-400" /> XRS-A
                  </span>
                </div>
              </div>
              <ResponsiveContainer width="100%" height={350}>
                <AreaChart data={data}>
                  <defs>
                    <linearGradient id="xrsb" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#dc2626" stopOpacity={0.15} />
                      <stop offset="95%" stopColor="#dc2626" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="xrsa" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.1} />
                      <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" />
                  <XAxis
                    dataKey="time"
                    stroke="rgba(255,255,255,0.15)"
                    tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 10 }}
                    interval="preserveStartEnd"
                  />
                  <YAxis
                    stroke="rgba(255,255,255,0.15)"
                    tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 10 }}
                    scale="log"
                    domain={[1e-9, 1e-4]}
                    tickFormatter={(v) => v.toExponential(0)}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <ReferenceLine y={1e-6} stroke="rgba(217,119,6,0.4)" strokeDasharray="3 3" label={{ value: "C", fill: "rgba(217,119,6,0.6)", fontSize: 10 }} />
                  <ReferenceLine y={1e-5} stroke="rgba(220,38,38,0.4)" strokeDasharray="3 3" label={{ value: "M", fill: "rgba(220,38,38,0.6)", fontSize: 10 }} />
                  <ReferenceLine y={1e-4} stroke="rgba(124,58,237,0.4)" strokeDasharray="3 3" label={{ value: "X", fill: "rgba(124,58,237,0.6)", fontSize: 10 }} />
                  <Area type="monotone" dataKey="xrs_b" stroke="#dc2626" strokeWidth={1.5} fill="url(#xrsb)" dot={false} />
                  <Area type="monotone" dataKey="xrs_a" stroke="#06b6d4" strokeWidth={1} fill="url(#xrsa)" dot={false} />
                </AreaChart>
              </ResponsiveContainer>
            </GlowingCard>
          </motion.div>

          {/* Monthly Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <GlowingCard className="p-6" glowColor="#0ea5e9">
              <h3 className="text-sm font-medium text-white/60 uppercase tracking-wider mb-4">
                Monthly Flare Counts (2024)
              </h3>
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={MONTHLY_DATA}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" />
                  <XAxis dataKey="month" stroke="rgba(255,255,255,0.15)" tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 11 }} />
                  <YAxis stroke="rgba(255,255,255,0.15)" tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 10 }} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="c" stackId="a" fill="#0ea5e9" name="C-class" radius={[0, 0, 0, 0]} />
                  <Bar dataKey="m" stackId="a" fill="#f59e0b" name="M-class" radius={[0, 0, 0, 0]} />
                  <Bar dataKey="x" stackId="a" fill="#dc2626" name="X-class" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </GlowingCard>
          </motion.div>
        </div>
      </AuroraBackground>
    </main>
  );
}
