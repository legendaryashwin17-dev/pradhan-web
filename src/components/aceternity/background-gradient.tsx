"use client";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

export const BackgroundGradient = ({
  children,
  className,
  containerClassName,
  animate = true,
}: {
  children: React.ReactNode;
  className?: string;
  containerClassName?: string;
  animate?: boolean;
}) => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div className={cn("relative p-[1px] overflow-hidden rounded-2xl", containerClassName)}>
      <div
        className="absolute inset-0 z-0"
        style={{
          background: animate
            ? `radial-gradient(600px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(14,165,233,0.15), transparent 40%)`
            : "radial-gradient(600px circle at 50% 50%, rgba(14,165,233,0.15), transparent 40%)",
        }}
      />
      <div className={cn("relative z-10 bg-black/80 backdrop-blur-xl", className)}>
        {children}
      </div>
    </div>
  );
};
