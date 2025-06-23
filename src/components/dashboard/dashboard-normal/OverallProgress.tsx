import { AwardIcon, IconEssentional } from '@assets/icons/Dashboard'
import EChart from '@components/base/chart/Chart'
import { DashboardAPI } from '@pages/api/dashboard'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import Tooltip from 'src/common/Tooltip'

interface PieChartData {
  completed_activities: number
  uncompleted_activities: number
  total_activities: number
}

const OverallProgress = () => {
  const router = useRouter()
  const [option, setOption] = useState<any>()
  const [isLoading, setIsLoading] = useState<boolean>(true)

  const handlePieChartOption = (data: PieChartData) => {
    const values = {
      completed: data.completed_activities,
      uncompleted: data.uncompleted_activities,
      total_activities: data?.total_activities,
    }

    const option = {
      title: {
        text: `${values.completed}/${values?.total_activities}`,
        subtext: 'Activities',
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
              value: 0,
              name: '',
              itemStyle: { color: '#FFB700' },
            },
            {
              value: values.uncompleted,
              name: '',
              itemStyle: {
                color: '#FFF1CC',
                borderRadius: [-20, -20, -20, -20],
              },
            },
          ],
        },
        {
          name: 'Completed',
          type: 'pie',
          radius: ['90%', '65%'],
          avoidLabelOverlap: false,
          labelLine: { show: false },
          legend: { show: false },
          emphasis: { disabled: true },
          data: [
            {
              value: values.completed,
              name: '',
              itemStyle: {
                color: '#FFB700',
                borderRadius: [25, 25, 25, 25],
              },
            },
            {
              value: values.total_activities,
              name: '',
              itemStyle: { color: 'transparent' },
            },
          ],
        },
      ],
    }

    setOption(option)
  }

  const [activities, setActivities] = useState<any>()

  const getOverProgress = async (id: string) => {
    try {
      const res = await DashboardAPI.getOverProgress(id)

      if (res && res.success) {
        setActivities(res?.data)
        handlePieChartOption(res.data)
      }
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
    <div className="shadow-matchingquiz rounded-2xl bg-white p-6">
      <div className="flex-col">
        <div className="flex">
          <div className="min-w-fit text-xl font-semibold">
            Overall Progress
          </div>
          <Tooltip
            title={
              <div className="text-center">
                This show the activities you have done in this course
              </div>
            }
            placement="bottom"
          >
            <div className="ms-2">
              <IconEssentional />
            </div>
          </Tooltip>
        </div>
      </div>
      {option && (
        <>
          <div className="flex flex-row justify-around gap-2 4xl:gap-8">
            <EChart
              option={option}
              width="250px"
              height="250px"
              minHeight="270px"
            />
            <div className="flex min-w-[180px] flex-col justify-center gap-1 text-sm tracking-tight 2xl:tracking-normal 3xl:gap-3">
              <div className="flex flex-row items-center gap-0.5 2xl:gap-[5px]">
                <div className="flex h-6 w-6 items-center justify-center">
                  <div className="h-3 w-3 rounded-full bg-primary" />
                </div>
                <span className="text-base font-medium">
                  <span className="text-gray-800">Completed</span>{' '}
                  <span className="text-gray">
                    ({activities?.completed_activities})
                  </span>
                </span>
              </div>
              <div className="flex flex-row items-center gap-0.5 2xl:gap-[5px]">
                <div className="flex h-6 w-6 items-center justify-center">
                  <span className="h-3 w-3 rounded-full bg-primary-100" />
                </div>
                <span className="text-base font-medium">
                  <span className="text-gray-800">Not completed</span>{' '}
                  <span className="text-gray">
                    ({activities?.uncompleted_activities})
                  </span>
                </span>
              </div>

              <div className="mt-10 flex flex-row items-center">
                <div className="flex h-6 w-6 items-center justify-center">
                  <AwardIcon />
                </div>
                <span className="ms-1 text-base text-gray-800">
                  Complete your learning to win the exam
                </span>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default OverallProgress
