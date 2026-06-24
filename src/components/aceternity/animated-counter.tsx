"use client";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface AnimatedCounterProps {
  value: number;
  decimals?: number;
  duration?: number;
  prefix?: string;
  suffix?: string;
  className?: string;
  color?: string;
}

export function AnimatedCounter({
  value, decimals = 0, duration = 1500, prefix = "", suffix = "", className, color,
}: AnimatedCounterProps) {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    const start = display;
    const startTime = Date.now();
    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 4);
      setDisplay(start + (value - start) * eased);
      if (progress < 1) requestAnimationFrame(animate);
    };
    animate();
  }, [value, duration]);

  return (
    <span className={cn("font-mono tabular-nums", className)} style={{ color }}>
      {prefix}{display.toFixed(decimals)}{suffix}
    </span>
  );
}

interface StatBlockProps {
  label: string;
  value: number;
  decimals?: number;
  suffix?: string;
  color?: string;
  icon?: React.ReactNode;
  className?: string;
}

function formatFlux(v: number): string {
  if (v === 0) return "0.00";
  if (Math.abs(v) < 0.01) return v.toExponential(2);
  return v.toFixed(2);
}

export function StatBlock({ label, value, decimals = 0, suffix = "", color = "#06b6d4", icon, className }: StatBlockProps) {
  const displayValue = decimals <= 2 && Math.abs(value) < 0.01 ? formatFlux(value) : value.toFixed(decimals);
  return (
    <div className={cn(
      "relative overflow-hidden rounded-xl border border-white/[0.06] bg-white/[0.02] p-4",
      "hover:border-white/[0.12] transition-all duration-300 group",
      className
    )}>
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{ background: `radial-gradient(circle at 50% 50%, ${color}08, transparent 70%)` }} />
      <div className="relative z-10">
        <div className="flex items-center gap-2 mb-2">
          {icon && <span className="opacity-50">{icon}</span>}
          <span className="text-[10px] text-white/30 uppercase tracking-[0.15em] font-medium">{label}</span>
        </div>
        <div className="text-2xl font-bold font-mono" style={{ color }}>
          {displayValue}{suffix}
        </div>
      </div>
    </div>
  );
}

interface HeatmapCellProps {
  x: string;
  y: string;
  value: number;
  maxValue: number;
  colorScale?: (v: number) => string;
}

export function HeatmapCell({ x, y, value, maxValue, colorScale }: HeatmapCellProps) {
  const intensity = value / maxValue;
  const bg = colorScale
    ? colorScale(intensity)
    : `rgba(6, 182, 212, ${0.05 + intensity * 0.4})`;

  return (
    <div
      className="relative flex flex-col items-center justify-center p-2 rounded-lg border border-white/[0.04] hover:border-white/[0.12] transition-all duration-200 cursor-default group"
      style={{ background: bg }}
    >
      <div className="text-xs font-mono font-bold text-white">{value.toFixed(2)}</div>
      <div className="text-[9px] text-white/30 mt-0.5">{y}</div>
      <div className="absolute -top-6 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded bg-white/10 text-[9px] text-white/60 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
        {x} → {y}: {value.toFixed(4)}
      </div>
    </div>
  );
}
