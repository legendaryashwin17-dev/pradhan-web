"use client";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export const GlowingCard = ({
  children,
  className,
  glowColor = "#0ea5e9",
}: {
  children: React.ReactNode;
  className?: string;
  glowColor?: string;
}) => {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className={cn(
        "relative group rounded-xl border border-white/10 overflow-hidden",
        className
      )}
    >
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{
          background: `radial-gradient(400px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), ${glowColor}15, transparent 40%)`,
        }}
      />
      <div className="relative z-10">{children}</div>
    </motion.div>
  );
};

export const MetricCard = ({
  label,
  value,
  unit,
  color,
  className,
}: {
  label: string;
  value: string | number;
  unit?: string;
  color?: string;
  className?: string;
}) => {
  return (
    <GlowingCard className={cn("p-5", className)}>
      <div className="text-xs font-medium text-white/40 uppercase tracking-widest mb-2">
        {label}
      </div>
      <div className="flex items-baseline gap-1.5">
        <span
          className="text-3xl font-bold font-mono tabular-nums"
          style={{ color: color || "#ffffff" }}
        >
          {value}
        </span>
        {unit && (
          <span className="text-sm text-white/30 font-mono">{unit}</span>
        )}
      </div>
    </GlowingCard>
  );
};
