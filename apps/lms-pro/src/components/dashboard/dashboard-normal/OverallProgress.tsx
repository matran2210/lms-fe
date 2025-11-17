import { AwardIcon, IconEssentional } from '@assets/icons/Dashboard'
import { EChart } from '@lms/ui'
import {
  OverallProgressSkeleton,
  OvervallProgressSkeletonMobile,
} from '@components/skeleton/OverallProgressSkeleton'
import { DashboardAPI } from '@pages/api/dashboard'
import { EChartsOption } from 'echarts'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import Tooltip from 'src/common/Tooltip'
import useReponsive from 'src/hooks/useReponsive'
import { useTailwindBreakpoint } from 'src/hooks/useTailwindBreakpoint'
import { IActivities, IActivityProgress } from '../CourseDashboard'

interface OverallProgressProps {
  setActivities: React.Dispatch<React.SetStateAction<IActivities | undefined>>
  handleLoading: (loading: boolean) => void
  loading: boolean
}

interface IPieChartOption {
  section?: IActivityProgress
  time?: IActivityProgress
  test?: IActivityProgress
  activity?: IActivityProgress
  certificate_id?: string
}

const OverallProgress = ({
  setActivities,
  handleLoading,
  loading,
}: OverallProgressProps) => {
  const router = useRouter()
  const [option, setOption] = useState<EChartsOption | null>()
  const { isMobile } = useReponsive()
  const [activities, setActivitiesState] = useState<IActivities>()

  const handlePieChartOption = (data: IPieChartOption) => {
    const activities: IActivities = {
      section: data.section,
      time: data.time,
      test: data.test,
      activity: data.activity,
      ...(data?.certificate_id && { certificate_id: data.certificate_id }),
    }
    setActivities(activities)
    setActivitiesState(activities)

    const values = {
      completed: data.activity?.completed ?? 0,
      uncompleted:
        data.activity &&
        typeof data.activity.total === 'number' &&
        typeof data.activity.completed === 'number'
          ? data.activity.total - data.activity.completed
          : 0,
      total_activities: data.activity?.total ?? 0,
    }

    const option = {
      title: {
        text: `${values.completed}/${values?.total_activities}`,
        subtext: 'Activities',
        left: 'center',
        top: '42%',
        textStyle: {
          fontSize: 20,
          fontWeight: '600',
          color: '#1F2937',
        },
        subtextStyle: {
          fontSize: 14,
          color: '#1F2937',
          marginBottom: 20,
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
          clockwise: false,
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
    handleLoading(true)
    try {
      const res = await DashboardAPI.getOverProgress(id)
      if (res && res.success) {
        handlePieChartOption(res.data as IPieChartOption)
      }
    } catch (error) {
      setOption(null)
    } finally {
      handleLoading(false)
    }
  }

  useEffect(() => {
    if (router?.query?.courseId)
      getOverProgress(router.query.courseId as string)
  }, [router?.query?.courseId])

  const { isMobileView } = useTailwindBreakpoint()

  return (
    <>
      {loading ? (
        isMobileView ? (
          <OvervallProgressSkeletonMobile />
        ) : (
          <OverallProgressSkeleton />
        )
      ) : (
        <div className="rounded-2xl bg-white p-4 shadow-small md:p-6">
          <div className="flex-col">
            <div className="mb-6 flex items-center text-lg font-semibold md:text-xl xl:mb-0">
              <span>Overall Progress</span>
              <Tooltip
                title={
                  <div className="text-center">
                    This show the activities you have done in this course
                  </div>
                }
                placement="bottom"
              >
                <span className="ms-2 flex items-center">
                  <IconEssentional className="cursor-pointer align-middle" />
                </span>
              </Tooltip>
            </div>
          </div>
          {option && (
            <>
              <div className="flex flex-col items-center justify-around gap-2 md:flex md:flex-row 4xl:gap-8">
                <EChart
                  option={option}
                  width={isMobile ? '200px' : '250px'}
                  height={isMobile ? '200px' : '250px'}
                  minHeight={isMobile ? '200px' : '270px'}
                />
                <div className="flex min-w-[180px] flex-col justify-center gap-1 text-sm tracking-tight 2xl:tracking-normal 3xl:gap-3">
                  {/* Responsive wrapper for top 2 items */}
                  <div className="mt-7 grid grid-cols-2 gap-x-4 gap-y-1 md:mt-0 md:flex md:flex-col md:gap-1 3xl:gap-3">
                    {/* Item 1 - Completed */}
                    <div className="flex items-center gap-0.5 2xl:gap-[5px]">
                      <div className="flex h-6 w-6 items-center justify-center">
                        <div className="h-3 w-3 rounded-full bg-primary" />
                      </div>
                      <span className="text-sm font-medium md:text-base">
                        <span className="text-gray-800">Completed</span>{' '}
                        <span className="text-gray">
                          ({activities?.activity?.completed || 0})
                        </span>
                      </span>
                    </div>

                    {/* Item 2 - Not Completed */}
                    <div className="flex items-center gap-0.5 2xl:gap-[5px]">
                      <div className="flex h-6 w-6 items-center justify-center">
                        <span className="h-3 w-3 rounded-full bg-primary-100" />
                      </div>
                      <span className="text-sm font-medium md:text-base">
                        <span className="text-gray-800">Not completed</span>{' '}
                        <span className="text-gray">
                          (
                          {typeof activities?.activity?.total === 'number' &&
                          typeof activities?.activity?.completed === 'number'
                            ? activities.activity.total -
                              activities.activity.completed
                            : 0}
                          )
                        </span>
                      </span>
                    </div>
                  </div>

                  {/* Item 3 - Award message (full width always) */}
                  <div className="mt-4 flex flex-row items-center justify-center md:mt-10 md:justify-start">
                    <div className="flex h-6 w-6 items-center justify-center">
                      <AwardIcon />
                    </div>
                    <span className="ms-1 text-sm text-gray-800 md:text-base">
                      Complete your learning to win the exam
                    </span>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </>
  )
}

export default OverallProgress
