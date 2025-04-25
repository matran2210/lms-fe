import EChart, { EChartsProps } from '@components/base/chart/Chart'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { DashboardAPI } from '@pages/api/dashboard'
import NoData from 'src/common/NoData'
import { COURSE_TYPE, DATE_FORMAT } from 'src/constants'
import { IOverProgress, IExamPrediction } from 'src/type/dashboard'
import dayjs from 'dayjs'

const OverProgress = () => {
  const router = useRouter()
  const [option, setOption] = useState<any>()
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const courseInfo = JSON.parse(localStorage.getItem('courseInfo') as any)
  const isNormal = courseInfo?.courseType == COURSE_TYPE.NORMAL_COURSE

  const handlePieChartOption = (
    data: IOverProgress | IExamPrediction | any,
  ) => {
    const color = isNormal ? '#37C78C' : '#7086FD'
    const centerText = isNormal
      ? `${data?.completed_activities}/${data?.total_activities}`
      : `${parseFloat(data.exam_prediction.toFixed(2))}%`
    const values = {
      completed: isNormal
        ? data.completed_activities
        : parseFloat(data.exam_prediction.toFixed(2)),
      uncompleted: isNormal
        ? data.uncompleted_activities
        : 100 - parseFloat(data.exam_prediction.toFixed(2)),
    }

    const option: EChartsProps['option'] = {
      tooltip: {
        show: isNormal,
        trigger: 'item',
      },
      color: [color, '#D1D5DB'],
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
              text: `${centerText}`,
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
              value: values.completed,
              name: 'Activities completed',
              itemStyle: { color: color },
            },
            {
              value: values.uncompleted,
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
              value: values.completed,
              name: 'Activities completed',
            },
            {
              value: values.uncompleted,
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

  const getOverProgress = async (id: string) => {
    try {
      const res = isNormal
        ? await DashboardAPI.getOverProgress(id)
        : await DashboardAPI.getExamPrediction(id)

      if (res && res.success) handlePieChartOption(res.data)
    } catch (error) {
      setOption(null)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (router?.query?.courseId)
      getOverProgress(router.query.courseId as string)
  }, [router?.query?.courseId])

  return (
    <div className="flex flex-col bg-white px-3 pb-7 pt-4 text-bw-12 shadow-activity lg:col-span-4 3.5xl:px-8">
      <div className="mb-5 flex items-center justify-between border-b border-gray-15 pb-3">
        <div className="min-w-fit text-lg-xl font-bold 4xl:text-xl">
          {isNormal ? 'Over Progress' : 'Your Exam Prediction'}
        </div>
        <div
          className={`${isNormal ? 'invisible' : 'text-xsm text-gray-11 4xl:text-sm'}`}
        >
          {`Last Update: ${dayjs().format(DATE_FORMAT.DATE_TIME_DASH)}`}
        </div>
      </div>
      {option && (
        <>
          <div
            className={`flex flex-row justify-between gap-2 4xl:gap-8 ${isNormal ? '' : 'mb-2 mt-3'}`}
          >
            <div
              className={`m-auto ${isNormal ? 'h-42.5 min-w-42.5 3xl:h-45 3xl:min-w-45' : 'mb-2 h-40 w-40'}`}
            >
              <EChart option={option} />
            </div>
            {isNormal && (
              <div className="flex min-w-45 flex-col justify-center gap-1 text-sm tracking-tight 2xl:tracking-normal 3xl:gap-3">
                <div className="flex flex-row items-center gap-0.5 2xl:gap-1.5">
                  <span className="h-3 w-3 rounded-full bg-green-3"></span>
                  <span className="font-medium">Activities completed</span>
                </div>
                <div className="flex flex-row items-center gap-0.5 2xl:gap-1.5">
                  <span className="h-3 w-3 rounded-full bg-gray-15"></span>
                  <span className="font-medium">Activities not completed</span>
                </div>
              </div>
            )}
          </div>
          <div className="mt-4 text-center">
            {isNormal
              ? 'Complete your learning to win the exam'
              : 'Based on the score from Total test results and Topic progress'}
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
