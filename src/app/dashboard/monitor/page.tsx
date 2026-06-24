"use client";
import { motion } from "framer-motion";
import { FloatingNav } from "@/components/aceternity/floating-nav";
import { AuroraBackground } from "@/components/aceternity/aurora-background";
import { GlowingCard } from "@/components/aceternity/glowing-card";
import { StatBlock } from "@/components/aceternity/animated-counter";
import { SolarFlareIndicator, PulseRing } from "@/components/aceternity/solar-effects";
import { getFlareClass, getFlareColor, THRESHOLDS } from "@/lib/data";
import { useState, useEffect, useMemo } from "react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  AreaChart, Area, ReferenceLine, BarChart, Bar
} from "recharts";
import { Activity, Wifi, Clock, RefreshCw, Sliders, Sun, Telescope, Satellite, Zap, TrendingUp } from "lucide-react";

const NAV = [
  { label: "Home", href: "/" },
  { label: "Dashboard", href: "/dashboard" },{ label: "Pipeline", href: "/dashboard/pipeline" },
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
      solexs: flare * 0.3 + Math.random() * 1e-7,
      hel1os: flare * 0.1 + Math.random() * 1e-7,
      ts: t.getTime(),
    });
  }
  return data;
}

const TooltipBox = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-space-900/95 backdrop-blur-xl border border-white/10 rounded-xl px-4 py-3 shadow-2xl">
      <div className="text-xs text-white/40 mb-1.5 font-medium">{label}</div>
      {payload.map((p: any) => (
        <div key={p.name} className="flex items-center gap-2 text-sm">
          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: p.color }} />
          <span className="text-white/50 text-xs">{p.name}</span>
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
  const [sensitivity, setSensitivity] = useState(0.5);
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
        d.push({
          time: now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: false }),
          xrs_b: flare,
          xrs_a: flare * 0.6 + Math.random() * 1e-7,
          solexs: flare * 0.3 + Math.random() * 1e-7,
          hel1os: flare * 0.1 + Math.random() * 1e-7,
          ts: now.getTime(),
        });
        setLastUpdate(now);
        return d;
      });
    }, 15000);
    return () => clearInterval(iv);
  }, []);

  // Multi-horizon forecast (sensitivity-adjusted)
  const forecasts = useMemo(() => {
    const base = Math.min(flux * 1e6, 0.99);
    const adj = base * (0.8 + 0.4 * sensitivity);
    return [
      { horizon: "15 min", prob: Math.min(adj * 1.2, 0.99), color: "#3b82f6" },
      { horizon: "30 min", prob: Math.min(adj, 0.99), color: "#a855f7" },
      { horizon: "60 min", prob: Math.min(adj * 0.8, 0.99), color: "#22c55e" },
    ];
  }, [flux, sensitivity]);

  // Sensitivity label
  const sensLabel = sensitivity < 0.3 ? "Conservative" : sensitivity < 0.7 ? "Balanced" : "Aggressive";
  const sensColor = sensitivity < 0.3 ? "#30d158" : sensitivity < 0.7 ? "#ff9f0a" : "#ff2d55";

  return (
    <main className="min-h-screen">
      <FloatingNav items={NAV} />
      <AuroraBackground className="pt-28 pb-16 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-white mb-1">Live Monitor</h1>
                <p className="text-white/40 text-sm">GOES-18 + HEL1OS + SOLEXS multi-instrument monitoring</p>
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

          {/* Stats + Threshold Dial */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 mb-6">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
              className="lg:col-span-4 grid grid-cols-2 md:grid-cols-4 gap-3">
              <StatBlock label="XRS-B Flux" value={flux} decimals={2} color="#ff2d55" icon={<Activity className="w-3 h-3" />} />
              <StatBlock label="XRS-A Flux" value={latest?.xrs_a ?? 0} decimals={2} color="#06b6d4" icon={<Activity className="w-3 h-3" />} />
              <StatBlock label="Hard/Soft Ratio" value={flux / (latest?.xrs_a || 1)} decimals={2} color="#8b5cf6" icon={<Activity className="w-3 h-3" />} />
              <StatBlock label="Peak (24h)" value={Math.max(...data.map((d) => d.xrs_b))} decimals={2} color="#ff9f0a" icon={<Activity className="w-3 h-3" />} />
            </motion.div>

            {/* Threshold Dial */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
              className="lg:col-span-1">
              <GlowingCard className="p-4 h-full" glowColor={sensColor}>
                <div className="flex items-center gap-2 mb-3">
                  <Sliders className="w-4 h-4" style={{ color: sensColor }} />
                  <h3 className="text-xs font-bold text-white">Sensitivity</h3>
                </div>
                <div className="text-center mb-2">
                  <span className="text-2xl font-black font-mono" style={{ color: sensColor }}>
                    {Math.round(sensitivity * 100)}%
                  </span>
                  <p className="text-[10px] mt-1" style={{ color: sensColor }}>{sensLabel}</p>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={sensitivity}
                  onChange={(e) => setSensitivity(parseFloat(e.target.value))}
                  className="w-full h-1.5 rounded-full appearance-none cursor-pointer"
                  style={{
                    background: `linear-gradient(to right, #30d158, #ff9f0a, #ff2d55)`,
                  }}
                />
                <div className="flex justify-between text-[9px] text-white/30 mt-1">
                  <span>Fewer false alarms</span>
                  <span>More detections</span>
                </div>
              </GlowingCard>
            </motion.div>
          </div>

          {/* Multi-Horizon Forecast */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
            className="mb-6">
            <GlowingCard className="p-5" glowColor="#a855f7">
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="w-4 h-4 text-cyan-400" />
                <h3 className="text-sm font-bold text-white">Multi-Horizon Forecast</h3>
                <span className="text-[10px] text-white/30 ml-2">P(flare in N minutes) — adjusted by sensitivity</span>
              </div>
              <div className="grid grid-cols-3 gap-4">
                {forecasts.map((f) => (
                  <div key={f.horizon} className="text-center">
                    <p className="text-[10px] text-white/40 uppercase tracking-wider mb-1">{f.horizon}</p>
                    <div className="relative w-full h-3 bg-white/5 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${f.prob * 100}%` }}
                        transition={{ duration: 1 }}
                        className="h-full rounded-full"
                        style={{ backgroundColor: f.color }}
                      />
                    </div>
                    <p className="text-lg font-bold font-mono mt-1" style={{ color: f.color }}>
                      {(f.prob * 100).toFixed(1)}%
                    </p>
                  </div>
                ))}
              </div>
            </GlowingCard>
          </motion.div>

          {/* Multi-Instrument Light Curves */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <GlowingCard className="p-6 mb-6 scanlines" glowColor={color}>
              <div className="flex items-center justify-between mb-4">
                <div className="text-[10px] text-white/30 uppercase tracking-[0.15em] font-medium">Multi-Instrument Light Curves</div>
                <div className="flex items-center gap-4 text-xs">
                  <span className="flex items-center gap-1.5"><Sun className="w-3 h-3" style={{ color: "#ff2d55" }} /> GOES-18 XRS-B</span>
                  <span className="flex items-center gap-1.5"><Sun className="w-3 h-3" style={{ color: "#06b6d4" }} /> GOES-18 XRS-A</span>
                  <span className="flex items-center gap-1.5"><Satellite className="w-3 h-3" style={{ color: "#22c55e" }} /> SOLEXS (Aditya-L1)</span>
                  <span className="flex items-center gap-1.5"><Telescope className="w-3 h-3" style={{ color: "#a855f7" }} /> HEL1OS (Aditya-L1)</span>
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
                    <linearGradient id="sx" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#22c55e" stopOpacity={0.15} />
                      <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="hl" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#a855f7" stopOpacity={0.15} />
                      <stop offset="95%" stopColor="#a855f7" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" />
                  <XAxis dataKey="time" stroke="rgba(255,255,255,0.1)" tick={{ fill: "rgba(255,255,255,0.25)", fontSize: 10 }} interval="preserveStartEnd" />
                  <YAxis stroke="rgba(255,255,255,0.1)" tick={{ fill: "rgba(255,255,255,0.25)", fontSize: 10 }} scale="log" domain={[1e-9, 1e-4]} tickFormatter={(v) => v.toExponential(0)} />
                  <Tooltip content={<TooltipBox />} />
                  <ReferenceLine y={1e-6} stroke="#30d15840" strokeDasharray="4 4" label={{ value: "C", fill: "#30d158", fontSize: 10, position: "right" }} />
                  <ReferenceLine y={1e-5} stroke="#ff9f0a40" strokeDasharray="4 4" label={{ value: "M", fill: "#ff9f0a", fontSize: 10, position: "right" }} />
                  <ReferenceLine y={1e-4} stroke="#ff2d5540" strokeDasharray="4 4" label={{ value: "X", fill: "#ff2d55", fontSize: 10, position: "right" }} />
                  <Area type="monotone" dataKey="xrs_b" name="GOES XRS-B" stroke="#ff2d55" strokeWidth={1.5} fill="url(#rb)" dot={false} activeDot={{ r: 4, fill: "#ff2d55", stroke: "#fff" }} />
                  <Area type="monotone" dataKey="xrs_a" name="GOES XRS-A" stroke="#06b6d4" strokeWidth={1} fill="url(#ra)" dot={false} activeDot={{ r: 3, fill: "#06b6d4", stroke: "#fff" }} />
                  <Area type="monotone" dataKey="solexs" name="SOLEXS" stroke="#22c55e" strokeWidth={1} fill="url(#sx)" dot={false} activeDot={{ r: 3, fill: "#22c55e", stroke: "#fff" }} />
                  <Area type="monotone" dataKey="hel1os" name="HEL1OS" stroke="#a855f7" strokeWidth={1} fill="url(#hl)" dot={false} activeDot={{ r: 3, fill: "#a855f7", stroke: "#fff" }} />
                </AreaChart>
              </ResponsiveContainer>
            </GlowingCard>
          </motion.div>

          {/* Monthly + Instrument Status */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}>
              <GlowingCard className="p-6" glowColor="#30d158">
                <div className="text-[10px] text-white/30 uppercase tracking-[0.15em] mb-4 font-medium">Monthly Flare Counts (2026)</div>
                <ResponsiveContainer width="100%" height={280}>
                  <BarChart data={[
                    { m: "Apr", c: 45, m_: 8, x: 1 },
                    { m: "May", c: 62, m_: 12, x: 2 },
                    { m: "Jun", c: 38, m_: 6, x: 0 },
                  ]}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" />
                    <XAxis dataKey="m" stroke="rgba(255,255,255,0.1)" tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 11 }} />
                    <YAxis stroke="rgba(255,255,255,0.1)" tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 10 }} />
                    <Tooltip content={<TooltipBox />} />
                    <Bar dataKey="c" stackId="a" fill="#06b6d4" name="C-class" />
                    <Bar dataKey="m_" stackId="a" fill="#ff9f0a" name="M-class" />
                    <Bar dataKey="x" stackId="a" fill="#ff2d55" name="X-class" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </GlowingCard>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
              <GlowingCard className="p-6" glowColor="#8b5cf6">
                <div className="text-[10px] text-white/30 uppercase tracking-[0.15em] mb-4 font-medium">Instrument Status</div>
                <div className="space-y-3">
                  {[
                    { name: "GOES-18 XRS", status: "Online", color: "#3b82f6", icon: Sun, desc: "1-min cadence, 0.5-8 A" },
                    { name: "HEL1OS", status: "Online", color: "#a855f7", icon: Telescope, desc: "5-band HXR, 10-150 keV" },
                    { name: "SOLEXS", status: "Online", color: "#22c55e", icon: Satellite, desc: "10-sec cadence, X-ray" },
                    { name: "HMI/SHARP", status: "Online", color: "#ef4444", icon: Zap, desc: "12-min, 7 magnetic params" },
                  ].map((inst) => {
                    const Icon = inst.icon;
                    return (
                      <div key={inst.name} className="flex items-center gap-3 p-3 rounded-lg bg-white/[0.02] border border-white/[0.04]">
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${inst.color}15` }}>
                          <Icon className="w-4 h-4" style={{ color: inst.color }} />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium text-white">{inst.name}</span>
                            <span className="w-1.5 h-1.5 rounded-full bg-green-400" />
                            <span className="text-[10px] text-green-400">{inst.status}</span>
                          </div>
                          <p className="text-[10px] text-white/40">{inst.desc}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </GlowingCard>
            </motion.div>
          </div>
        </div>
      </AuroraBackground>
    </main>
  );
}
