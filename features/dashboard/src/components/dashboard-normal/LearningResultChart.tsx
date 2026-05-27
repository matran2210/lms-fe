"use client";
/**
 * LearningResultChart — chứa toàn bộ recharts components
 * Được lazy load từ LearningResult.tsx để tránh bundle recharts vào initial JS
 */
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
  Tooltip as RTooltip,
} from "recharts";
import { useRef } from "react";
import { useReponsive } from "@lms/hooks";

interface IProps {
  chartData: { name: string; score: number }[];
  avgPercent: number;
  isNormal: boolean;
}

const ActiveDot = (props: any) => {
  const { cx, cy } = props;
  if (cx == null || cy == null) return null;
  return (
    <g>
      <circle cx={cx} cy={cy} r={5} fill="#6FD3B0" stroke="#FFFFFF" strokeWidth={2} />
    </g>
  );
};

const LearningResultChart = ({ chartData, avgPercent, isNormal }: IProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const tickTooltipRef = useRef<HTMLDivElement>(null);
  const { isMobile } = useReponsive();

  return (
    <div className={`flex grow flex-col`}>
      <div
        className="relative grow focus:outline-none [&_*]:outline-none [&_*]:focus:outline-none"
        ref={containerRef}
        tabIndex={-1}
        style={{ outline: "none" }}
        onMouseDown={() => containerRef.current && containerRef.current.blur()}
        onFocus={(e) => (e.currentTarget as HTMLDivElement).blur()}
      >
        <ResponsiveContainer width="100%" height={isMobile ? 350 : 420}>
          <RadarChart data={chartData} outerRadius="80%">
            <PolarGrid stroke="#D1D5DB" gridType="circle" radialLines={true} />
            <RTooltip
              cursor={{ stroke: "transparent" }}
              isAnimationActive={false}
              allowEscapeViewBox={{ x: false, y: false }}
              wrapperStyle={{
                outline: "none",
                maxWidth: 200,
                pointerEvents: "none",
                zIndex: 30,
              }}
              contentStyle={{
                borderRadius: 8,
                boxShadow: "0px 4px 16px 0px #00000014",
                whiteSpace: "normal",
                wordBreak: "break-word",
                padding: "12px",
                fontSize: 14,
                lineHeight: "22px",
                border: "unset",
              }}
              labelStyle={{
                marginBottom: 2,
                fontWeight: 600,
                fontSize: 16,
                lineHeight: "24px",
                color: "#374151",
              }}
              itemStyle={{
                padding: 0,
                margin: 0,
                fontSize: 14,
                lineHeight: "22px",
                color: "#374151",
              }}
              separator="Progress: "
              filterNull={true}
              offset={6}
              formatter={(value: any) => {
                const num = Number(value);
                const display = Number.isFinite(num) ? `${Math.round(num)}%` : `${value}`;
                return [display, ""];
              }}
              labelFormatter={(label: any) => String(label)}
            />
            <PolarAngleAxis
              dataKey="name"
              tick={(props: any) => {
                const { x, y, payload, textAnchor } = props;
                const full: string = payload?.value || "";
                const maxLength = 10;
                const display = full.length > maxLength ? full.slice(0, maxLength) + "…" : full;
                const adjustedY = y > 300 ? y + 10 : y;
                return (
                  <text
                    x={x}
                    y={adjustedY}
                    textAnchor={textAnchor}
                    fill="#374151"
                    fontSize={14}
                    fontWeight={500}
                    onMouseEnter={(evt) => {
                      const rect = containerRef.current?.getBoundingClientRect();
                      const tip = tickTooltipRef.current;
                      if (!rect || !tip) return;
                      tip.textContent = full;
                      tip.style.display = "block";
                      tip.style.left = `${evt.clientX - rect.left}px`;
                      tip.style.top = `${evt.clientY - rect.top - 12}px`;
                    }}
                    onMouseMove={(evt) => {
                      const rect = containerRef.current?.getBoundingClientRect();
                      const tip = tickTooltipRef.current;
                      if (!rect || !tip) return;
                      tip.style.left = `${evt.clientX - rect.left}px`;
                      tip.style.top = `${evt.clientY - rect.top - 12}px`;
                    }}
                    onMouseLeave={() => {
                      const tip = tickTooltipRef.current;
                      if (tip) tip.style.display = "none";
                    }}
                  >
                    {display}
                  </text>
                );
              }}
            />
            <PolarRadiusAxis tick={false} axisLine={false} domain={[0, 100]} tickCount={6} />
            <Radar
              name="Learning results"
              dataKey="score"
              stroke="#6FD3B0"
              fill="#6FD3B0"
              fillOpacity={0.45}
              strokeWidth={1}
              dot={<ActiveDot />}
              activeDot={<ActiveDot />}
            />
          </RadarChart>
        </ResponsiveContainer>
        <div
          ref={tickTooltipRef}
          className="pointer-events-none absolute z-20 hidden rounded-md bg-white px-2 py-1 text-xs text-gray-700 shadow ring-1 ring-gray-200"
          style={{ transform: "translate(-50%, -100%)" }}
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
      {isNormal && (
        <div className="flex items-center justify-center gap-2.5">
          <span className="min-h-3 min-w-3 rounded-full bg-[#6FD3B0]"></span>
          <span className="min-w-fit text-sm font-medium text-gray-800 xl:text-base">
            Learning results
          </span>
        </div>
      )}
    </div>
  );
};

export default LearningResultChart;
