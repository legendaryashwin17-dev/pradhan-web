"use client";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export const FloatingNav = ({
  items,
  className,
}: {
  items: { label: string; href: string; active?: boolean }[];
  className?: string;
}) => {
  return (
    <motion.div
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 200, damping: 20 }}
      className={cn(
        "fixed top-6 left-1/2 -translate-x-1/2 z-50",
        "flex items-center gap-1 px-2 py-2",
        "bg-white/5 backdrop-blur-xl border border-white/10 rounded-full",
        className
      )}
    >
      {items.map((item) => (
        <a
          key={item.label}
          href={item.href}
          className={cn(
            "px-4 py-2 text-sm font-medium rounded-full transition-all duration-200",
            item.active
              ? "bg-white/10 text-white"
              : "text-white/50 hover:text-white/80 hover:bg-white/5"
          )}
        >
          {item.label}
        </a>
      ))}
    </motion.div>
  );
};
