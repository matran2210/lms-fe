import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import medalIcon from '@assets/images/medal-icon.svg'
import goalIcon from '@assets/images/goal-icon.svg'
import { DashboardAPI } from '@pages/api/dashboard'
import { IWeeklyReport } from 'src/type/dashboard'
import dayjs from 'dayjs'
import isoWeek from 'dayjs/plugin/isoWeek'
import { DATE_FORMAT } from 'src/constants'
import { BooksIcon, CheckMatchIcon, ClockIcon } from '@assets/icons/Dashboard'

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
    <div className="rounded-2xl p-6 lg:col-span-5">
      <div className="mb-5 flex flex-col pb-3">
        <div className="text-gray-800">
          <span className="text-xl font-semibold">This Week:</span>
          <span className="text-xl font-semibold">
            {` ${dayjs().startOf('isoWeek').format(DATE_FORMAT.DATE)} - ${dayjs().endOf('isoWeek').format(DATE_FORMAT.DATE)}`}
          </span>
        </div>
        <div className="text-gray-400 4xl:text-sm">{`Last Update: ${dayjs().format(DATE_FORMAT.DATE_TIME_DASH)}`}</div>
      </div>
      <div className="flex flex-col rounded-lg bg-gray-100 p-4">
        <div className="mb-2 flex flex-row items-center gap-4">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-success">
            <BooksIcon />
          </div>
          <div className="text-lg font-semibold text-gray-800">
            Activities Completed: {report?.activities?.current || 0}
          </div>
        </div>
        <div className="text-base text-success">
          You&apos;ve outperformed last week! Aim higher!
        </div>
      </div>

      <div className="mt-6 flex flex-col rounded-lg bg-gray-100 p-4">
        <div className="mb-2 flex flex-row items-center justify-between gap-4">
          <div className="flex">
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-error">
              <ClockIcon />
            </div>
            <div className="ms-4 flex items-center text-lg font-semibold text-gray-800">
              Learning Times: {report?.activities?.diff || 0}
            </div>
          </div>

          <div className="flex items-center">
            <CheckMatchIcon />
            <div className="ms-1 text-lg font-semibold text-error">
              {report?.times?.diff}%
            </div>
          </div>
        </div>
        <div className="flex justify-between">
          <div className="text-base text-error">
            More minutes to outperform last week!
          </div>
          <div className="text-base text-gray-400">From last week</div>
        </div>
      </div>
    </div>
  )
}

export default WeeklyReport
