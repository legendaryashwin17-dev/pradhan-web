"use client";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface OrbitProps {
  radius: number;
  speed: number;
  color: string;
  children: React.ReactNode;
  className?: string;
}

export function Orbit({ radius, speed, color, children, className }: OrbitProps) {
  return (
    <div className={cn("absolute", className)} style={{ width: radius * 2, height: radius * 2, left: `calc(50% - ${radius}px)`, top: `calc(50% - ${radius}px)` }}>
      {/* Orbit ring */}
      <div className="absolute inset-0 rounded-full border border-white/[0.04]" />
      {/* Orbiting element */}
      <motion.div
        className="absolute"
        style={{ left: "50%", top: 0, transform: "translate(-50%, -50%)" }}
        animate={{ rotate: 360 }}
        transition={{ duration: speed, repeat: Infinity, ease: "linear" }}
      >
        <div style={{ transform: `rotate(0deg)`, color }}>
          {children}
        </div>
      </motion.div>
    </div>
  );
}

interface PulseRingProps {
  color: string;
  size: number;
  className?: string;
}

export function PulseRing({ color, size, className }: PulseRingProps) {
  return (
    <div className={cn("relative", className)} style={{ width: size, height: size }}>
      <motion.div
        className="absolute inset-0 rounded-full"
        style={{ border: `2px solid ${color}` }}
        animate={{ scale: [1, 1.5], opacity: [0.6, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
      />
      <motion.div
        className="absolute inset-0 rounded-full"
        style={{ border: `2px solid ${color}` }}
        animate={{ scale: [1, 1.3], opacity: [0.4, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeOut", delay: 0.5 }}
      />
      <div className="absolute inset-2 rounded-full" style={{ background: `radial-gradient(circle, ${color}30, ${color}05)` }} />
    </div>
  );
}

interface SolarFlareIndicatorProps {
  classType: "B" | "C" | "M" | "X";
  flux: number;
  className?: string;
}

const CLASS_CONFIG = {
  B: { color: "#64d2ff", label: "QUIET", glow: "rgba(100,210,255,0.4)", ring: "rgba(100,210,255,0.2)" },
  C: { color: "#30d158", label: "MODERATE", glow: "rgba(48,209,88,0.4)", ring: "rgba(48,209,88,0.2)" },
  M: { color: "#ff9f0a", label: "WARNING", glow: "rgba(255,159,10,0.4)", ring: "rgba(255,159,10,0.2)" },
  X: { color: "#ff2d55", label: "CRITICAL", glow: "rgba(255,45,85,0.4)", ring: "rgba(255,45,85,0.2)" },
};

export function SolarFlareIndicator({ classType, flux, className }: SolarFlareIndicatorProps) {
  const cfg = CLASS_CONFIG[classType];
  return (
    <div className={cn("flex items-center gap-4", className)}>
      <div className="relative">
        <PulseRing color={cfg.color} size={48} />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-4 h-4 rounded-full" style={{ background: cfg.color, boxShadow: `0 0 20px ${cfg.glow}` }} />
        </div>
      </div>
      <div>
        <div className="flex items-center gap-2">
          <span className="text-xl font-bold font-mono" style={{ color: cfg.color }}>{classType}-class</span>
          <span className="text-[10px] px-2 py-0.5 rounded-full border font-medium uppercase tracking-wider"
            style={{ color: cfg.color, borderColor: `${cfg.color}40`, background: `${cfg.color}10` }}>
            {cfg.label}
          </span>
        </div>
        <div className="text-sm text-white/40 font-mono mt-0.5">{flux.toExponential(2)} W/m²</div>
      </div>
    </div>
  );
}
