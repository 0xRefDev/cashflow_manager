"use client";

import { useRef, useState } from "react";
import { pie, arc, PieArcDatum } from "d3";
import { AnimatedSlice } from "@/components/app/charts/AnimatedSlice";

type Item = { name: string; value: number };

export const CASHFLOW_PALETTE = ["#3FFF8B", "#0F6DF3", "#81ECFF", "#6E9BFF", "#A3A363", "#B4CD46"];

type Tooltip = { name: string; value: number; x: number; y: number } | null;

export interface PieChartProps {
  data: Item[];
  total: number;
}

const MAX_LABEL_LENGTH = 3;

function truncateName(name: string) {
  return name.length > MAX_LABEL_LENGTH ? `${name.slice(0, MAX_LABEL_LENGTH)}..` : name;
}

export function PieChart({ data, total }: PieChartProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [tooltip, setTooltip] = useState<Tooltip>(null);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const radius = 430; // Chart base dimensions
  const gap = 0.015; // Gap between slices
  const lightStrokeEffect = 10; // 3d light effect around the slice

  // Pie layout and arc generator
  const pieLayout = pie<Item>()
    .value((d) => d.value)
    .padAngle(gap); // Creates a gap between slices

  // Adjust innerRadius to create a donut shape
  const innerRadius = radius / 1.625;
  const arcGenerator = arc<PieArcDatum<Item>>()
    .innerRadius(innerRadius)
    .outerRadius(radius)
    .cornerRadius(lightStrokeEffect + 2); // Apply rounded corners

  const labelRadius = radius * 0.825;
  const arcLabel = arc<PieArcDatum<Item>>().innerRadius(labelRadius).outerRadius(labelRadius);

  const arcs = pieLayout(data);

  // Calculate the angle for each slice
  function computeAngle(d: PieArcDatum<Item>) {
    return ((d.endAngle - d.startAngle) * 180) / Math.PI;
  }

  // Minimum angle to display text
  const minAngle = 10; // Adjust this value as needed

  function handleMouseMove(e: React.MouseEvent, d: PieArcDatum<Item>) {
    if (!containerRef.current) return;
    const bounds = containerRef.current.getBoundingClientRect();
    setTooltip({
      name: d.data.name,
      value: d.data.value,
      x: e.clientX - bounds.left,
      y: e.clientY - bounds.top,
    });
  }

  if (data.length === 0) {
    return (
      <div className="relative mt-4 w-full flex items-center justify-center h-full">
        <p className="text-[#ADAAAA] text-sm text-center">
          No wallet data to display yet.
        </p>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="relative mt-4 w-full">
      <div className="relative max-w-[16rem] mx-auto">
      <svg
        viewBox={`-${radius} -${radius} ${radius * 2} ${radius * 2}`}
        className="overflow-visible"
      >
        {/* Sectors with Gradient Fill and Stroke */}
        {arcs.map((d, i) => {
          const angle = computeAngle(d);
          const centroid = arcLabel.centroid(d);
          if (d.endAngle > Math.PI) {
            centroid[0] += 10;
            centroid[1] += 10;
          } else {
            centroid[0] -= 10;
            centroid[1] -= 0;
          }
          const isHovered = hoveredIndex === i;
          return (
            <AnimatedSlice key={i} index={i}>
              <path
                stroke="#ffffff33" // Lighter stroke for a 3D effect
                strokeWidth={lightStrokeEffect} // Adjust stroke width for the desired effect
                fill={CASHFLOW_PALETTE[i % CASHFLOW_PALETTE.length]}
                opacity={hoveredIndex === null || isHovered ? 1 : 0.45}
                style={{
                  cursor: "pointer",
                  transition: "opacity 0.2s ease",
                  transformOrigin: "center",
                }}
                d={arcGenerator(d) || undefined}
                onMouseEnter={() => setHoveredIndex(i)}
                onMouseMove={(e) => handleMouseMove(e, d)}
                onMouseLeave={() => {
                  setHoveredIndex(null);
                  setTooltip(null);
                }}
              />
              {/* Labels with conditional rendering */}
              <g opacity={angle > minAngle ? 1 : 0}>
                <text transform={`translate(${centroid})`} textAnchor="middle" fontSize={38}>
                  <tspan y="-0.4em" fontWeight="600" fill="#0A0A0A">
                    {truncateName(d.data.name)}
                  </tspan>
                  {angle > minAngle && (
                    <tspan x={0} y="0.7em" fillOpacity={0.7} fill="#0A0A0A">
                      {Math.round(d.data.value)}%
                    </tspan>
                  )}
                </text>
              </g>
            </AnimatedSlice>
          );
        })}
      </svg>

      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
        <p className="text-[#ADAAAA] text-[12px] uppercase tracking-wide">Total Balance</p>
        <p className="text-white font-semibold text-2xl">
          ${total.toLocaleString("en-US", { maximumFractionDigits: 2 })}
        </p>
      </div>
      </div>

      {tooltip && (
        <div
          className="absolute z-10 pointer-events-none px-3 py-2 rounded-lg bg-[#0A0A0A] border border-landing-primary/30 shadow-lg shadow-black/40 text-xs whitespace-nowrap -translate-x-1/2 -translate-y-[calc(100%+12px)]"
          style={{ left: tooltip.x, top: tooltip.y }}
        >
          <p className="font-semibold text-white">{tooltip.name}</p>
          <p className="text-landing-primary">{Math.round(tooltip.value)}%</p>
        </div>
      )}
    </div>
  );
}
