"use client";
import dynamic from "next/dynamic";
import dayjs from "dayjs";
import { useEffect, useMemo, useState } from "react";
import { ILearningResult, IMockTestResult, PROGRAM } from "@lms/core";
import { COURSE_TYPE, DATE_FORMAT } from "@lms/core";
import { IconEssentional } from "@lms/assets";
import { Tooltip } from "@lms/ui";
import { useFeature } from "@lms/contexts";

// Lazy load chart component — echarts core đã được lazy-load bên trong EChart
const RadarChartLazy = dynamic(
  () => import("./LearningResultChart"),
  {
    ssr: false
  },
)

const LearningResultTest = () => {
  const { dashboardApi, params, query } = useFeature()
  const { courseId } = params || query
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
    if (data?.length) {
      setChartData(
        data.map((e: ILearningResult) => ({
          name: e?.short_name || e?.name,
          score: Number(e?.score || 0),
        })),
      );
    } else {
      setChartData([]);
    }
  };

  const getLearningResults = async (id: string) => {
    try {
      const res = await dashboardApi?.getLearningResults(id);

      if (res && res.success) handleLearningResults(res.data);
    } catch (error) {
      setChartData([]);
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
          {chartData.length > 0 && (
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
