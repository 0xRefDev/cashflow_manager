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

type Sale = {
  date: Date;
  amount: number;
  percentage: string;
  currency: string;
  growth: boolean;
};

const sales = [
  { date: "2023-04-30", amount: 4 },
  { date: "2023-05-01", amount: 6, percentage: "%", currency: "$", growth: false },
  { date: "2023-05-02", amount: 8, percentage: "%", currency: "$", growth: false },
  { date: "2023-05-03", amount: 7, percentage: "%", currency: "$", growth: false },
  { date: "2023-05-04", amount: 8, percentage: "%", currency: "$", growth: false },
  { date: "2023-05-05", amount: 12, percentage: "%", currency: "$", growth: false },
  { date: "2023-05-06", amount: 10.5, percentage: "%", currency: "$", growth: false },
  { date: "2023-05-07", amount: 6, percentage: "%", currency: "$", growth: false },
  { date: "2023-05-08", amount: 8, percentage: "%", currency: "$", growth: false },
  { date: "2023-05-09", amount: 7.5, percentage: "%", currency: "$", growth: false },
  { date: "2023-05-10", amount: 6, percentage: "%", currency: "$", growth: false },
  { date: "2023-05-11", amount: 8, percentage: "%", currency: "$", growth: false },
  { date: "2023-05-12", amount: 9, percentage: "%", currency: "$", growth: false },
  { date: "2023-05-13", amount: 10, percentage: "%", currency: "$", growth: false },
  { date: "2023-05-14", amount: 17, percentage: "%", currency: "$", growth: false },
  { date: "2023-05-15", amount: 14, percentage: "%", currency: "$", growth: false },
  { date: "2023-05-16", amount: 15, percentage: "%", currency: "$", growth: false },
  { date: "2023-05-17", amount: 20, percentage: "%", currency: "$", growth: false },
  { date: "2023-05-18", amount: 18, percentage: "%", currency: "$", growth: false },
  { date: "2023-05-19", amount: 16, percentage: "%", currency: "$", growth: false },
  { date: "2023-05-20", amount: 15, percentage: "%", currency: "$", growth: false },
  { date: "2023-05-21", amount: 16, percentage: "%", currency: "$", growth: false },
  { date: "2023-05-22", amount: 13, percentage: "%", currency: "$", growth: false },
  { date: "2023-05-23", amount: 11, percentage: "%", currency: "$", growth: false },
  { date: "2023-05-24", amount: 11, percentage: "%", currency: "$", growth: false },
  { date: "2023-05-25", amount: 13, percentage: "%", currency: "$", growth: false },
  { date: "2023-05-26", amount: 12, percentage: "%", currency: "$", growth: false },
  { date: "2023-05-27", amount: 9, percentage: "%", currency: "$", growth: false },
  { date: "2023-05-28", amount: 8, percentage: "%", currency: "$", growth: false },
  { date: "2023-05-29", amount: 10, percentage: "%", currency: "$", growth: false },
  { date: "2023-05-30", amount: 11, percentage: "%", currency: "$", growth: false },
  { date: "2023-05-31", amount: 8, percentage: "%", currency: "$", growth: false },
  { date: "2023-06-01", amount: 9, percentage: "%", currency: "$", growth: false },
  { date: "2023-06-02", amount: 10, percentage: "%", currency: "$", growth: false },
  { date: "2023-06-03", amount: 12, percentage: "%", currency: "$", growth: false },
  { date: "2023-06-04", amount: 13, percentage: "%", currency: "$", growth: false },
  { date: "2023-06-05", amount: 15, percentage: "%", currency: "$", growth: false },
  { date: "2023-06-06", amount: 13.5, percentage: "%", currency: "$", growth: false },
  { date: "2023-06-07", amount: 13, percentage: "%", currency: "$", growth: false },
  { date: "2023-06-08", amount: 13, percentage: "%", currency: "$", growth: false },
  { date: "2023-06-09", amount: 14, percentage: "%", currency: "$", growth: false },
  { date: "2023-06-10", amount: 13, percentage: "%", currency: "$", growth: false },
  { date: "2023-06-11", amount: 12.5, percentage: "%", currency: "$", growth: false },
];
const data: Sale[] = sales.map((d) => ({ ...d, date: new Date(d.date) }));

export function AnalyticsChart() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const xScale = scaleTime()
    .domain([data[0].date, data[data.length - 1].date])
    .range([0, 100]);

  const yScale = scaleLinear()
    .domain([0, max(data.map((d) => d.amount)) ?? 0])
    .range([100, 0]);

  const line = d3line<Sale>()
    .x((d) => xScale(d.date))
    .y((d) => yScale(d.amount))
    .curve(curveMonotoneX);

  const area = d3area<Sale>()
    .x((d) => xScale(d.date))
    .y0(yScale(0))
    .y1((d) => yScale(d.amount))
    .curve(curveMonotoneX);

  const areaPath = area(data);
  const d = line(data);

  if (!d) return null;

  return (
    <div
      className="relative z-10 h-72 w-full"
      style={
        {
          "--marginTop": "0px",
          "--marginRight": "0px",
          "--marginBottom": "0px",
          "--marginLeft": "25px",
        } as CSSProperties
      }
    >
      {/* Chart area */}
      <svg
        className="absolute inset-0
          h-[calc(100%-var(--marginTop)-var(--marginBottom))]
          w-full
          translate-y-(--marginTop)
          overflow-visible"
      >
        <svg
          viewBox="0 0 100 100"
          className="overflow-visible"
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
                  {/* Línea vertical al hacer hover */}
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
                  {/* Rect invisible para capturar hover */}
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
                  ${point.amount.toLocaleString("en-US")}
                </p>
              </TooltipContent>
            </ClientTooltip>
          ))}
        </svg>

        {/* Círculo del punto activo — SVG sin distorsión */}
        <svg
          className="absolute inset-0 w-full h-full overflow-visible"
          style={{ pointerEvents: "none" }}
        >
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

        {/* Y axis */}
        {/* <svg
          className="absolute inset-0
            h-[calc(100%-var(--marginTop)-var(--marginBottom))]
            translate-y-(--marginTop)
            overflow-visible"
        >
          <g className="translate-x-[98%]">
            {yScale
              .ticks(8)
              .map(yScale.tickFormat(8, "d"))
              .map((value, i) => {
                if (i < 1) return;
                return (
                  <text
                    key={i}
                    y={`${yScale(+value)}%`}
                    alignmentBaseline="middle"
                    textAnchor="end"
                    className="text-xs tabular-nums text-zinc-400 dark:text-zinc-100"
                    fill="currentColor"
                  >
                    {value}
                  </text>
                );
              })}
          </g>
        </svg> */}

        {/* X axis */}
        <svg
          className="absolute inset-0
            h-[calc(100%-var(--marginTop))]
            w-[calc(100%-var(--marginLeft)-var(--marginRight))]
            translate-x-(--marginLeft)
            translate-y-(--marginTop)
            overflow-visible"
        >
          {data.map((day, i) => {
            if (i % 6 !== 0 || i === 0 || i >= data.length - 3) return;
            return (
              <g
                key={i}
                className="overflow-visible text-zinc-500 dark:text-zinc-200 -translate-y-3"
              >
                <text
                  x={`${xScale(day.date)}%`}
                  y="100%"
                  textAnchor={
                    i === 0 ? "start" : i === data.length - 1 ? "end" : "middle"
                  }
                  fill="currentColor"
                  className="text-sm"
                >
                  {formatDate(day.date)}
                </text>
              </g>
            );
          })}
        </svg>
      </svg>
    </div>
  );
}