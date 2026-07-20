"use client";

import { formatDate } from "@/lib/date";
import {
  scaleTime,
  scaleLinear,
  line as d3line,
  max,
  area as d3area,
  curveMonotoneX,
} from "d3";
import { CSSProperties, useState } from "react";
import { AnimatedArea } from "./AnimatedArea";
import {
  ClientTooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/app/helpers/ClientTooltip";

export type Sale = {
  date: string | Date;
  amount: number;
  percentage: string;
  currency: string;
  growth: boolean;
  type?: "income" | "expense";
};

function formatYAxis(value: number): string {
  if (value >= 1000) {
    const k = value / 1000;
    return `${k % 1 === 0 ? k : k.toFixed(1)}k`;
  }
  return `${value}`;
}

export function AnalyticsChart({ points = [] }: { points?: Sale[] }) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  type ChartDatum = Omit<Sale, "date"> & { date: Date };

  const data: ChartDatum[] = points.map((d) => ({
    ...d,
    date: new Date(d.date),
  }));

  if (data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full w-full text-white/40">
        <p className="text-lg">No movement data yet</p>
        <p className="text-sm mt-1">Add transactions to see your wealth evolution</p>
      </div>
    );
  }

  const xScale = scaleTime()
    .domain([data[0].date, data[data.length - 1].date])
    .range([0, 100]);

  const yScale = scaleLinear()
    .domain([0, max(data.map((d) => d.amount)) ?? 0])
    .range([100, 0]);

  const line = d3line<ChartDatum>()
    .x((d) => xScale(d.date))
    .y((d) => yScale(d.amount))
    .curve(curveMonotoneX);

  const area = d3area<ChartDatum>()
    .x((d) => xScale(d.date))
    .y0(yScale(0))
    .y1((d) => yScale(d.amount))
    .curve(curveMonotoneX);

  const areaPath = area(data);
  const d = line(data);

  if (!d) return null;

  const targetTicks = 6;
  const candidates =
    data.length <= targetTicks
      ? data.map((_, i) => i)
      : Array.from(
          { length: targetTicks },
          (_, k) => Math.round((k * (data.length - 1)) / (targetTicks - 1)),
        );

  const MIN_LABEL_GAP = 13;
  const xIndices: number[] = [];
  candidates.forEach((i, k) => {
    const isFirst = k === 0;
    const isLast = k === candidates.length - 1;
    const x = xScale(data[i].date);

    if (isFirst) {
      xIndices.push(i);
      return;
    }

    const lastX = xScale(data[xIndices[xIndices.length - 1]].date);
    if (x - lastX >= MIN_LABEL_GAP) {
      xIndices.push(i);
    } else if (isLast) {
      xIndices[xIndices.length - 1] = i;
    }
  });

  const plotBox: CSSProperties = {
    top: "var(--marginTop)",
    left: "var(--marginLeft)",
    width: "calc(100% - var(--marginLeft) - var(--marginRight))",
    height: "calc(100% - var(--marginTop) - var(--marginBottom))",
  };

  return (
    <div
      className="relative z-10 h-full w-full min-h-70"
      style={
        {
          "--marginTop": "16px",
          "--marginRight": "16px",
          "--marginBottom": "34px",
          "--marginLeft": "48px",
        } as CSSProperties
      }
    >
      {/* Plot area: line + area + gridlines + tooltips */}
      <svg className="absolute overflow-visible" style={plotBox}>
        <svg
          viewBox="0 0 100 100"
          className="overflow-visible h-full w-full"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="semiAreaGradient" x1="0" x2="0" y1="0" y2="1">
              <stop
                offset="0%"
                className="text-landing-primary/30 dark:text-landing-primary/40"
                stopColor="currentColor"
              />
              <stop
                offset="100%"
                className="text-landing-primary/0 dark:text-landing-primary/0"
                stopColor="currentColor"
              />
            </linearGradient>
          </defs>

          {/* Horizontal gridlines */}
          {yScale.ticks(5).map((v) => (
            <line
              key={`grid-${v}`}
              x1={0}
              x2={100}
              y1={yScale(v)}
              y2={yScale(v)}
              stroke="currentColor"
              strokeWidth={0.5}
              className="text-white/10"
              vectorEffect="non-scaling-stroke"
            />
          ))}

          <AnimatedArea>
            <path d={areaPath ?? undefined} fill="url(#semiAreaGradient)" />
            <path
              d={d}
              fill="none"
              className="text-[#00E85C] dark:text-[#00E85C]"
              stroke="currentColor"
              strokeWidth="2.3"
              vectorEffect="non-scaling-stroke"
            />
          </AnimatedArea>

          {data.map((point, index) => (
            <ClientTooltip key={index}>
              <TooltipTrigger>
                <g
                  className="group/tooltip"
                  onPointerEnter={() => setActiveIndex(index)}
                  onPointerLeave={() => setActiveIndex(null)}
                >
                  {/* Vertical guide on hover */}
                  <line
                    x1={xScale(point.date)}
                    y1={0}
                    x2={xScale(point.date)}
                    y2={100}
                    stroke="currentColor"
                    strokeWidth={1}
                    className="opacity-0 group-hover/tooltip:opacity-100 text-zinc-300 dark:text-zinc-600 transition-opacity"
                    vectorEffect="non-scaling-stroke"
                    style={{ pointerEvents: "none" }}
                  />
                  {/* Invisible capture rect */}
                  <rect
                    x={(() => {
                      const prevX =
                        index > 0
                          ? xScale(data[index - 1].date)
                          : xScale(point.date);
                      return (prevX + xScale(point.date)) / 2;
                    })()}
                    y={0}
                    width={(() => {
                      const prevX =
                        index > 0
                          ? xScale(data[index - 1].date)
                          : xScale(point.date);
                      const nextX =
                        index < data.length - 1
                          ? xScale(data[index + 1].date)
                          : xScale(point.date);
                      const leftBound = (prevX + xScale(point.date)) / 2;
                      const rightBound = (xScale(point.date) + nextX) / 2;
                      return rightBound - leftBound;
                    })()}
                    height={100}
                    fill="transparent"
                  />
                </g>
              </TooltipTrigger>
              <TooltipContent>
                <p className="text-sm font-medium text-white">
                  {formatDate(point.date)}
                </p>
                <p className="text-zinc-400 text-sm">
                  {point.currency}
                  {point.amount.toLocaleString("en-US")}
                  {point.type ? ` · ${point.type}` : ""}
                </p>
              </TooltipContent>
            </ClientTooltip>
          ))}
        </svg>
      </svg>

      {/* Active point indicator */}
      <svg className="absolute overflow-visible pointer-events-none" style={plotBox}>
        {activeIndex !== null && (
          <circle
            cx={`${xScale(data[activeIndex].date)}%`}
            cy={`${yScale(data[activeIndex].amount)}%`}
            r={4}
            fill="currentColor"
            className="text-[#00a241] dark:text-[#2dfc2d]"
          />
        )}
      </svg>

      {/* Y axis labels */}
      <svg
        className="absolute overflow-visible"
        style={{
          top: "var(--marginTop)",
          left: 0,
          width: "var(--marginLeft)",
          height: "calc(100% - var(--marginTop) - var(--marginBottom))",
        }}
      >
        {yScale.ticks(5).map((v) => (
          <text
            key={`y-${v}`}
            x={40}
            y={`${yScale(v)}%`}
            textAnchor="end"
            dominantBaseline="middle"
            className="text-[11px] tabular-nums text-zinc-500 dark:text-zinc-400"
            fill="currentColor"
          >
            {formatYAxis(v)}
          </text>
        ))}
      </svg>

      {/* X axis labels */}
      <svg
        className="absolute overflow-visible"
        style={{
          top: "calc(100% - var(--marginBottom))",
          left: "var(--marginLeft)",
          width: "calc(100% - var(--marginLeft) - var(--marginRight))",
          height: "var(--marginBottom)",
        }}
      >
        {xIndices.map((i) => {
          const day = data[i];
          const isFirst = i === xIndices[0];
          const isLast = i === xIndices[xIndices.length - 1];
          return (
            <text
              key={`x-${i}`}
              x={`${xScale(day.date)}%`}
              y="55%"
              textAnchor={isFirst ? "start" : isLast ? "end" : "middle"}
              dominantBaseline="middle"
              className="text-[11px] tabular-nums text-zinc-500 dark:text-zinc-400"
              fill="currentColor"
            >
              {formatDate(day.date)}
            </text>
          );
        })}
      </svg>
    </div>
  );
}
