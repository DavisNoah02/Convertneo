"use client";

import type { CSSProperties } from "react";
import { useEffect, useRef } from "react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";

export type BorderBeamProps = {
  /** Optional alias for light width, kept for compatibility with existing usage */
  size?: number;
  /** Width of the moving light beam in pixels */
  lightWidth?: number;
  /** Duration of one full loop in seconds */
  duration?: number;
  /** Beam color */
  lightColor?: string;
  /** Width of the static border frame in pixels */
  borderWidth?: number;
  className?: string;
  style?: CSSProperties;
};

export function BorderBeam({
  size,
  lightWidth = 200,
  duration = 10,
  lightColor = "#10b981",
  borderWidth = 1,
  className,
  style,
}: BorderBeamProps) {
  const pathRef = useRef<HTMLDivElement | null>(null);
  const effectiveLightWidth = size ?? lightWidth;

  useEffect(() => {
    const updatePath = () => {
      if (!pathRef.current) return;
      const div = pathRef.current;
      div.style.setProperty(
        "--path",
        `path("M 0 0 H ${div.offsetWidth} V ${div.offsetHeight} H 0 V 0")`
      );
    };

    updatePath();
    window.addEventListener("resize", updatePath);

    return () => {
      window.removeEventListener("resize", updatePath);
    };
  }, []);

  return (
    <div
      ref={pathRef}
      className={cn(
        "absolute z-0 h-full w-full rounded-[inherit]",
        "after:absolute after:inset-[var(--border-width)] after:rounded-[inherit] after:content-['']",
        "border-[length:var(--border-width)] ![mask-clip:padding-box,border-box]",
        "![mask-composite:intersect] [mask:linear-gradient(transparent,transparent),linear-gradient(red,red)]",
        "before:absolute before:inset-0 before:z-[-1] before:rounded-[inherit] before:border-[length:var(--border-width)] before:border-black/10 dark:before:border-white/10",
        className
      )}
      style={
        {
          "--duration": duration,
          "--border-width": `${borderWidth}px`,
          ...style,
        } as CSSProperties
      }
    >
      <motion.div
        className="absolute inset-0 aspect-square bg-[radial-gradient(ellipse_at_center,var(--light-color),transparent,transparent)]"
        style={
          {
            "--light-color": lightColor,
            "--light-width": `${effectiveLightWidth}px`,
            width: "var(--light-width)",
            offsetPath: "var(--path)",
          } as CSSProperties
        }
        animate={{
          offsetDistance: ["0%", "100%"],
        }}
        transition={{
          duration,
          repeat: Infinity,
          ease: "linear",
        }}
      />
    </div>
  );
}

