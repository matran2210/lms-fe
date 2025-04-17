import EChart, { EChartsProps } from '@components/base/chart/Chart'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { DashboardAPI } from '@pages/api/dashboard'
import { IOverProgress } from 'src/type/dashboard'
import NoData from 'src/common/NoData'

const OverProgress = () => {
  const router = useRouter()
  const [option, setOption] = useState<any>()
  const [isLoading, setIsLoading] = useState<boolean>(true)

  const handlePieChartOption = (data: IOverProgress) => {
    if (data.total_activities) {
      const option: EChartsProps['option'] = {
        tooltip: {
          trigger: 'item',
        },
        color: ['#37C78C', '#DCDDDD'],
        responsive: true,
        maintainAspectRatio: false,
        graphic: {
          elements: [
            {
              type: 'text',
              left: 'center',
              top: 'middle',
              z: 999,
              style: {
                text: `${data.completed_activities}/${data.total_activities}`,
                align: 'center',
                fontSize: 18,
                fontWeight: 600,
                fontFamily: 'Roboto',
                fill: '#374151',
              },
            },
          ],
        },
        series: [
          {
            name: 'Over Progress',
            type: 'pie',
            radius: ['50%', '100%'],
            label: { show: false },
            emphasis: { disabled: true },
            tooltip: {
              show: false,
            },
            data: [
              {
                value: data.completed_activities,
                name: 'Activities completed',
                itemStyle: { color: '#37C78C' },
              },
              {
                value: data.uncompleted_activities,
                name: 'Activities not completed',
                itemStyle: { color: 'transparent' },
              },
            ],
          },
          {
            name: 'Over Progress',
            type: 'pie',
            radius: ['50%', '75%'],
            label: { show: false },
            emphasis: { disabled: true },
            data: [
              {
                value: data.completed_activities,
                name: 'Activities completed',
              },
              {
                value: data.uncompleted_activities,
                name: 'Activities not completed',
              },
            ],
            tooltip: {
              trigger: 'item',
              position: function (point) {
                return [point[0], point[1]]
              },
              textStyle: {
                fontFamily: 'Roboto',
                fontSize: 14,
              },
              formatter: function (params) {
                return `<div class="flex flex-row items-center justify-between gap-2 font-medium text-bw-12">
                          <div class="w-2 h-2 rounded-full" style="background-color: ${params.color}"></div>
                          <div>${params.name}:</div>
                          <div class="font-bold">${params.value}</div>
                        </div>`
              },
            },
          },
        ],
      }

      setOption(option)
    }
  }

  const getOverProgress = async (id: string) => {
    try {
      const res = await DashboardAPI.getOverProgress(id)

      if (res && res.success) handlePieChartOption(res.data)
    } catch (error) {
      return
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (router?.query?.courseId)
      getOverProgress(router.query.courseId as string)
  }, [router?.query?.courseId])

  return (
    <div className="flex flex-col bg-white px-3 pb-7 pt-4 shadow-activity lg:col-span-4 3.5xl:px-8">
      <div className="mb-5 border-b pb-3 text-lg-xl font-bold text-bw-11 4xl:text-xl">
        Over Progress
      </div>
      {option && (
        <>
          <div className="flex flex-row justify-between gap-2 4xl:gap-8">
            <div className="m-auto h-42.5 min-w-42.5 3xl:h-45 3xl:min-w-45">
              <EChart option={option} />
            </div>
            <div className="flex min-w-45 flex-col justify-center gap-1 text-sm tracking-tight 2xl:tracking-normal 3xl:gap-3">
              <div className="flex flex-row items-center gap-0.5 2xl:gap-1.5">
                <span className="h-3 w-3 rounded-full bg-green-1"></span>
                <span className="font-medium">Activities completed</span>
              </div>
              <div className="flex flex-row items-center gap-0.5 2xl:gap-1.5">
                <span className="h-3 w-3 rounded-full bg-gray-2"></span>
                <span className="font-medium">Activities not completed</span>
              </div>
            </div>
          </div>
          <div className="mt-4 text-center">
            Complete your learning to win the exam
          </div>
        </>
      )}
      {!isLoading && !option && (
        <div className="flex grow items-center justify-center">
          <NoData />
        </div>
      )}
    </div>
  )
}

export default OverProgress
