"use client";
import { motion } from "framer-motion";
import { FloatingNav } from "@/components/aceternity/floating-nav";
import { AuroraBackground } from "@/components/aceternity/aurora-background";
import { GlowingCard } from "@/components/aceternity/glowing-card";
import { StatBlock } from "@/components/aceternity/animated-counter";
import { SolarFlareIndicator, PulseRing } from "@/components/aceternity/solar-effects";
import { getFlareClass, getFlareColor, THRESHOLDS } from "@/lib/data";
import { useState, useEffect } from "react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  AreaChart, Area, ReferenceLine, BarChart, Bar, Cell
} from "recharts";
import { Activity, Wifi, Clock, RefreshCw } from "lucide-react";

const NAV = [
  { label: "Home", href: "/" },
  { label: "Dashboard", href: "/dashboard" },
  { label: "Monitor", href: "/dashboard/monitor", active: true },
  { label: "Performance", href: "/dashboard/performance" },
  { label: "Configs", href: "/dashboard/configs" },
];

function gen24h() {
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
      ts: t.getTime(),
    });
  }
  return data;
}

const MONTHLY = [
  { m: "Jan", c: 145, m_: 23, x: 2 }, { m: "Feb", c: 132, m_: 18, x: 1 },
  { m: "Mar", c: 189, m_: 31, x: 4 }, { m: "Apr", c: 156, m_: 22, x: 3 },
  { m: "May", c: 178, m_: 28, x: 2 }, { m: "Jun", c: 165, m_: 25, x: 3 },
  { m: "Jul", c: 198, m_: 35, x: 5 }, { m: "Aug", c: 145, m_: 19, x: 1 },
  { m: "Sep", c: 132, m_: 16, x: 0 }, { m: "Oct", c: 167, m_: 24, x: 2 },
  { m: "Nov", c: 189, m_: 30, x: 3 }, { m: "Dec", c: 156, m_: 21, x: 1 },
];

const TooltipBox = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-space-900/95 backdrop-blur-xl border border-white/10 rounded-xl px-4 py-3 shadow-2xl">
      <div className="text-xs text-white/40 mb-1.5 font-medium">{label}</div>
      {payload.map((p: any) => (
        <div key={p.name} className="flex items-center gap-2 text-sm">
          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: p.color }} />
          <span className="font-mono font-bold" style={{ color: p.color }}>
            {typeof p.value === "number" ? p.value.toExponential(2) : p.value}
          </span>
        </div>
      ))}
    </div>
  );
};

