import EChart, { EChartsProps } from '@components/base/chart/Chart'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { DashboardAPI } from '@pages/api/dashboard'
import NoData from 'src/common/NoData'
import { COURSE_TYPE, DATE_FORMAT } from 'src/constants'
import { IOverProgress, IExamPrediction } from 'src/type/dashboard'
import dayjs from 'dayjs'
import { IconEssentional } from '@assets/icons/Dashboard'

const OverProgress = () => {
  const router = useRouter()
  const [option, setOption] = useState<any>()
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const courseInfo = JSON.parse(localStorage.getItem('courseInfo') as any)
  const isNormal = courseInfo?.courseType == COURSE_TYPE.NORMAL_COURSE

  const handlePieChartOption = (
    data: IOverProgress | IExamPrediction | any,
  ) => {
    // const color = isNormal ? '#37C78C' : '#7086FD'
    // const centerText = isNormal
    //   ? `${data?.completed_activities}/${data?.total_activities}`
    //   : `${parseFloat(data.exam_prediction.toFixed(2))}%`
    const values = {
      completed: isNormal
        ? data.completed_activities
        : parseFloat(data.exam_prediction.toFixed(2)),
      uncompleted: isNormal
        ? data.uncompleted_activities
        : 100 - parseFloat(data.exam_prediction.toFixed(2)),
    }

    const option = {
      title: {
        text: `${values.completed}%`,
        subtext: 'Pass Rated',
        left: 'center',
        top: '42%',
        textStyle: {
          fontSize: 24,
          fontWeight: '600',
          color: '#1F2937',
          lineHeight: 32,
        },
        subtextStyle: {
          fontSize: 14,
          color: '#666',
        },
      },
      responsive: true,
      maintainAspectRatio: false,
      legend: { show: false },
      series: [
        {
          name: 'Pass Rate',
          type: 'pie',
          radius: ['90%', '67%'],
          avoidLabelOverlap: false,
          labelLine: { show: false },
          legend: { show: false },
          emphasis: { disabled: true },
          data: [
            {
              value: values.completed,
              name: '',
              itemStyle: { color: '#FFB700' },
            }, // green
            {
              value: values.uncompleted,
              name: '',
              itemStyle: { color: '#FFF1CC' },
            }, // light yellow
          ],
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
    <div className="flex w-[566px] flex-col rounded-2xl bg-white p-6 text-ink-700 shadow-matchingquiz lg:col-span-4 3xl:px-6">
      <div className="mb-5 flex items-center justify-between pb-3">
        <div className="min-w-fit text-xl font-semibold text-ink-800 4xl:text-xl">
          {isNormal ? 'Overall Progress' : 'Your Exam Prediction'}
        </div>
        <div
          className={`${isNormal ? 'invisible' : 'text-sm text-ink-400 4xl:text-sm'}`}
        >
          {`Last Update: ${dayjs().format(DATE_FORMAT.DATE_TIME_DASH)}`}
        </div>
      </div>
      {option && (
        <>
          <div
            className={`flex flex-row justify-center gap-2 4xl:gap-8 ${isNormal ? '' : 'mb-2 mt-3'}`}
          >
            <EChart option={option} width="400px" height="400px" />
            {isNormal && (
              <div className="flex min-w-[180px] flex-col justify-center gap-1 text-sm tracking-tight 2xl:tracking-normal 3xl:gap-3">
                <div className="flex flex-row items-center gap-0.5 2xl:gap-[5px]">
                  <span className="h-3 w-3 rounded-full bg-[#37C78C]"></span>
                  <span className="font-medium">Activities completed</span>
                </div>
                <div className="flex flex-row items-center gap-0.5 2xl:gap-[5px]">
                  <span className="h-3 w-3 rounded-full bg-ink-300"></span>
                  <span className="font-medium">Activities not completed</span>
                </div>
              </div>
            )}
          </div>
          <div className="mt-4 flex items-center justify-center self-center text-center text-ink-800">
            <div className="me-2">
              <IconEssentional />
            </div>
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
