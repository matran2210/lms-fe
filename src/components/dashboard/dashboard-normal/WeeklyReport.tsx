import { useState, useEffect } from 'react'
import medalIcon from '@assets/images/medal-icon.svg'
import goalIcon from '@assets/images/goal-icon.svg'
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

interface WeeklyReportProps {
  weeklyReportData: IWeeklyReport | null
}

const WeeklyReport = ({ weeklyReportData }: WeeklyReportProps) => {
  const [report, setReport] = useState<IReports>()

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

  useEffect(() => {
    if (weeklyReportData) {
      handleWeeklyReport(weeklyReportData)
    }
  }, [weeklyReportData])

  const hasCurrentActivities =
    report?.activities && report?.activities?.current > 0
  const hasDiffLearningTimes = report?.times && report?.times?.diff > 0
  const actualTime =
    (report?.times?.current ?? 0) - (report?.times?.diff ?? 0) > 0

  return (
    <div className="rounded-2xl p-4 md:p-6 lg:col-span-5">
      <div className="mb-6 flex flex-col md:mb-5 md:pb-3">
        <div className="mb-1 text-gray-800 md:mb-0">
          <span className="text-lg font-semibold md:text-xl">This Week:</span>
          <span className="text-lg font-semibold md:text-xl">
            {` ${dayjs().startOf('isoWeek').format(DATE_FORMAT.DATE)} - ${dayjs().endOf('isoWeek').format(DATE_FORMAT.DATE)}`}
          </span>
        </div>
        <div className="text-xs text-gray-400 md:text-sm">{`Last Update: ${dayjs().format(DATE_FORMAT.DATE_TIME_DASH)}`}</div>
      </div>
      <div className="flex flex-col rounded-lg bg-gray-100 p-4">
        <div className="mb-2 flex flex-row items-center gap-4">
          <div
            className={`flex h-8 w-8 items-center justify-center rounded-md ${hasCurrentActivities ? 'bg-success' : 'bg-gray-400'} `}
          >
            <BooksIcon />
          </div>
          <div className="text-base font-medium text-gray-800 md:text-lg">
            Activities Completed: {report?.activities?.current ?? 0}
          </div>
        </div>
        <div
          className={`text-sm md:text-base ${hasCurrentActivities ? 'text-success' : 'text-gray-400'}`}
        >
          {hasCurrentActivities
            ? "You've outperformed last week! Aim higher!"
            : 'You haven’t have any activity yet! '}
        </div>
      </div>

      <div className="mt-4 flex flex-col rounded-lg bg-gray-100 p-4 md:mt-6">
        <div className="mb-2 flex flex-row items-center justify-between gap-4">
          <div className="flex">
            <div
              className={`flex h-8 w-8 items-center justify-center rounded-md ${hasCurrentActivities ? 'bg-error' : 'bg-gray-400'}`}
            >
              <ClockIcon />
            </div>
            <div className="ms-4 flex items-center text-base font-medium text-gray-800 md:text-lg">
              Learning Times: {report?.times?.current || 0} minutes
            </div>
          </div>

          {hasDiffLearningTimes && (
            <div className="flex items-center">
              <CheckMatchIcon />
              <div className="ms-1 text-lg font-semibold text-error">
                {report?.times?.diff}%
              </div>
            </div>
          )}
        </div>
        <div className="flex justify-between">
          <div
            className={`text-sm md:text-base ${actualTime ? 'text-success' : 'text-error'}`}
          >
            {actualTime
              ? 'More minutes to outperform last week!'
              : 'You haven’t have any activity yet! '}
          </div>
          {hasDiffLearningTimes && (
            <div className="text-sm text-gray-400 md:text-base">
              From last week
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default WeeklyReport
