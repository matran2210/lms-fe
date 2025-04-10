import EChart, { EChartsProps } from '@components/base/chart/Chart'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { DashboardAPI } from '@pages/api/dashboard'
import { ITopicProgress } from 'src/type/dashboard'
import NoData from 'src/common/NoData'

const TopicProgress = () => {
  const router = useRouter()
  const [option, setOption] = useState<any>()
  const [isLoading, setIsLoading] = useState<boolean>(true)

  const handleTopicProgress = (data: ITopicProgress[]) => {
    const list = [...data].filter((e: ITopicProgress) => e.total_activities)
    if (list.length) {
      const option: EChartsProps['option'] = {
        color: ['#FFAE4C'],
        responsive: true,
        maintainAspectRatio: false,
        grid: {
          left: 20,
          right: 20,
          top: 30,
          bottom: 10,
          containLabel: true,
        },
        xAxis: {
          type: 'category',
          data: list.map((e: ITopicProgress) => e.short_name || e.name),
          axisLabel: {
            rotate: 40,
            fontFamily: 'Roboto',
            color: '#374151',
            fontSize: 14,
            margin: 20,
          },
          splitLine: {
            show: true,
            lineStyle: {
              type: 'dashed',
              color: '#eee',
            },
          },
          axisTick: {
            show: false,
          },
        },
        yAxis: {
          type: 'value',
          max: 100,
          splitLine: {
            show: true,
            lineStyle: {
              type: 'dashed',
              color: '#eee',
            },
          },
        },
        series: [
          {
            data: list.map((e: ITopicProgress) => {
              return e.total_activities
                ? Math.round(
                    (e.completed_activities / e.total_activities) * 100,
                  )
                : 0
            }),
            type: 'bar',
            label: {
              show: true,
              formatter: '{c}%',
              fontWeight: 600,
              fontFamily: 'Roboto',
              position: 'insideTop',
            },
            showBackground: true,
            backgroundStyle: {
              color: 'rgba(255, 174, 76, 0.2)',
            },
            barWidth: '50%',
          },
        ],
      }

      setOption(option)
    }
  }

  const getTopicProgress = async (id: string) => {
    try {
      const res = await DashboardAPI.getTopicProgress(id)

      if (res && res.success) handleTopicProgress(res.data)
    } catch (error) {
      return
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (router?.query?.courseId)
      getTopicProgress(router.query.courseId as string)
  }, [router?.query?.courseId])

  return (
    <div className="flex min-h-[525px] w-full grow flex-col bg-white px-3 pb-7 pt-4 shadow-activity 3.5xl:px-8">
      <div className="text-lg-xl font-bold text-bw-11 4xl:text-xl">
        Topic Progress
      </div>
      <div className="mb-5 mt-3 h-[1px] w-full bg-gray-2"></div>
      {option && (
        <>
          <div className="grow">
            <EChart option={option} />
          </div>
          <div className="mt-5 flex w-full">
            <div className="m-auto">
              <span className="mr-2.5 inline-block h-3 w-3 bg-primary-4"></span>
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
