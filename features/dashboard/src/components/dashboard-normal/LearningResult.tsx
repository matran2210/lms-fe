"use client";
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
  Tooltip as RTooltip,
} from "recharts";
import dayjs from "dayjs";
import { useEffect, useMemo, useRef, useState } from "react";
import { ILearningResult, IMockTestResult, PROGRAM } from "@lms/core";
import { COURSE_TYPE, DATE_FORMAT } from "@lms/core";
import { IconEssentional } from "@lms/assets";
import { Tooltip } from "@lms/ui";
import { useReponsive } from "@lms/hooks";
import { useFeature } from "@lms/contexts";

const LearningResultTest = () => {
  const { dashboardApi, params, query } = useFeature()
  const { courseId } = params || query
  const [option, setOption] = useState<any>();
  const [chartData, setChartData] = useState<{ name: string; score: number }[]>(
    [],
  );
  const containerRef = useRef<HTMLDivElement>(null);
  const tickTooltipRef = useRef<HTMLDivElement>(null);
  const avgPercent = useMemo(() => {
    if (!chartData.length) return 0;
    const sum = chartData.reduce((acc, d) => acc + (Number(d.score) || 0), 0);
    return Number((sum / chartData.length).toFixed(2));
  }, [chartData]);

  // Dot hiển thị trạng thái "active" luôn (vòng ngoài mờ + lõi)
  const ActiveDot = (props: any) => {
    const { cx, cy } = props;
    if (cx == null || cy == null) return null;
    return (
      <g>
        <circle
          cx={cx}
          cy={cy}
          r={5}
          fill="#6FD3B0"
          stroke="#FFFFFF"
          strokeWidth={2}
        />
      </g>
    );
  };
  const courseInfo = JSON.parse(localStorage.getItem("courseInfo") as any);
  const { isMobile } = useReponsive();

  const isNormal = courseInfo?.courseType == COURSE_TYPE.NORMAL_COURSE;
  const handleLearningResults = (
    data: ILearningResult[] | IMockTestResult | any,
  ) => {
    // if (data.mock_tests?.length == 1) setMockTestId(data.mock_tests[0].id);

    if (data.length) {
      let total = 0;
      // const hasLearning = data.some((e: ILearningResult) => e.score);
      // Tính max cho từng section
      const maxValues = data.map((result: any) => {
        const learning = result?.score || 0;
        const mock = result?.mock_test_score || 0;
        const fixed = Math.max(learning, mock, 100); // 10 là min để không bị quá nhỏ
        return fixed;
      });
      const indicator = data.map((e: ILearningResult, index: number) => {
        total += e.score;
        return {
          name: e?.short_name || e?.name,
          max: maxValues[index],
        };
      });
      const option = {
        title: {
          text: "",
        },
        // tooltip: {
        //   trigger: 'item',
        //   borderWidth: 0,
        //   borderRadius: 8,
        //   formatter: function (params: any) {
        //     const values = params.value
        //     const indicators = data?.map((e: ILearningResult) => e.name)
        //     let tooltipText = `<strong>${params.name}</strong><br/>`
        //     values.forEach((val: any, i: number) => {
        //       tooltipText += `<span class='text-[#404041] pt-3 me-3 ms-2'>●</span> ${indicators[i]}: ${val}%<br/>`
        //     })
        //     return tooltipText
        //   },
        // },
        graphic: {
          type: "group",
          left: "center",
          top: "middle",
          invisible: true,
          children: [
            {
              type: "rect",
              invisible: false,
              shape: {
                width: total ? 86 : 50,
                height: 30,
                r: 8,
              },
              style: {
                fill: "#fff",
                stroke: "#FFFFFF",
                lineWidth: 2,
                shadowColor: "rgba(0, 0, 0, 0.1)",
                shadowBlur: 10,
                align: "center",
                verticalAlign: "middle",
              },
              x: 0 - (total ? 43 : 25), // Half the width of the rectangle to center it
              y: 0 - 15, // Y position is still -15, to place it vertically centered
              z: 3,
            },
            {
              type: "text",
              invisible: false,
              style: {
                text: `${parseFloat((total / data.length).toFixed(2))}%`,
                fontSize: 20,
                fontWeight: 600,
                fill: "#6FD3B0",
                align: "center",
                verticalAlign: "middle",
              },
              x: 0,
              y: 0,
              z: 4,
            },
          ],
        },

        radar: [
          {
            shape: "circle", // Hình tròn
            radius: "80%",
            indicator,
            axisLine: {
              lineStyle: {
                color: "#D1D5DB", // đường trục
              },
            },
            splitLine: {
              lineStyle: {
                color: "#D1D5DB", // đường chia tròn
              },
            },
            splitArea: {
              areaStyle: {
                color: "transparent", // vùng nền giữa các vòng tròn
              },
            },
            name: {
              color: "#374151", // màu chữ (gray-700)
              fontSize: 14,
              fontWeight: "500",
              lineHeight: 22,
              formatter: function (name: string) {
                const maxLength = 10;
                return name.length > maxLength
                  ? name.slice(0, maxLength) + "…"
                  : name;
              },
            },
          },
        ],
        series: [
          {
            type: "radar",
            data: [
              {
                name: "Learning results",
                value: data?.map((result: { score: number }) => {
                  return result?.score;
                }),
                areaStyle: {
                  color: "rgba(111, 211, 176, 0.45)",
                },
                lineStyle: {
                  color: "#6FD3B0",
                  width: 1,
                },
                itemStyle: {
                  color: "#6FD3B0",
                },
              },
            ],
          },
        ],
      };

      // setHasLearning(hasLearning);
      setOption(option);
      setChartData(
        data.map((e: ILearningResult) => ({
          name: e?.short_name || e?.name,
          score: Number(e?.score || 0),
        })),
      );
    } else {
      setOption(null);
      setChartData([]);
    }
  };

  const getLearningResults = async (id: string) => {
    try {
      const res = await dashboardApi?.getLearningResults(id);

      if (res && res.success) handleLearningResults(res.data);
    } catch (error) {
      setOption(null);
    }
  };

  useEffect(() => {
    if (courseId)
      getLearningResults(courseId as string);
  }, [courseId]);

  const resultFormula =
    courseInfo?.category === PROGRAM.LD
      ? "% Results = Topic test (30%) + Final test (70%)"
      : courseInfo?.category === "ACCA"
        ? "%Results = Graded activities (70%) + Final test (30%)"
        : "%Results = Module test (40%) + Topic test (60%)";

  return (
    <div className="flex h-auto w-full rounded-2xl bg-white p-4 md:p-6">
      <div className="w-full">
        <div className="mb-6 flex items-center justify-between md:mb-5 md:pb-3">
          <div className="w-full items-center justify-between sm:flex lg:block 2xl:flex">
            <div className="flex">
              <div className="mb-2 min-w-fit text-lg font-semibold md:mb-0 md:text-xl">
                Your Learning Results
              </div>
              <Tooltip
                title={<div className="text-center">{resultFormula}</div>}
                placement="bottom"
              >
                <div className="ms-2">
                  <IconEssentional />
                </div>
              </Tooltip>
            </div>
            <div className="text-xs text-gray-400 md:text-sm">
              {`Last Update: ${dayjs().format(DATE_FORMAT.DATE_TIME_DASH)}`}
            </div>
          </div>
        </div>

        <div className="flex">
          {option && (
            <div className={`flex grow flex-col`}>
              <div
                className="relative grow focus:outline-none [&_*]:outline-none [&_*]:focus:outline-none"
                ref={containerRef}
                tabIndex={-1}
                style={{ outline: "none" }}
                onMouseDown={() =>
                  containerRef.current && containerRef.current.blur()
                }
                onFocus={(e) => (e.currentTarget as HTMLDivElement).blur()}
              >
                <ResponsiveContainer width="100%" height={isMobile ? 350 : 420}>
                  <RadarChart data={chartData} outerRadius="80%">
                    <PolarGrid
                      stroke="#D1D5DB"
                      gridType="circle"
                      radialLines={true}
                    />
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
                        const display = Number.isFinite(num)
                          ? `${Math.round(num)}%`
                          : `${value}`;
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
                        const display =
                          full.length > maxLength
                            ? full.slice(0, maxLength) + "…"
                            : full;
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
                              const rect =
                                containerRef.current?.getBoundingClientRect();
                              const tip = tickTooltipRef.current;
                              if (!rect || !tip) return;
                              tip.textContent = full;
                              tip.style.display = "block";
                              tip.style.left = `${evt.clientX - rect.left}px`;
                              tip.style.top = `${evt.clientY - rect.top - 12}px`;
                            }}
                            onMouseMove={(evt) => {
                              const rect =
                                containerRef.current?.getBoundingClientRect();
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
                    <PolarRadiusAxis
                      tick={false}
                      axisLine={false}
                      domain={[0, 100]}
                      tickCount={6}
                    />
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
                ) : (
                  <></>
                )}
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
          )}
        </div>
      </div>
    </div>
  );
};

export default LearningResultTest;
