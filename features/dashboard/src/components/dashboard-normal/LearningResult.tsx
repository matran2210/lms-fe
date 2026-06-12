"use client";
import dynamic from "next/dynamic";
import dayjs from "dayjs";
import { useEffect, useMemo, useState } from "react";
import { ILearningResult, IMockTestResult, PROGRAM } from "@lms/core";
import { COURSE_TYPE, DATE_FORMAT } from "@lms/core";
import { IconEssentional } from "@lms/assets";
import { Tooltip } from "@lms/ui";
import { useFeature } from "@lms/contexts";

// Lazy load recharts — ~150KB gzipped, chỉ cần khi dashboard render chart
const RadarChartLazy = dynamic(
  () => import("./LearningResultChart"),
  {
    ssr: false
  },
)

const LearningResultTest = () => {
  const { dashboardApi, params, query } = useFeature()
  const { courseId } = params || query
  const [option, setOption] = useState<any>();
  const [chartData, setChartData] = useState<{ name: string; score: number }[]>([]);
  const avgPercent = useMemo(() => {
    if (!chartData.length) return 0;
    const sum = chartData.reduce((acc, d) => acc + (Number(d.score) || 0), 0);
    return Number((sum / chartData.length).toFixed(2));
  }, [chartData]);

  const courseInfo = JSON.parse(localStorage.getItem("courseInfo") as any);
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
            <RadarChartLazy
              chartData={chartData}
              avgPercent={avgPercent}
              isNormal={isNormal}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default LearningResultTest;
