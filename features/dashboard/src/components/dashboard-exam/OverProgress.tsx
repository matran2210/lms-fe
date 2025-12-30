import { EChart } from "@lms/ui";
import { useEffect, useState } from "react";
import { DATE_FORMAT } from "@lms/core";
import { IOverProgress, IExamPrediction } from "@lms/core";
import dayjs from "dayjs";
import { IconEssentional } from "@lms/assets";
import { EChartsOption } from "echarts";
import { useReponsive } from "@lms/hooks";
import { useFeature } from "@lms/contexts";

interface ChartData {
  exam_prediction: number;
}

const OverProgress = () => {
  const [option, setOption] = useState<EChartsOption | null>();
  const { isMobile } = useReponsive();
  const {dashboardApi, params} = useFeature()

  const handlePieChartOption = (
    data: IOverProgress | IExamPrediction | ChartData,
  ) => {
    // Type guard to check if data has exam_prediction property
    const examPrediction = "exam_prediction" in data ? data.exam_prediction : 0;

    const values = {
      completed: parseFloat(examPrediction.toFixed(2)),
      uncompleted: 100 - parseFloat(examPrediction.toFixed(2)),
    };

    // Responsive radius for mobile and desktop
    const radius = isMobile ? ["80%", "60%"] : ["83%", "63%"];
    const innerRadius = isMobile ? ["79%", "60%"] : ["84%", "63%"];

    const option = {
      title: {
        text: `${values.completed}%`,
        subtext: "Pass Rated",
        left: "center",
        top: "42%",
        textStyle: {
          fontSize: isMobile ? 18 : 24,
          fontWeight: "600",
          color: "#1F2937",
          lineHeight: isMobile ? 28 : 32,
        },
        subtextStyle: {
          fontSize: isMobile ? 12 : 14,
          color: "#666",
        },
      },
      responsive: true,
      maintainAspectRatio: false,
      legend: { show: false },
      series: [
        {
          name: "Pass Rate",
          type: "pie",
          radius: radius,
          avoidLabelOverlap: false,
          labelLine: { show: false },
          legend: { show: false },
          emphasis: { disabled: true },
          clockwise: false,
          data: [
            {
              value: 0,
              name: "",
              itemStyle: { color: "#FFB700" },
            },
            {
              value: values.uncompleted,
              name: "",
              itemStyle: {
                color: "#FFF1CC",
                borderRadius: isMobile
                  ? [-15, -15, -15, -15]
                  : [-20, -20, -20, -20],
              },
            },
          ],
        },
        {
          name: "Completed",
          type: "pie",
          radius: innerRadius,
          avoidLabelOverlap: false,
          labelLine: { show: false },
          legend: { show: false },
          emphasis: { disabled: true },
          clockwise: false, // Set the starting angle to 180 for counterclockwise rotation
          data: [
            {
              value: values.completed,
              name: "",
              itemStyle: {
                color: "#FFB700",
                borderRadius: isMobile ? [20, 20, 20, 20] : [25, 25, 25, 25],
              },
            },
            {
              value: values.uncompleted,
              name: "",
              itemStyle: { color: "transparent" },
            },
          ],
        },
      ],
    };

    setOption(option as EChartsOption);
  };

  const getOverProgress = async (id: string) => {
    try {
      const res = await dashboardApi?.getExamPrediction(id);

      if (res && res.success) handlePieChartOption(res.data);
    } catch (error) {
      setOption(null);
    }
  };

  useEffect(() => {
    if (params?.courseId)
      getOverProgress(params?.courseId as string);
  }, [params?.courseId]);

  return (
    <div className="mb-5 mt-6 flex w-full flex-col rounded-2xl bg-white p-4 text-gray-700 shadow-small md:mb-0 md:p-6 lg:h-auto xl:mt-0 xl:h-auto xl:w-[566px] xl:p-8">
      <div className="mb-5 items-center justify-between pb-3 xl:flex">
        <div className="min-w-fit text-lg font-semibold text-gray-800 xl:text-xl">
          Your Exam Prediction
        </div>
        <div className="mt-2 text-sm text-gray-400 xl:mt-0 4xl:text-sm">
          {`Last Update: ${dayjs().format(DATE_FORMAT.DATE_TIME_DASH)}`}
        </div>
      </div>
      {option && (
        <>
          <div className="mb-2 mt-3 flex flex-row justify-center gap-2 4xl:gap-8">
            <EChart option={option} minHeight={isMobile ? "300px" : "390px"} />
          </div>
          <div className="xl mt-4 flex items-center justify-center self-center text-center text-sm text-gray-800 xl:text-base">
            <div className="me-2">
              <IconEssentional />
            </div>
            Based on the score from Total test results and Topic progress
          </div>
        </>
      )}
    </div>
  );
};

export default OverProgress;
