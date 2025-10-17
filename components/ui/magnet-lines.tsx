"use client";
import { Card } from "@heroui/card";
import Image from "next/image";
import React, { useRef, useEffect, CSSProperties } from "react";

import SlackShotsLogo from "@/public/SSLOGO_NOBG.png";
import { useTheme } from "@/hooks/use-theme";

interface MagnetLinesProps {
  rows?: number;
  columns?: number;
  containerSize?: number;
  lineColor?: string;
  lineWidth?: string;
  lineHeight?: string;
  baseAngle?: number;
  className?: string;
  style?: CSSProperties;
}

const MagnetLines: React.FC<MagnetLinesProps> = ({
  rows = 5,
  columns = 9,
  containerSize = 40,
  lineWidth = "0.5vmin",
  lineHeight = "6vmin",
  baseAngle = -10,
  className = "",
  style = {},
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const { isDark } = useTheme();

  useEffect(() => {
    const container = containerRef.current;

    if (!container) return;

    const items = container.querySelectorAll<HTMLSpanElement>("span");

    const onPointerMove = (pointer: { x: number; y: number }) => {
      items.forEach((item) => {
        const rect = item.getBoundingClientRect();
        const centerX = rect.x + rect.width / 2;
        const centerY = rect.y + rect.height / 2;

        const b = pointer.x - centerX;
        const a = pointer.y - centerY;
        const c = Math.sqrt(a * a + b * b) || 1;
        const r =
          ((Math.acos(b / c) * 180) / Math.PI) * (pointer.y > centerY ? 1 : -1);

        item.style.setProperty("--rotate", `${r}deg`);
      });
    };

    const handlePointerMove = (e: PointerEvent) => {
      onPointerMove({ x: e.x, y: e.y });
    };

    window.addEventListener("pointermove", handlePointerMove);

    if (items.length) {
      const middleIndex = Math.floor(items.length / 2);
      const rect = items[middleIndex].getBoundingClientRect();

      onPointerMove({ x: rect.x, y: rect.y });
    }

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
    };
  }, []);

  const total = rows * columns;
  const spans = Array.from({ length: total }, (_, i) => (
    <span
      key={i}
      className="block origin-center bg-slate-900/90 dark:bg-slate-200/90"
      style={{
        backgroundColor: isDark ? "#fff" : "#000",
        width: lineWidth,
        height: lineHeight,
        //@ts-ignore
        "--rotate": `${baseAngle}deg`,
        transform: "rotate(var(--rotate))",
        willChange: "transform",
      }}
    />
  ));

  return (
    <Card
      ref={containerRef}
      className={`grid mx-auto w-full place-items-center drop-shadow-lg p-8 gap-1 text-foreground font-semibold border border-zinc-400/25 group relative shadow-[inset_0_-8px_10px_#8fdfff1f] whitespace-nowrap  ${className}`}
      style={{
        gridTemplateColumns: `repeat(${columns}, 1fr)`,
        gridTemplateRows: `repeat(${rows}, 1fr)`,
        width: `${2.5 * containerSize}vmin`,
        height: `${containerSize}vmin`,
        ...style,
      }}
    >
      <Image
        alt="SlackShots Logo"
        className="absolute -top-16 -right-8 blur-3xl scale-150 opacity-20 pointer-events-none"
        height={400}
        src={SlackShotsLogo}
        width={400}
      />
      {spans}
    </Card>
  );
};

export default MagnetLines;
