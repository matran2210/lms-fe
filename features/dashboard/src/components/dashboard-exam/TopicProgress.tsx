import { ITopicProgress } from "@lms/core";
import { useReponsive } from "@lms/hooks";
import { EChart } from "@lms/ui";
import { EChartsOption } from "echarts";
import { useEffect, useState } from "react";

const TopicProgress = ({
  topicProgressData,
}: {
  topicProgressData: ITopicProgress[] | null;
}) => {
  const [option, setOption] = useState<EChartsOption>();
  const { isMobile } = useReponsive();

  const handleTopicProgress = (data: ITopicProgress[]) => {
    if (data.length) {
      const option = {
        grid: {
          left: 0,
          right: 0,
          top: 10,
          bottom: 0,
          containLabel: true,
        },
        tooltip: {
          show: !isMobile,
          trigger: "item",
          borderWidth: 0,
          extraCssText: `
              border-radius: 8px;
              box-shadow: 0px 4px 16px 0px rgba(0, 0, 0, 0.08);
              padding: 12px;
              background: white;
            `,
          formatter: function (params: { name: string; value: string }) {
            return `
      <div style=" min-width: 120px;">
        <div style="font-weight: 600; color: #374151; margin-bottom: 4px; font-size: 16px; line-height: 24px">
          ${params.name}
        </div>
        <div style="font-size: 14px; line-height: 22px; font-weight: 400; color: #374151">
          Progress: ${params.value}%
        </div>
      </div>
    `;
          },
        },
        dataZoom: [
          {
            type: "inside", // Cuộn bằng chuột hoặc touch
            xAxisIndex: 0,
            start: 0,
            end: 50,
          },
        ],

        xAxis: {
          type: "category",
          data: data.map((e: ITopicProgress) => e.short_name || e.name),
          axisLabel: {
            show: true,
            color: "#374151", // Màu chữ (blue-600)
            fontSize: isMobile ? 12 : 14, // Cỡ chữ
            fontWeight: 500, // Đậm
            lineHeight: isMobile ? 20 : 22,
            formatter: function (value: string) {
              const maxLength = 10; // số ký tự tối đa muốn hiển thị
              return value.length > maxLength
                ? value.slice(0, maxLength) + "…"
                : value;
            },
            overflow: "truncate", // hoặc 'break', 'breakAll'
          },
          axisLine: {
            show: true,
            lineStyle: {
              color: "#D1D5DB", // Màu của đường viền trục Y
            },
          },
          splitLine: {
            show: false, // ✅ Tắt đường kẻ dọc
          },
        },
        yAxis: {
          type: "value",
          min: 0,
          max: 100, // ✅ Trục dọc có giá trị tối đa là 100
          axisLine: {
            show: false,
            lineStyle: {
              color: "#D1D5DB", // Màu của đường viền trục Y
              width: 1, // Độ dày của đường viền
            },
          },
          axisLabel: {
            show: true,
            color: "#374151", // Màu chữ (blue-600)
            fontSize: 12, // Cỡ chữ
            fontWeight: 400,
          },
          axisTick: {
            show: false,
          },
          splitLine: {
            show: true,
            lineStyle: {
              color: "#D1D5DB", // Màu của đường kẻ ngang
              width: 1, // Độ dày của đường kẻ
            },
          },
        },
        series: [
          {
            data: data.map((e: ITopicProgress) => ({
              value: e.total_activities
                ? Math.round(
                    (e.completed_activities / e.total_activities) * 100,
                  )
                : 0,
              itemStyle: {
                color: "#63ACFF", // Màu xen kẽ
                borderRadius: [12, 12, 0, 0],
              },
            })),
            type: "bar",
            barWidth: isMobile ? 50 : 58,
          },
        ],
      };

      setOption(option as EChartsOption);
    } else {
      setOption(undefined);
    }
  };

  useEffect(() => {
    if (topicProgressData && topicProgressData.length > 0) {
      handleTopicProgress(topicProgressData);
    } else {
      setOption(undefined);
    }
  }, [topicProgressData, isMobile]);

  return (
    <div className="flex flex-col rounded-2xl bg-white p-4 shadow-small md:p-6 lg:h-full">
      <div className="mb-6 text-lg font-bold text-gray-800 md:mb-5 md:pb-3 xl:text-xl">
        Topic Progress
      </div>

      {option && (
        <EChart
          option={option}
          minHeight={isMobile ? "350px" : "450px"}
          height={isMobile ? "350px" : "450px"}
          width="100%"
        />
      )}
    </div>
  );
};

export default TopicProgress;
