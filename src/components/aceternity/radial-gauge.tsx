"use client";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

interface GaugeProps {
  value: number;
  max?: number;
  label: string;
  unit?: string;
  color?: string;
  glowColor?: string;
  size?: number;
  className?: string;
  showTick?: boolean;
}

export function RadialGauge({
  value, max = 1, label, unit, color = "#06b6d4", glowColor, size = 160, className, showTick = true,
}: GaugeProps) {
  const [animated, setAnimated] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const start = animated;
    const end = value;
    const duration = 1200;
    const startTime = Date.now();
    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setAnimated(start + (end - start) * eased);
      if (progress < 1) requestAnimationFrame(animate);
    };
    animate();
  }, [value]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const dpr = window.devicePixelRatio || 1;
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    ctx.scale(dpr, dpr);

    const cx = size / 2;
    const cy = size / 2;
    const r = size / 2 - 12;
    const startAngle = 0.75 * Math.PI;
    const endAngle = 2.25 * Math.PI;
    const totalArc = endAngle - startAngle;
    const valueAngle = startAngle + (animated / max) * totalArc;

    ctx.clearRect(0, 0, size, size);

    // Track
    ctx.beginPath();
    ctx.arc(cx, cy, r, startAngle, endAngle);
    ctx.strokeStyle = "rgba(255,255,255,0.06)";
    ctx.lineWidth = 8;
    ctx.lineCap = "round";
    ctx.stroke();

    // Ticks
    if (showTick) {
      for (let i = 0; i <= 10; i++) {
        const angle = startAngle + (i / 10) * totalArc;
        const inner = r - 6;
        const outer = r + 6;
        ctx.beginPath();
        ctx.moveTo(cx + Math.cos(angle) * inner, cy + Math.sin(angle) * inner);
        ctx.lineTo(cx + Math.cos(angle) * outer, cy + Math.sin(angle) * outer);
        ctx.strokeStyle = "rgba(255,255,255,0.12)";
        ctx.lineWidth = 1;
        ctx.stroke();
      }
    }

    // Value arc
    if (animated > 0) {
      ctx.beginPath();
      ctx.arc(cx, cy, r, startAngle, valueAngle);
      const grad = ctx.createLinearGradient(0, 0, size, size);
      grad.addColorStop(0, color);
      grad.addColorStop(1, glowColor || color);
      ctx.strokeStyle = grad;
      ctx.lineWidth = 8;
      ctx.lineCap = "round";
      ctx.stroke();

      // Glow
      ctx.shadowColor = color;
      ctx.shadowBlur = 15;
      ctx.beginPath();
      ctx.arc(cx, cy, r, valueAngle - 0.05, valueAngle);
      ctx.strokeStyle = color;
      ctx.lineWidth = 4;
      ctx.stroke();
      ctx.shadowBlur = 0;

      // Dot at end
      const dotX = cx + Math.cos(valueAngle) * r;
      const dotY = cy + Math.sin(valueAngle) * r;
      ctx.beginPath();
      ctx.arc(dotX, dotY, 5, 0, Math.PI * 2);
      ctx.fillStyle = color;
      ctx.fill();
      ctx.beginPath();
      ctx.arc(dotX, dotY, 3, 0, Math.PI * 2);
      ctx.fillStyle = "#fff";
      ctx.fill();
    }
  }, [animated, max, size, color, glowColor, showTick]);

  return (
    <div className={cn("flex flex-col items-center", className)}>
      <div className="relative" style={{ width: size, height: size }}>
        <canvas ref={canvasRef} style={{ width: size, height: size }} />
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-bold font-mono" style={{ color }}>
            {animated.toFixed(3)}
          </span>
          {unit && <span className="text-[10px] text-white/30 mt-0.5">{unit}</span>}
        </div>
      </div>
      <span className="text-[11px] text-white/40 uppercase tracking-widest mt-2 font-medium">{label}</span>
    </div>
  );
}
