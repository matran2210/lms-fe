import EChart, { EChartsProps } from '@components/base/chart/Chart'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { DashboardAPI } from '@pages/api/dashboard'
import { ITopicProgress } from 'src/type/dashboard'
import NoData from 'src/common/NoData'
import { LABEL_MAX_LENGTH } from 'src/constants'

const TopicProgress = () => {
  const router = useRouter()
  const [option, setOption] = useState<any>()
  const [isLoading, setIsLoading] = useState<boolean>(true)

  const handleTopicProgress = (data: ITopicProgress[]) => {
    if (data.length) {
      // const option: EChartsProps['option'] = {
      //   color: ['#FFAE4C'],
      //   responsive: true,
      //   maintainAspectRatio: false,
      //   grid: {
      //     left: 20,
      //     right: 20,
      //     top: 30,
      //     bottom: 10,
      //     containLabel: true,
      //   },
      //   tooltip: {
      //     trigger: 'axis',
      //     axisPointer: {
      //       type: 'shadow',
      //     },
      //     textStyle: {
      //       fontSize: 14,
      //       fontWeight: 500,
      //       fontFamily: 'Roboto',
      //       color: '#374151',
      //     },
      //     formatter: (params: any) => {
      //       const index = params[0]?.dataIndex
      //       const fullLabel = data[index]?.short_name || data[index]?.name
      //       return fullLabel || ''
      //     },
      //   },
      //   xAxis: {
      //     type: 'category',
      //     data: data.map((e: ITopicProgress) => e.short_name || e.name),
      //     axisLabel: {
      //       rotate: 40,
      //       fontFamily: 'Roboto',
      //       formatter: function (value) {
      //         return value.length > LABEL_MAX_LENGTH
      //           ? value.slice(0, LABEL_MAX_LENGTH) + '…'
      //           : value
      //       },
      //       rich: {
      //         tooltip: {
      //           color: '#374151',
      //         },
      //       },
      //       fontSize: 14,
      //       margin: 20,
      //     },
      //     splitLine: {
      //       show: true,
      //       lineStyle: {
      //         type: 'dashed',
      //         color: '#eee',
      //       },
      //     },
      //     axisTick: {
      //       show: false,
      //     },
      //   },
      //   yAxis: {
      //     type: 'value',
      //     max: 100,
      //     splitLine: {
      //       show: true,
      //       lineStyle: {
      //         type: 'dashed',
      //         color: '#eee',
      //       },
      //     },
      //   },
      //   series: [
      //     {
      //       data: data.map((e: ITopicProgress) => {
      //         return e.total_activities
      //           ? Math.round(
      //               (e.completed_activities / e.total_activities) * 100,
      //             )
      //           : 0
      //       }),
      //       type: 'bar',
      //       barMaxWidth: 48,
      //       label: {
      //         show: true,
      //         formatter: '{c}%',
      //         fontWeight: 600,
      //         fontFamily: 'Roboto',
      //         position: 'top',
      //       },
      //       showBackground: true,
      //       backgroundStyle: {
      //         color: 'rgba(255, 174, 76, 0.2)',
      //       },
      //     },
      //   ],
      // }

      const option = {
        tooltip: {
          trigger: 'item',
          formatter: function (params: any) {
            return `
              <div style="
                font-weight: 500;
                box-shadow: 0 4px 24px 0 rgba(0,0,0,0.08);
                min-width: 120px;
                background: '#fff';
                text-align: left;
              ">
                <div style="font-weight: 700; color: #2563eb; margin-bottom: 0.25rem;">${params.name}</div>
                <div>Hoàn thành: <span style="font-weight:700; color:#16a34a;">${params.value}%</span></div>
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
            fontSize: 14, // Cỡ chữ
            fontWeight: 500, // Đậm
            lineHeight: 22,
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
            barWidth: 66,
          },
        ],
      }

      setOption(option)
    } else {
      setOption(null)
    }
  }

  const getTopicProgress = async (id: string) => {
    try {
      const res = await DashboardAPI.getTopicProgress(id)

      if (res && res.success) handleTopicProgress(res.data)
    } catch (error) {
      setOption(null)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (router?.query?.courseId)
      getTopicProgress(router.query.courseId as string)
  }, [router?.query?.courseId])

  return (
    <div className="flex min-h-[50vh] grow flex-col rounded-2xl bg-white p-8 shadow-matchingquiz xl:h-auto">
      <div className="mb-5 pb-3 text-lg font-bold text-[#252F4A] 4xl:text-xl">
        Topic Progress
      </div>
      {option && (
        <>
          <div className="grow">
            <EChart option={option} />
          </div>
          <div className="mt-5 flex w-full">
            <div className="m-auto">
              <span className="bg-primary-6 mr-2.5 inline-block h-3 w-3"></span>
              <span className="font-medium">Completed</span>
            </div>
          </div>
        </>
      )}
      {!isLoading && !option && (
        <div className="flex h-full w-full items-center justify-center">
          <NoData />
        </div>
      )}
    </div>
  )
}

export default TopicProgress
