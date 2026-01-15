import { IconEssentional, MatchFailIcon, SuccessMatchIcon } from "@lms/assets";
import { useFeature } from "@lms/contexts";
import {
  ANIMATION,
  COURSE_TYPE,
  DATE_FORMAT,
  ILearningResult,
  IMockTestResult,
  PROGRAM,
} from "@lms/core";
import { useReponsive } from "@lms/hooks";
import { EChart, NoData, Tooltip } from "@lms/ui";
import dayjs from "dayjs";
import { EChartsOption } from "echarts";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

interface CourseInfo {
  courseType: string;
  category: string;
}

interface MockTestResponse {
  success: boolean;
  data: {
    reports: ILearningResult[];
    mock_tests: Array<{ id: string }>;
  };
}

interface TooltipParams {
  value: number[];
  name: string;
}

const LearningResults = () => {
  const [results, setResults] = useState<ILearningResult[] | IMockTestResult[]>(
    [],
  );
  const {query, params, dashboardApi} = useFeature()
  const {courseId } = params || query
  const [isLoading, setIsLoading] = useState<boolean>(true);
  // const [hasLearning, setHasLearning] = useState<boolean>(false);
  const [mockTestId, setMockTestId] = useState<string>("");
  const courseInfo = useMemo(
    () =>
      JSON.parse(localStorage.getItem("courseInfo") as string) as CourseInfo,
    [],
  );
  const isNormal = courseInfo?.courseType == COURSE_TYPE.NORMAL_COURSE;
  const resultFormula =
    courseInfo?.category === PROGRAM.LD
      ? "% Results = Topic test (30%) + Final test (70%)"
      : courseInfo?.category === "ACCA"
        ? "%Results = Graded activities (70%) + Final test (30%)"
        : "%Results = Module test (40%) + Topic test (60%)";

  const { isMobile, isTablet } = useReponsive();

  useEffect(() => {
    const getLearningResults = async (id: string) => {
      try {
        const res = (await dashboardApi?.getMockTestResults(
          id,
        )) as MockTestResponse;
        if (res && res.success) {
          const data = res.data.reports;
          setResults(data);
          // setHasLearning(data.some((e: ILearningResult) => e.score));
          if (!isNormal && res.data.mock_tests?.length === 1) {
            setMockTestId(res.data.mock_tests[0].id);
          }
        }
      } catch (error) {
        setResults([]);
      } finally {
        setIsLoading(false);
      }
    };
    if (courseId)
      getLearningResults(courseId as string);
  }, [courseId, isNormal]);

  const option = useMemo(() => {
    if (!results || results.length === 0) return null;
    const maxValues = results.map(
      (result: ILearningResult | IMockTestResult) => {
        const learning = "score" in result ? result.score : 0;
        const mock =
          "mock_test_score" in result ? result.mock_test_score || 0 : 0;
        return Math.max(learning, mock, 100);
      },
    );
    const indicator = results.map(
      (result: ILearningResult | IMockTestResult, idx: number) => ({
        text:
          "short_name" in result
            ? result.short_name || ""
            : "name" in result
              ? (result as IMockTestResult)?.name
              : "",
        max: maxValues[idx],
      }),
    );
    return {
      title: { text: "" },
      responsive: true,
      tooltip: {
        borderWidth: 0,
        trigger: "item",
        formatter: function (params: TooltipParams) {
          const values = params.value;
          const indicators = results.map(
            (e: ILearningResult | IMockTestResult) =>
              "name" in e ? e.name : (e as ILearningResult)?.short_name,
          );
          let tooltipText = `<strong>${params.name}</strong><br/>`;
          values.forEach((val: number, i: number) => {
            tooltipText += `<span class='text-[#7086FD]'>●</span> ${indicators[i]}: ${val}%<br/>`;
          });
          return tooltipText;
        },
      },
      radar: [
        {
          shape: "circle",
          radius: "75%",
          indicator,
          axisLine: { lineStyle: { color: "#D1D5DB" } },
          splitLine: { lineStyle: { color: "#D1D5DB" } },
          splitArea: { areaStyle: { color: "transparent" } },
          name: {
            color: "#374151",
            fontSize: isMobile ? 12 : 14,
            fontWeight: "500",
            lineHeight: isMobile ? 20 : 22,
            formatter: function (name: string) {
              const maxLength = 16;
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
              value: results?.map(
                (result: ILearningResult | IMockTestResult) =>
                  "score" in result ? result.score : 0,
              ),
              areaStyle: { color: "rgba(111, 211, 176, 0.45)" },
              lineStyle: { color: "#6FD3B0", width: 1 },
              itemStyle: { color: "#6FD3B0" },
            },
            {
              name: "Mock test results",
              value: results?.map(
                (result: ILearningResult | IMockTestResult) =>
                  "mock_test_score" in result ? result.mock_test_score || 0 : 0,
              ),
              areaStyle: { color: "rgba(251, 140, 91, 0.45)" },
              lineStyle: { color: "#FB8C5B", width: 1 },
              itemStyle: { color: "#FB8C5B" },
            },
          ],
        },
      ],
    };
  }, [results]);

  return (
    <div
      className="w-full rounded-2xl bg-white p-4 shadow-small md:p-6 xl:flex xl:h-[600px] xl:p-8"
      data-aos={ANIMATION.DATA_AOS}
    >
      <div className="w-full">
        <div className="mb-5 flex items-center justify-between">
          <div className="w-full flex-row justify-between xl:flex xl:flex-col">
            <div className="flex">
              <div className="min-w-fit text-lg font-semibold xl:text-xl">
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
            <div className="mt-2 text-xs text-gray-400 xl:text-sm">
              {`Last Update: ${dayjs().format(DATE_FORMAT.DATE_TIME_DASH)}`}
            </div>
          </div>
        </div>
        <div className="flex">
          {isLoading ? (
            <div className="w-full animate-pulse">
              <div className="flex flex-col gap-6">
                <div className="flex flex-col items-center justify-around gap-7 md:flex-row">
                  <div className="h-[270px] w-[270px] rounded-full bg-skeleton"></div>
                  <div className="flex w-full flex-col gap-3 md:w-[180px]">
                    <div className="h-5 w-full rounded bg-skeleton"></div>
                    <div className="h-5 w-full rounded bg-skeleton"></div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <>
              {option && (
                <div className="flex grow flex-col gap-5 px-0 xl:flex-row xl:justify-evenly xl:px-5 2xl:pl-0 2xl:pr-12">
                  <div className="flex justify-center">
                    {(() => {
                      const chartHeight = isMobile
                        ? "350px"
                        : isTablet
                          ? "450px"
                          : "500px";
                      const chartMinHeight = isMobile
                        ? "350px"
                        : isTablet
                          ? "450px"
                          : "500px";
                      const chartWidth = isMobile
                        ? "300px"
                        : isTablet
                          ? "500px"
                          : "550px";
                      return (
                        <EChart
                          option={option as EChartsOption}
                          height={chartHeight}
                          minHeight={chartMinHeight}
                          width={chartWidth}
                        />
                      );
                    })()}
                  </div>
                  <div className="flex flex-row items-start justify-center gap-5 xl:flex-col xl:gap-4">
                    {!isNormal && (
                      <div className="flex items-center justify-center gap-2.5 text-sm font-medium xl:text-base">
                        <span className="min-h-3 min-w-3 rounded-full bg-dashboard-mock-test"></span>
                        <Link
                          href={
                            mockTestId
                              ? `${window.location.origin}/courses/test/test-result/${mockTestId}`
                              : ""
                          }
                          target="_blank"
                          className={`inline-block min-w-fit text-base font-bold text-gray-800 ${!mockTestId ? "pointer-events-none" : "hover:text-dashboard-learing"}`}
                          rel="noreferrer"
                        >
                          Mock test results
                        </Link>
                      </div>
                    )}

                    <div className="flex items-center justify-center gap-2.5">
                      <span className="min-h-3 min-w-3 rounded-full bg-dashboard-learing"></span>
                      <span className="min-w-fit text-sm font-medium text-gray-800 xl:text-base">
                        Learning results
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
      <div className="w-full xl:w-[515px]">
        <LearningMockTest results={results as ILearningResult[]} />
      </div>
      {!isLoading && !option && (
        <div className="flex grow items-center justify-center">
          <NoData />
        </div>
      )}
    </div>
  );
};

const LearningMockTest = ({ results }: { results: ILearningResult[] }) => {
  return (
    <div className="w-full flex-col xl:w-[515px]">
      <div className="mb-6 mt-8 flex justify-between text-lg font-semibold text-gray-800 md:justify-start lg:mb-6 lg:mt-10 xl:mb-10 xl:mt-0 xl:text-xl">
        <div>Learning & Mock test Comparision</div>
        <div className="ms-2">
          <IconEssentional />
        </div>
      </div>
      <div className="overflow-y-auto md:h-[230px] xl:h-[450px]">
        {results?.map((result) => {
          const differenceResult =
            (result?.mock_test_score || 0) - (result?.score || 0);

          const hasBothScores =
            result?.score !== 0 && result?.mock_test_score != 0;

          return (
            <div
              key={result?.id}
              className="mb-4 flex flex-col rounded-lg bg-gray-100 px-3 py-2 xl:p-4"
            >
              <div className="mb-3 text-base font-medium text-gray-800 lg:font-semibold xl:mb-2 xl:text-lg">
                {result?.short_name || result?.name}
              </div>

              <div className="items-cente mb-1 flex justify-between">
                <div className="text-xs text-gray-800 xl:text-sm">
                  Learning result: {result?.score}%
                </div>
                {hasBothScores && (
                  <div className="flex items-center">
                    {differenceResult > 0 ? (
                      <SuccessMatchIcon />
                    ) : (
                      <MatchFailIcon />
                    )}
                    <div
                      className={`ms-1 text-sm font-semibold md:text-lg ${differenceResult > 0 ? "text-success" : "text-error"}`}
                    >
                      {differenceResult > 0 ? "+" : ""}
                      {differenceResult}%
                    </div>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between">
                <div className="text-xs text-gray-800 xl:text-sm">
                  Mock test: {result?.mock_test_score}%
                </div>
                {hasBothScores && (
                  <div className="mt-2 text-sm text-gray-400 md:text-base">
                    difference
                  </div>
                )}
              </div>
              {hasBothScores && (
                <div
                  className={
                    differenceResult > 0
                      ? "text-sm text-success"
                      : "text-sm text-error"
                  }
                >
                  {differenceResult > 0
                    ? "Okay, keep it up!"
                    : "Review more formulas"}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default LearningResults;
