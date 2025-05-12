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
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow',
          },
          textStyle: {
            fontSize: 14,
            fontWeight: 500,
            fontFamily: 'Roboto',
            color: '#374151',
          },
          formatter: (params: any) => {
            const index = params[0]?.dataIndex
            const fullLabel = data[index]?.short_name || data[index]?.name
            return fullLabel || ''
          },
        },
        xAxis: {
          type: 'category',
          data: data.map((e: ITopicProgress) => e.short_name || e.name),
          axisLabel: {
            rotate: 40,
            fontFamily: 'Roboto',
            formatter: function (value) {
              return value.length > LABEL_MAX_LENGTH
                ? value.slice(0, LABEL_MAX_LENGTH) + '…'
                : value
            },
            rich: {
              tooltip: {
                color: '#374151',
              },
            },
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
            data: data.map((e: ITopicProgress) => {
              return e.total_activities
                ? Math.round(
                    (e.completed_activities / e.total_activities) * 100,
                  )
                : 0
            }),
            type: 'bar',
            barMaxWidth: 48,
            label: {
              show: true,
              formatter: '{c}%',
              fontWeight: 600,
              fontFamily: 'Roboto',
              position: 'top',
            },
            showBackground: true,
            backgroundStyle: {
              color: 'rgba(255, 174, 76, 0.2)',
            },
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
    <div className="flex min-h-[50vh] grow flex-col bg-white px-3 pb-7 pt-4 shadow-activity xl:h-auto 3.5xl:px-8">
      <div className="mb-5 border-b pb-3 text-lg-xl font-bold text-bw-11 4xl:text-xl">
        Topic Progress
      </div>
      {option && (
        <>
          <div className="grow">
            <EChart option={option} />
          </div>
          <div className="mt-5 flex w-full">
            <div className="m-auto">
              <span className="mr-2.5 inline-block h-3 w-3 bg-primary-6"></span>
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
