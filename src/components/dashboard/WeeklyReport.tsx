import Image from 'next/image'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import bookOpenIcon from '@assets/images/book-open-icon.svg'
import medalIcon from '@assets/images/medal-icon.svg'
import timeIcon from '@assets/images/time-icon.svg'
import goalIcon from '@assets/images/goal-icon.svg'
import arrowDownIcon from '@assets/images/arrow-down-icon.svg'
import { DashboardAPI } from '@pages/api/dashboard'
import { IWeeklyReport } from 'src/type/dashboard'
import dayjs from 'dayjs'
import isoWeek from 'dayjs/plugin/isoWeek'
import { DATE_FORMAT } from 'src/constants'

dayjs.extend(isoWeek)

interface IReport {
  note: string
  current: number
  diff: number
  color: string
  icon: string
}

interface IReports {
  activities: IReport
  times: IReport
}

const WeeklyReport = () => {
  const router = useRouter()
  const [report, setReport] = useState<IReports>()
  const [isLoading, setIsLoading] = useState<boolean>(true)

  const handleWeeklyReport = (data: IWeeklyReport) => {
    const activities = { note: '', current: 0, diff: 0, color: '', icon: '' }
    const times = { note: '', current: 0, diff: 0, color: '', icon: '' }

    if (
      data.current_week.completed_activities >
      data.last_week.completed_activities
    ) {
      activities.note = "You've outperformed last week! Aim higher!"
      activities.color = '#37C78C'
      activities.icon = medalIcon
    } else if (
      data.current_week.completed_activities ==
      data.last_week.completed_activities
    ) {
      activities.note = "You've matched last week's progress. Go further!"
      activities.color = '#FFAE4C'
      activities.icon = goalIcon
    } else {
      activities.note = 'More activities to outperform last week'
      activities.color = '#FF524E'
      activities.diff =
        data.last_week.completed_activities -
        data.current_week.completed_activities
    }
    activities.current = data.current_week.completed_activities

    if (
      data.current_week.total_learning_time > data.last_week.total_learning_time
    ) {
      times.note = "You've outperformed last week! Aim higher!"
      times.color = '#37C78C'
      times.icon = medalIcon
    } else if (
      data.current_week.total_learning_time ==
      data.last_week.total_learning_time
    ) {
      times.note = "You've matched last week's progress. Go further!"
      times.color = '#FFAE4C'
      times.icon = goalIcon
    } else {
      times.note = 'More minutes to outperform last week'
      times.color = '#FF524E'
      times.diff =
        data.last_week.total_learning_time -
        data.current_week.total_learning_time
    }
    times.current = data.current_week.total_learning_time

    setReport({
      activities: activities,
      times: times,
    })
  }

  const getWeeklyReport = async (id: string) => {
    try {
      const res = await DashboardAPI.getWeeklyReport(id)

      if (res && res.success) handleWeeklyReport(res.data)
    } catch (error) {
      return
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (router?.query?.courseId)
      getWeeklyReport(router.query.courseId as string)
  }, [router?.query?.courseId])

  return (
    <div className="bg-white px-3 pb-7 pt-4 shadow-activity lg:col-span-5 3.5xl:px-8">
      <div className="mb-5 flex flex-row items-center justify-between border-b pb-3">
        <div className="text-[#252F4A]">
          <span className="text-lg font-bold 4xl:text-xl">This Week:</span>
          <span className="text-sm font-medium">
            {` ${dayjs().startOf('isoWeek').format(DATE_FORMAT.DATE)} - ${dayjs().endOf('isoWeek').format(DATE_FORMAT.DATE)}`}
          </span>
        </div>
        <div className="text-xsm text-[#99A1B7] 4xl:text-sm">{`Last Update: ${dayjs().format(DATE_FORMAT.DATE_TIME_DASH)}`}</div>
      </div>
      <div className="flex flex-row items-center justify-between border border-dashed px-5 py-6">
        <div className="flex h-12 flex-row items-center gap-4">
          <div className="h-12 w-12 min-w-12 rounded-sm bg-[#37C78C] bg-opacity-10 p-2">
            <Image src={bookOpenIcon} alt="" width={32} height={32} />
          </div>
          <div>
            <div className="text-lg font-medium">Completed Activities</div>
            <div
              className="mt-1 text-sm tracking-tight 3xl:tracking-normal"
              style={{ color: report?.activities?.color }}
            >
              {report?.activities?.note}
            </div>
          </div>
        </div>
        <div className="flex flex-row items-center">
          <div>
            <span className="text-2xl font-semibold">
              {report?.activities?.current || 0}
            </span>
            <span className="ml-1 mr-2 text-sm">activities</span>
          </div>
          <div>
            {report?.activities?.icon ? (
              <div
                className="flex min-w-8 rounded-sm bg-[#37C78C] px-1.75 py-1.25"
                style={{ backgroundColor: report?.activities?.color }}
              >
                <Image
                  src={report.activities.icon}
                  alt=""
                  width={16}
                  height={16}
                />
              </div>
            ) : (
              <div className="flex flex-row items-center rounded-sm bg-[#FF524E] p-1.75 font-inter text-sm font-semibold text-white">
                <div className="flex h-3 min-w-3">
                  <Image
                    src={arrowDownIcon}
                    alt=""
                    width={12}
                    height={12}
                    className="m-auto"
                  />
                </div>
                <div className="text-xs leading-3">
                  {report?.activities?.diff || 0}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="mt-6 flex flex-row items-center justify-between border border-dashed px-5 py-6">
        <div className="flex h-12 flex-row items-center gap-4">
          <div className="h-12 w-12 min-w-12 rounded-sm bg-[#607FE9] bg-opacity-10 p-2">
            <Image src={timeIcon} alt="" width={32} height={32} />
          </div>
          <div>
            <div className="text-lg font-medium">Learning Time</div>
            <div
              className="mt-1 text-sm tracking-tight 3xl:tracking-normal"
              style={{ color: report?.times?.color }}
            >
              {report?.times?.note}
            </div>
          </div>
        </div>
        <div className="flex flex-row items-center">
          <div>
            <span className="text-2xl font-semibold">
              {report?.times?.current || 0}
            </span>
            <span className="ml-1 mr-2 text-sm">minutes</span>
          </div>
          <div>
            {report?.times?.icon ? (
              <div
                className="flex min-w-8 rounded-sm bg-[#37C78C] px-1.75 py-1.25"
                style={{ backgroundColor: report?.times?.color }}
              >
                <Image src={report.times.icon} alt="" width={16} height={16} />
              </div>
            ) : (
              <div className="flex flex-row items-center rounded-sm bg-[#FF524E] p-1.75 font-inter text-sm font-semibold text-white">
                <div className="flex h-3 min-w-3">
                  <Image
                    src={arrowDownIcon}
                    alt=""
                    width={12}
                    height={12}
                    className="m-auto"
                  />
                </div>
                <div className="text-xs leading-3">
                  {report?.times?.diff || 0}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default WeeklyReport
