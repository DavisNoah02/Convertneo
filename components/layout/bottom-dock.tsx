"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Contact, House, Settings, WandSparkles } from "lucide-react";

import {
  motion,
  useMotionValue,
  useTransform,
  useSpring,
} from "framer-motion";

import { useEffect, useRef, useState } from "react";

type DockItem = {
  href: string;
  label: string;
  icon: React.ReactNode;
};

const items: DockItem[] = [
  { href: "/", label: "Home", icon: <House size={20} strokeWidth={1.75} /> },
  { href: "/converter", label: "Converter", icon: <WandSparkles size={20} strokeWidth={1.75} /> },
  { href: "/contact", label: "Contact", icon: <Contact size={20} strokeWidth={1.75} /> },
  { href: "/settings", label: "Settings", icon: <Settings size={20} strokeWidth={1.75} /> },
];

const BASE = 48;
const MAG = 72;
const DISTANCE = 120;

export default function BottomDock() {
  const pathname = usePathname();
  const mouseX = useMotionValue(Infinity);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);

  return (
    <>
      <style>{`
        @keyframes pip-in {
          from { transform: scale(0.4); opacity: 0; }
          to   { transform: scale(1); opacity: 1; }
        }
      `}</style>

      <nav
        onMouseMove={(e) => mouseX.set(e.clientX)}
        onMouseLeave={() => mouseX.set(Infinity)}
        className="pointer-events-none fixed inset-x-0 top-0 z-20 flex justify-center "
      >
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{
            opacity: 1,
            y: 0,
            marginTop: isScrolled ? 0 : 12,
            borderRadius: isScrolled ? 16 : 22,
            scale: isScrolled ? 0.92 : 1,
          }}
          transition={{ duration: 0.4 }}
          className={[
            "pointer-events-auto",
            "w-fit flex items-center justify-center",
            isScrolled ? "gap-1.5 px-2 py-1.5" : "gap-2 px-3 py-2",
            "bg-white/[0.82] dark:bg-zinc-900/80",
            "backdrop-blur-xl",
            "border border-white/60 dark:border-zinc-700/60",
            isScrolled
              ? "shadow-[0_2px_10px_rgba(0,0,0,.08),0_10px_24px_rgba(0,0,0,.12)]"
              : "shadow-[0_2px_8px_rgba(0,0,0,.06),0_12px_32px_rgba(0,0,0,.10)]",
          ].join(" ")}
        >
          {items.map((item) => {
            const ref = useRef<HTMLAnchorElement>(null);
            const active = isActive(item.href);

            // distance from cursor → center of icon
            const distance = useTransform(mouseX, (val) => {
              const bounds = ref.current?.getBoundingClientRect();
              if (!bounds) return DISTANCE;

              return val - (bounds.left + bounds.width / 2);
            });

            // map distance → size
            const width = useTransform(
              distance,
              [-DISTANCE, 0, DISTANCE],
              [BASE, MAG, BASE]
            );

            const scale = useSpring(width, {
              mass: 0.2,
              stiffness: 200,
              damping: 15,
            });

            return (
              <motion.div key={item.href} style={{ width: scale }}>
                <Link
                  ref={ref}
                  href={item.href}
                  className="group relative flex h-[58px] cursor-pointer flex-col items-center justify-center rounded-[12px] px-1"
                >
                  

                  {/* Icon */}
                  <motion.div
                    whileHover={{ y: -4, scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className={[
                      "transition-colors duration-200 group-hover:text-emerald-500 dark:group-hover:text-emerald-400",
                      active
                        ? "text-zinc-900 dark:text-white"
                        : "text-zinc-500 dark:text-zinc-400",
                    ].join(" ")}
                  >
                    {item.icon}
                  </motion.div>

                  {/* Label */}
                  <span className="text-[10px] opacity-70">{item.label}</span>

                  {/* Active pip */}
                  {active && (
                    <span
                      className="absolute bottom-[6px] h-[4px] w-[4px] rounded-full bg-emerald-500"
                      style={{
                        animation:
                          "pip-in 0.25s cubic-bezier(.34,1.56,.64,1) both",
                      }}
                    />
                  )}
                </Link>
              </motion.div>
            );
          })}
        </motion.div>
      </nav>
    </>
  );
}