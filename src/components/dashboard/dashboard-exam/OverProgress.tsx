import EChart from '@components/base/chart/Chart'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { DashboardAPI } from '@pages/api/dashboard'
import { DATE_FORMAT } from 'src/constants'
import { IOverProgress, IExamPrediction } from 'src/type/dashboard'
import dayjs from 'dayjs'
import { IconEssentional } from '@assets/icons/Dashboard'
import useIsMobile from 'src/hooks/useIsMobile'
import { EChartsOption } from 'echarts'

interface ChartData {
  exam_prediction: number
}

const OverProgress = () => {
  const router = useRouter()
  const [option, setOption] = useState<EChartsOption | null>()
  const isMobile = useIsMobile()

  const handlePieChartOption = (
    data: IOverProgress | IExamPrediction | ChartData,
  ) => {
    // Type guard to check if data has exam_prediction property
    const examPrediction = 'exam_prediction' in data ? data.exam_prediction : 0

    const values = {
      completed: parseFloat(examPrediction.toFixed(2)),
      uncompleted: 100 - parseFloat(examPrediction.toFixed(2)),
    }

    // Responsive radius for mobile and desktop
    const radius = isMobile ? ['80%', '60%'] : ['83%', '63%']
    const innerRadius = isMobile ? ['79%', '60%'] : ['84%', '63%']

    const option = {
      title: {
        text: `${values.completed}%`,
        subtext: 'Pass Rated',
        left: 'center',
        top: '42%',
        textStyle: {
          fontSize: isMobile ? 18 : 24,
          fontWeight: '600',
          color: '#1F2937',
          lineHeight: isMobile ? 28 : 32,
        },
        subtextStyle: {
          fontSize: isMobile ? 12 : 14,
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
          radius: radius,
          avoidLabelOverlap: false,
          labelLine: { show: false },
          legend: { show: false },
          emphasis: { disabled: true },
          clockwise: false,
          data: [
            {
              value: 0,
              name: '',
              itemStyle: { color: '#FFB700' },
            },
            {
              value: values.uncompleted,
              name: '',
              itemStyle: {
                color: '#FFF1CC',
                borderRadius: isMobile
                  ? [-15, -15, -15, -15]
                  : [-20, -20, -20, -20],
              },
            },
          ],
        },
        {
          name: 'Completed',
          type: 'pie',
          radius: innerRadius,
          avoidLabelOverlap: false,
          labelLine: { show: false },
          legend: { show: false },
          emphasis: { disabled: true },
          clockwise: false, // Set the starting angle to 180 for counterclockwise rotation
          data: [
            {
              value: values.completed,
              name: '',
              itemStyle: {
                color: '#FFB700',
                borderRadius: isMobile ? [20, 20, 20, 20] : [25, 25, 25, 25],
              },
            },
            {
              value: values.uncompleted,
              name: '',
              itemStyle: { color: 'transparent' },
            },
          ],
        },
      ],
    }

    setOption(option as EChartsOption)
  }

  const getOverProgress = async (id: string) => {
    try {
      const res = await DashboardAPI.getExamPrediction(id)

      if (res && res.success) handlePieChartOption(res.data)
    } catch (error) {
      setOption(null)
    }
  }

  useEffect(() => {
    if (router?.query?.courseId)
      getOverProgress(router.query.courseId as string)
  }, [router?.query?.courseId])

  return (
    <div className="shadow-matchingquiz mb-5 mt-6 flex w-full flex-col rounded-2xl bg-white p-4 text-gray-700 lg:h-auto lg:p-6 xl:mb-0 xl:mt-0 xl:h-auto xl:w-[566px] 3xl:px-6">
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
            <EChart option={option} minHeight={isMobile ? '300px' : '400px'} />
            {/* {isNormal && (
              <div className="flex min-w-[180px] flex-col justify-center gap-1 text-sm tracking-tight 2xl:tracking-normal 3xl:gap-3">
                <div className="flex flex-row items-center gap-0.5 2xl:gap-[5px]">
                  <span className="h-3 w-3 rounded-full bg-[#37C78C]"></span>
                  <span className="font-medium">Activities completed</span>
                </div>
                <div className="flex flex-row items-center gap-0.5 2xl:gap-[5px]">
                  <span className="h-3 w-3 rounded-full bg-gray-300"></span>
                  <span className="font-medium">Activities not completed</span>
                </div>
              </div>
            )} */}
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
  )
}

export default OverProgress
