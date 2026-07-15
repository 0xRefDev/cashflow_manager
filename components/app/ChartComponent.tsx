import { createChart, ColorType, AreaSeries, LineType, CrosshairMode } from 'lightweight-charts';
import { useRef, useEffect, useMemo } from 'react';

export interface ChartTransaction {
  date: string;
  title: string;
  quantity: number;
  type: 'income' | 'expense';
}

interface ChartProps {
  transactions: ChartTransaction[];
  height?: number;
  colors?: {
    positiveColor?: string;
    negativeColor?: string;
    backgroundColor?: string;
    textColor?: string;
  };
}

interface DataPoint {
  time: string;
  value: number;
  transactionTitle: string;
  transactionType: 'income' | 'expense';
  transactionQuantity: number;
}

const formatDate = (dateStr: string): string => {
  const date = new Date(dateStr);
  return date.toLocaleDateString('es-ES', { month: 'short', day: 'numeric' });
};

const formatCurrency = (value: number, type: 'income' | 'expense', symbol: string = '$'): string => {
  const prefix = type === 'income' ? '+' : '-';
  return `${prefix}${symbol}${Math.abs(value).toLocaleString('es-ES', { minimumFractionDigits: 2 })}`;
};

export const ChartComponent = (props: ChartProps) => {
  const {
    transactions,
    height = 220,
    colors: {
      positiveColor = '#00E676',
      negativeColor = '#FF5252',
      backgroundColor = '#1A1A1A00',
      textColor = '#9CA3AF',
    } = {},
  } = props;

  const chartContainerRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  const { chartData, lineColor, areaTopColor, areaBottomColor } = useMemo(() => {
    if (!transactions || transactions.length === 0) {
      return {
        chartData: [],
        lineColor: positiveColor,
        areaTopColor: `${positiveColor}33`,
        areaBottomColor: `${positiveColor}00`,
      };
    }

    const groupedByDate = transactions.reduce<Record<string, { total: number; lastTitle: string; lastType: 'income' | 'expense'; lastQuantity: number }>>((acc, t) => {
      if (!acc[t.date]) {
        acc[t.date] = { total: 0, lastTitle: t.title, lastType: t.type, lastQuantity: t.quantity };
      }
      acc[t.date].total += t.type === 'income' ? t.quantity : -t.quantity;
      acc[t.date].lastTitle = t.title;
      acc[t.date].lastType = t.type;
      acc[t.date].lastQuantity = t.quantity;
      return acc;
    }, {});

    const sortedDates = Object.keys(groupedByDate).sort();
    const last7Dates = sortedDates.slice(-7);

    let runningBalance = 0;
    const processedData: DataPoint[] = last7Dates.map((date) => {
      const dayData = groupedByDate[date];
      runningBalance += dayData.total;
      return {
        time: date,
        value: runningBalance,
        transactionTitle: dayData.lastTitle,
        transactionType: dayData.lastType,
        transactionQuantity: Math.abs(dayData.lastQuantity),
      };
    });

    const finalBalance = processedData[processedData.length - 1]?.value ?? 0;
    const isPositive = finalBalance >= 0;

    const finalLineColor = isPositive ? positiveColor : negativeColor;
    const finalAreaTop = `${finalLineColor}33`;
    const finalAreaBottom = `${finalLineColor}00`;

    return {
      chartData: processedData,
      lineColor: finalLineColor,
      areaTopColor: finalAreaTop,
      areaBottomColor: finalAreaBottom,
    };
  }, [transactions, positiveColor, negativeColor]);

  useEffect(() => {
    if (!chartContainerRef.current || chartData.length === 0) return;

    const chart = createChart(chartContainerRef.current, {
      layout: {
        background: { type: ColorType.Solid, color: backgroundColor },
        textColor,
        attributionLogo: false
      },
      width: chartContainerRef.current.clientWidth,
      height,
      grid: {
        vertLines: { visible: false },
        horzLines: { visible: false },
      },
      crosshair: {
        mode: CrosshairMode.Normal,
        vertLine: {
          color: lineColor,
          width: 1,
          style: 2,
          labelBackgroundColor: lineColor,
        },
        horzLine: {
          color: lineColor,
          width: 1,
          style: 2,
          labelBackgroundColor: lineColor,
        },
      },
      rightPriceScale: {
        visible: false,
      },
      timeScale: {
        borderVisible: false,
        timeVisible: false,
        secondsVisible: false,
      },
    });

    const areaSeries = chart.addSeries(AreaSeries, {
      lineColor,
      topColor: areaTopColor,
      bottomColor: areaBottomColor,
      lineWidth: 2,
      lineType: LineType.Curved,
      priceFormat: {
        type: 'custom',
        formatter: (price: number) => {
          const prefix = price >= 0 ? '+' : '';
          return `${prefix}$${Math.abs(price).toLocaleString('es-ES', { minimumFractionDigits: 2 })}`;
        },
      },
    });

    areaSeries.setData(chartData);

    chart.timeScale().fitContent();

    const handleResize = () => {
      if (chartContainerRef.current) {
        chart.applyOptions({ width: chartContainerRef.current.clientWidth });
      }
    };

    chart.subscribeCrosshairMove((param) => {
      if (!tooltipRef.current || !param.point) {
        if (tooltipRef.current) {
          tooltipRef.current.style.display = 'none';
        }
        return;
      }

      const dataIndex = param.time
        ? chartData.findIndex((d) => d.time === param.time)
        : -1;

      if (dataIndex < 0) return;

      const dataPoint = chartData[dataIndex];
      const dateStr = formatDate(dataPoint.time);
      const amountStr = formatCurrency(
        dataPoint.transactionQuantity,
        dataPoint.transactionType
      );

      tooltipRef.current.innerHTML = `
                <div class="flex flex-col gap-1 text-xs">
                    <span class="text-[#9CA3AF]">${dateStr}</span>
                    <span class="font-medium text-white">${dataPoint.transactionTitle}</span>
                    <span class="${dataPoint.transactionType === 'income' ? 'text-green-400' : 'text-red-400'}">${amountStr}</span>
                </div>
            `;

      if (!chartContainerRef.current) return;
      const containerRect = chartContainerRef.current.getBoundingClientRect();
      const tooltipWidth = 140;
      let left = param.point.x - tooltipWidth / 2;

      if (left < 10) left = 10;
      if (left + tooltipWidth > containerRect.width - 10) {
        left = containerRect.width - tooltipWidth - 10;
      }

      tooltipRef.current.style.left = `${left}px`;
      tooltipRef.current.style.maxWidth = '120px';
      tooltipRef.current.style.whiteSpace = 'normal';
      tooltipRef.current.style.zIndex = '9999';
      tooltipRef.current.style.top = `${param.point.y - 70}px`;
      tooltipRef.current.style.display = 'block';
    });

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      chart.remove();
    };
  }, [chartData, lineColor, areaTopColor, areaBottomColor, backgroundColor, textColor]);

  return (
    <div className="relative w-full rounded-lg overflow-hidden">
      <div ref={chartContainerRef} className="w-full" />
      <div
        ref={tooltipRef}
        className="absolute z-9999 hidden pointer-events-none bg-[#1A1A1A]/95 backdrop-blur-sm border border-white/10 rounded-lg px-3 py-2 shadow-lg"
      />
    </div>
  );
};