export default function MonitorPage() {
  const [data, setData] = useState(gen24h());
  const latest = data[data.length - 1];
  const flux = latest?.xrs_b ?? 0;
  const cls = getFlareClass(flux);
  const color = getFlareColor(flux);
  const [lastUpdate, setLastUpdate] = useState(new Date());

  useEffect(() => {
    const iv = setInterval(() => {
      setData((prev) => {
        const d = [...prev.slice(1)];
        const now = new Date();
        const base = 1e-7 + Math.random() * 5e-7;
        const flare = Math.random() > 0.95 ? base * (5 + Math.random() * 20) : base;
        d.push({ time: now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: false }), xrs_b: flare, xrs_a: flare * 0.6 + Math.random() * 1e-7, ts: now.getTime() });
        setLastUpdate(now);
        return d;
      });
    }, 15000);
    return () => clearInterval(iv);
  }, []);

  return (
    <main className="min-h-screen">
      <FloatingNav items={NAV} />
      <AuroraBackground className="pt-28 pb-16 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-white mb-1">Live Monitor</h1>
                <p className="text-white/40 text-sm">Real-time GOES X-ray flux monitoring</p>
              </div>
              <div className="flex items-center gap-4 text-xs text-white/30">
                <span className="flex items-center gap-1.5"><Wifi className="w-3 h-3 text-neon-green" /> LIVE</span>
                <span className="flex items-center gap-1.5"><Clock className="w-3 h-3" /> {lastUpdate.toLocaleTimeString()}</span>
                <button onClick={() => { setData(gen24h()); setLastUpdate(new Date()); }}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/[0.04] border border-white/[0.06] hover:bg-white/[0.08] transition-all">
                  <RefreshCw className="w-3 h-3" /> Refresh
                </button>
              </div>
            </div>
          </motion.div>

          {/* Alert */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <div className="flex items-center gap-4 px-6 py-4 rounded-2xl border mb-6 glow-cyan"
              style={{ borderColor: `${color}30`, background: `linear-gradient(135deg, ${color}08, transparent)` }}>
              <PulseRing color={color} size={40} />
              <SolarFlareIndicator classType={cls} flux={flux} />
              <div className="ml-auto text-right">
                <div className="text-[9px] text-white/25 uppercase tracking-wider">Last 24h Peak</div>
                <div className="text-lg font-bold font-mono" style={{ color }}>
                  {Math.max(...data.map((d) => d.xrs_b)).toExponential(2)}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Stats */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
            <StatBlock label="XRS-B Flux" value={flux} decimals={2} color="#ff2d55" icon={<Activity className="w-3 h-3" />} />
            <StatBlock label="XRS-A Flux" value={latest?.xrs_a ?? 0} decimals={2} color="#06b6d4" icon={<Activity className="w-3 h-3" />} />
            <StatBlock label="Hard/Soft Ratio" value={flux / (latest?.xrs_a || 1)} decimals={2} color="#8b5cf6" icon={<Activity className="w-3 h-3" />} />
            <StatBlock label="Peak (24h)" value={Math.max(...data.map((d) => d.xrs_b))} decimals={2} color="#ff9f0a" icon={<Activity className="w-3 h-3" />} />
          </motion.div>

          {/* 24h Chart */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <GlowingCard className="p-6 mb-6 scanlines" glowColor={color}>
              <div className="flex items-center justify-between mb-4">
                <div className="text-[10px] text-white/30 uppercase tracking-[0.15em] font-medium">Last 24 Hours — X-Ray Flux</div>
                <div className="flex items-center gap-5 text-xs">
                  <span className="flex items-center gap-1.5"><span className="w-2.5 h-0.5 rounded bg-neon-red" /> XRS-B</span>
                  <span className="flex items-center gap-1.5"><span className="w-2.5 h-0.5 rounded bg-neon-cyan" /> XRS-A</span>
                </div>
              </div>
              <ResponsiveContainer width="100%" height={380}>
                <AreaChart data={data}>
                  <defs>
                    <linearGradient id="rb" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#ff2d55" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#ff2d55" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="ra" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.15} />
                      <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" />
                  <XAxis dataKey="time" stroke="rgba(255,255,255,0.1)" tick={{ fill: "rgba(255,255,255,0.25)", fontSize: 10 }} interval="preserveStartEnd" />
                  <YAxis stroke="rgba(255,255,255,0.1)" tick={{ fill: "rgba(255,255,255,0.25)", fontSize: 10 }} scale="log" domain={[1e-9, 1e-4]} tickFormatter={(v) => v.toExponential(0)} />
                  <Tooltip content={<TooltipBox />} />
                  <ReferenceLine y={1e-6} stroke="#30d15840" strokeDasharray="4 4" label={{ value: "C", fill: "#30d158", fontSize: 10, position: "right" }} />
                  <ReferenceLine y={1e-5} stroke="#ff9f0a40" strokeDasharray="4 4" label={{ value: "M", fill: "#ff9f0a", fontSize: 10, position: "right" }} />
                  <ReferenceLine y={1e-4} stroke="#ff2d5540" strokeDasharray="4 4" label={{ value: "X", fill: "#ff2d55", fontSize: 10, position: "right" }} />
                  <Area type="monotone" dataKey="xrs_b" stroke="#ff2d55" strokeWidth={1.5} fill="url(#rb)" dot={false} activeDot={{ r: 4, fill: "#ff2d55", stroke: "#fff" }} />
                  <Area type="monotone" dataKey="xrs_a" stroke="#06b6d4" strokeWidth={1} fill="url(#ra)" dot={false} activeDot={{ r: 3, fill: "#06b6d4", stroke: "#fff" }} />
                </AreaChart>
              </ResponsiveContainer>
            </GlowingCard>
          </motion.div>

          {/* Monthly + Flux Distribution */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
              <GlowingCard className="p-6" glowColor="#30d158">
                <div className="text-[10px] text-white/30 uppercase tracking-[0.15em] mb-4 font-medium">Monthly Flare Counts (2024)</div>
                <ResponsiveContainer width="100%" height={280}>
                  <BarChart data={MONTHLY}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" />
                    <XAxis dataKey="m" stroke="rgba(255,255,255,0.1)" tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 11 }} />
                    <YAxis stroke="rgba(255,255,255,0.1)" tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 10 }} />
                    <Tooltip content={<TooltipBox />} />
                    <Bar dataKey="c" stackId="a" fill="#06b6d4" name="C-class" radius={[0, 0, 0, 0]} />
                    <Bar dataKey="m_" stackId="a" fill="#ff9f0a" name="M-class" radius={[0, 0, 0, 0]} />
                    <Bar dataKey="x" stackId="a" fill="#ff2d55" name="X-class" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </GlowingCard>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}>
              <GlowingCard className="p-6" glowColor="#8b5cf6">
                <div className="text-[10px] text-white/30 uppercase tracking-[0.15em] mb-4 font-medium">Flare Class Distribution</div>
                <div className="space-y-3">
                  {[
                    { cls: "B", count: 4521, pct: 57.9, color: "#64d2ff", desc: "Background" },
                    { cls: "C", count: 2847, pct: 36.5, color: "#30d158", desc: "Common" },
                    { cls: "M", count: 398, pct: 5.1, color: "#ff9f0a", desc: "Significant" },
                    { cls: "X", count: 37, pct: 0.5, color: "#ff2d55", desc: "Extreme" },
                  ].map((c) => (
                    <div key={c.cls} className="flex items-center gap-3 group">
                      <div className="w-8 text-center">
                        <span className="text-lg font-black font-mono" style={{ color: c.color }}>{c.cls}</span>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs text-white/40">{c.desc}</span>
                          <span className="text-xs font-mono" style={{ color: c.color }}>{c.count.toLocaleString()} ({c.pct}%)</span>
                        </div>
                        <div className="w-full h-2 bg-white/[0.04] rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${c.pct}%` }}
                            transition={{ duration: 1.5, delay: 0.5 }}
                            className="h-full rounded-full"
                            style={{ background: `linear-gradient(90deg, ${c.color}, ${c.color}60)` }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </GlowingCard>
            </motion.div>
          </div>
        </div>
      </AuroraBackground>
    </main>
  );
}
