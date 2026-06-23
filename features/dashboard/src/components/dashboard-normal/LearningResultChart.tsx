"use client";

import { useCallback, useMemo, useRef } from "react";
import type { EChartsOption, ECharts } from "echarts";
import { EChart } from "@lms/ui";
import { useReponsive } from "@lms/hooks";

interface IProps {
  chartData: { name: string; score: number }[];
  avgPercent: number;
  isNormal: boolean;
}

const MAX_LABEL_LENGTH = 10;
const truncateLabel = (name: string) =>
  name.length > MAX_LABEL_LENGTH
    ? name.slice(0, MAX_LABEL_LENGTH) + "…"
    : name;

// Kiểu tối thiểu cho radar coordinate system của echarts (không có trong type công khai)
interface RadarCoordSys {
  cx: number;
  cy: number;
  r: number;
  // angle (radian) của từng trục — dùng để tự tính trục gần con trỏ nhất.
  // KHÔNG dùng pointToData() của echarts vì nó có bug wraparound góc (chọn nhầm
  // trục ở các hướng cắt ±π với nhiều N) — đã kiểm chứng bằng mô phỏng.
  getIndicatorAxes(): { angle: number }[];
}

interface ZRMouseEvent {
  offsetX: number;
  offsetY: number;
}

const LearningResultChart = ({ chartData, avgPercent }: IProps) => {
  const { isMobile } = useReponsive();
  const tooltipRef = useRef<HTMLDivElement>(null);

  const labelFont = useMemo(
    () =>
      typeof document !== "undefined"
        ? getComputedStyle(document.body).fontFamily
        : 'var(--font-roboto), "Roboto", sans-serif',
    [],
  );

  const visualData = useMemo(() => {
    if (chartData.length <= 1) return chartData;
    return [chartData[0], ...chartData.slice(1).reverse()];
  }, [chartData]);

  // Đọc dữ liệu mới nhất trong handler (handler chỉ bind 1 lần)
  const visualDataRef = useRef(visualData);
  visualDataRef.current = visualData;

  const option = useMemo(() => {
    const indicator = visualData.map((d) => ({
      text: d.name,
      max: Math.max(d.score || 0, 100),
    }));

    return {
      radar: [
        {
          shape: "circle" as const,
          radius: "80%",
          splitNumber: 5,
          // Kéo nhãn trục gần radar hơn (mặc định 15)
          axisNameGap: 8,
          indicator,
          axisLine: { lineStyle: { color: "#D1D5DB" } },
          splitLine: { lineStyle: { color: "#D1D5DB" } },
          splitArea: { show: false },
          axisName: {
            color: "#374151",
            fontSize: 14,
            fontWeight: 500,
            fontFamily: labelFont,
            formatter: (name: string) => truncateLabel(name),
          },
        },
      ],
      series: [
        {
          type: "radar",
          symbol: "circle",
          symbolSize: 10,
          data: [
            {
              name: "Learning results",
              value: visualData.map((d) => d.score),
              areaStyle: { color: "rgba(111, 211, 176, 0.45)" },
              lineStyle: { color: "#6FD3B0", width: 1 },
              itemStyle: {
                color: "#6FD3B0",
                borderColor: "#FFFFFF",
                borderWidth: 2,
              },
            },
          ],
        },
      ],
    };
  }, [visualData, labelFont]);

  const handleChartReady = useCallback((chart: ECharts) => {
    const zr = chart.getZr?.();
    if (!zr) return;

    const hide = () => {
      const tip = tooltipRef.current;
      if (tip) tip.style.display = "none";
    };

    const showAt = (x: number, y: number) => {
      const tip = tooltipRef.current;
      if (!tip) return;
      const radarModel = (
        chart as unknown as {
          getModel?: () => {
            getComponent?: (
              mainType: string,
              idx: number,
            ) => { coordinateSystem?: RadarCoordSys } | undefined;
          };
        }
      ).getModel?.()?.getComponent?.("radar", 0);
      const radar = radarModel?.coordinateSystem;
      if (!radar) return hide();

      const dx = x - radar.cx;
      const dy = y - radar.cy;
      const dist = Math.sqrt(dx * dx + dy * dy);
      // Chỉ hiện trong vùng radar + vành nhãn (~1.3 lần bán kính)
      if (!(dist <= radar.r * 1.3)) return hide();

      // Tự tìm trục gần con trỏ nhất bằng khoảng-cách-góc vòng tròn (đúng wraparound)
      const axes = radar.getIndicatorAxes?.() ?? [];
      const cursorAngle = Math.atan2(-dy, dx);
      let idx = -1;
      let bestDiff = Infinity;
      for (let i = 0; i < axes.length; i++) {
        const delta = cursorAngle - axes[i].angle;
        const diff = Math.abs(Math.atan2(Math.sin(delta), Math.cos(delta)));
        if (diff < bestDiff) {
          bestDiff = diff;
          idx = i;
        }
      }
      const data = visualDataRef.current[idx];
      if (idx < 0 || !data) return hide();

      const num = Number(data.score);
      const display = Number.isFinite(num) ? `${Math.round(num)}%` : "0%";
      tip.innerHTML =
        `<div style="margin-bottom:2px;font-weight:600;font-size:16px;line-height:24px;color:#374151;">${data.name}</div>` +
        `<div style="font-size:14px;line-height:22px;color:#374151;">Progress: ${display}</div>`;
      tip.style.display = "block";

      const W = chart.getWidth();
      const H = chart.getHeight();
      const OFFSET = 12;
      const boxW = tip.offsetWidth;
      const boxH = tip.offsetHeight;
      let left = x + OFFSET;
      let top = y + OFFSET;
      if (left + boxW > W) left = x - OFFSET - boxW;
      if (left < 0) left = 0;
      if (top + boxH > H) top = y - OFFSET - boxH;
      if (top < 0) top = 0;
      tip.style.left = `${left}px`;
      tip.style.top = `${top}px`;
    };

    zr.on("mousemove", (e: ZRMouseEvent) => showAt(e.offsetX, e.offsetY));
    chart.on("globalout", hide);
  }, []);

  return (
    <div className="flex grow flex-col">
      <div className="relative grow">
        <EChart
          option={option as EChartsOption}
          onChartReady={handleChartReady}
          height={isMobile ? "350px" : "420px"}
          minHeight={isMobile ? "350px" : "420px"}
        />
        <div
          ref={tooltipRef}
          className="pointer-events-none absolute z-20 hidden bg-white"
          style={{
            borderRadius: 8,
            boxShadow: "0px 4px 16px 0px #00000014",
            padding: 12,
            maxWidth: 200,
            whiteSpace: "normal",
            wordBreak: "break-word",
          }}
        />
        {avgPercent ? (
          <div
            className="pointer-events-none absolute left-1/2 top-1/2 z-0 -translate-x-1/2 -translate-y-1/2"
            style={{ textAlign: "center" }}
          >
            <div className="rounded-md bg-white px-2 py-1 text-lg font-semibold text-[#6FD3B0] shadow-sm ring-1 ring-gray-200">
              {avgPercent}%
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default LearningResultChart;
