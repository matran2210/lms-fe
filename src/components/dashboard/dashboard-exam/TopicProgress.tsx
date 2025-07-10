import EChart from '@components/base/chart/Chart'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { DashboardAPI } from '@pages/api/dashboard'
import { ITopicProgress } from 'src/type/dashboard'
import { EChartsOption } from 'echarts'
import useIsMobile from 'src/hooks/useIsMobile'

const TopicProgress = () => {
  const router = useRouter()
  const [option, setOption] = useState<EChartsOption>()
  const isMobile = useIsMobile()

  const handleTopicProgress = (data: ITopicProgress[]) => {
    if (data.length) {
      const option = {
        tooltip: {
          trigger: 'item',
          borderWidth: 0,
          formatter: function (params: { name: string; value: string }) {
            return `
              <div style="
                min-width: 120px;
                background: #fff;
              ">
                <div style="font-weight: 600; color: #374151; margin-bottom: 4px; font-size: 16px; line-height: 24px">${params.name}</div>
                <div style="font-size: 14px; line-height: 22px; font-weight: 400; color: #374151">Progress: ${params.value}%</div>
              </div>
            `
          },
        },
        xAxis: {
          type: 'category',
          data: data.map((e: ITopicProgress) => e.short_name || e.name),
          axisLabel: {
            show: true,
            color: '#374151', // Màu chữ (blue-600)
            fontSize: isMobile ? 12 : 14, // Cỡ chữ
            fontWeight: 500, // Đậm
            lineHeight: isMobile ? 20 : 22,
            formatter: function (value: string) {
              const maxLength = 10 // số ký tự tối đa muốn hiển thị
              return value.length > maxLength
                ? value.slice(0, maxLength) + '…'
                : value
            },
            overflow: 'truncate', // hoặc 'break', 'breakAll'
          },
          axisLine: {
            show: true,
            lineStyle: {
              color: '#D1D5DB', // Màu của đường viền trục Y
            },
          },
          splitLine: {
            show: false, // ✅ Tắt đường kẻ dọc
          },
        },
        yAxis: {
          type: 'value',
          min: 0,
          max: 100, // ✅ Trục dọc có giá trị tối đa là 100
          axisLine: {
            show: false,
            lineStyle: {
              color: '#D1D5DB', // Màu của đường viền trục Y
              width: 1, // Độ dày của đường viền
            },
          },
          axisLabel: {
            show: true,
            color: '#374151', // Màu chữ (blue-600)
            fontSize: 12, // Cỡ chữ
            fontWeight: 400,
          },
          axisTick: {
            show: false,
          },
          splitLine: {
            show: true,
            lineStyle: {
              color: '#D1D5DB', // Màu của đường kẻ ngang
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
                color: '#63ACFF', // Màu xen kẽ
                borderRadius: [12, 12, 0, 0],
              },
            })),
            type: 'bar',
            barWidth: isMobile ? 50 : 66,
          },
        ],
      }

      setOption(option as EChartsOption)
    } else {
      setOption(undefined)
    }
  }

  const getTopicProgress = async (id: string) => {
    try {
      const res = await DashboardAPI.getTopicProgress(id)

      if (res && res.success) handleTopicProgress(res.data)
    } catch (error) {
      setOption(undefined)
    }
  }

  useEffect(() => {
    if (router?.query?.courseId)
      getTopicProgress(router.query.courseId as string)
  }, [router?.query?.courseId])

  return (
    <div className="shadow-matchingquiz flex flex-col rounded-2xl bg-white p-4 lg:h-[48vh] xl:h-auto xl:p-8">
      <div className="mb-6 text-lg font-bold text-gray-800 md:mb-5 md:pb-3 xl:text-xl">
        Topic Progress
      </div>

      {option && (
        <EChart option={option} minHeight={isMobile ? '350px' : '450px'} />
      )}
    </div>
  )
}

export default TopicProgress
