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
    console.log('ac', activities)
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
    <div className="p-6 lg:col-span-5 rounded-2xl">
      <div className="mb-5 flex flex-col pb-3">
        <div className="text-gray-800">
          <span className="text-xl font-semibold">This Week:</span>
          <span className="text-xl font-semibold">
            {` ${dayjs().startOf('isoWeek').format(DATE_FORMAT.DATE)} - ${dayjs().endOf('isoWeek').format(DATE_FORMAT.DATE)}`}
          </span>
        </div>
        <div className="text-gray-400 4xl:text-sm">{`Last Update: ${dayjs().format(DATE_FORMAT.DATE_TIME_DASH)}`}</div>
      </div>
      <div className="flex flex-col p-4 bg-gray-100 rounded-lg">
        <div className="flex mb-2 flex-row items-center gap-4">
          <div className="h-8 w-8 rounded-md bg-success flex justify-center items-center">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path fill-rule="evenodd" clip-rule="evenodd" d="M18.9557 4.11086C18.9557 2.89144 17.9846 1.84566 16.7106 1.89003C15.762 1.92308 14.522 2.02176 13.5681 2.30732C12.7389 2.55557 11.8063 3.04043 11.0792 3.46122C10.3975 3.85577 9.54878 3.87545 8.8581 3.51024C8.02853 3.07158 6.93711 2.55163 5.9902 2.30176C5.18952 2.09047 4.1767 1.98899 3.3544 1.93845C2.05587 1.85864 1.03906 2.9154 1.03906 4.1647V13.4529C1.03906 14.733 2.07555 15.7325 3.3041 15.8093C4.10306 15.8593 5.00211 15.9554 5.67126 16.132C6.4984 16.3502 7.52123 16.8355 8.34708 17.2758C9.37483 17.8236 10.62 17.8236 11.6477 17.2758C12.4736 16.8355 13.4964 16.3502 14.3235 16.132C14.9927 15.9554 15.8917 15.8593 16.6907 15.8093C17.9192 15.7325 18.9557 14.733 18.9557 13.4529V4.11086ZM16.7541 3.13928C17.2664 3.12143 17.7057 3.54287 17.7057 4.11086V13.4529C17.7057 14.0243 17.2321 14.523 16.6127 14.5618C15.7959 14.6128 14.7966 14.7144 14.0046 14.9234C13.0293 15.1807 11.8997 15.725 11.0597 16.1727C10.9195 16.2474 10.7728 16.3063 10.6224 16.3493V4.95156C10.9993 4.87611 11.3658 4.7396 11.7053 4.5431C12.414 4.13294 13.2431 3.70944 13.9266 3.50481C14.7176 3.26802 15.8218 3.17175 16.7541 3.13928ZM9.3724 4.97902C8.99322 4.92005 8.62156 4.79916 8.27378 4.61526C7.45978 4.18483 6.47303 3.72195 5.67126 3.51038C4.99442 3.33178 4.08271 3.23557 3.27772 3.1861C2.74942 3.15363 2.28906 3.58372 2.28906 4.1647V13.4529C2.28906 14.0243 2.76265 14.523 3.38213 14.5618C4.19886 14.6128 5.19817 14.7144 5.9902 14.9234C6.96548 15.1807 8.09512 15.725 8.93508 16.1727C9.07528 16.2474 9.22197 16.3063 9.3724 16.3493V4.97902Z" fill="white" />
            </svg>
          </div>
          <div className='text-lg font-semibold text-gray-800'>Activities Completed: {report?.activities?.current || 0}</div>
        </div>
        <div className='text-success text-base'>You've outperformed last week! Aim higher!</div>
      </div>

      <div className="mt-6 flex flex-col p-4 bg-gray-100 rounded-lg">
        <div className="flex mb-2 flex-row items-center gap-4 justify-between">
          <div className='flex'>
            <div className="h-8 w-8 rounded-md bg-error flex justify-center items-center">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path fill-rule="evenodd" clip-rule="evenodd" d="M9.9974 2.29199C5.7402 2.29199 2.28906 5.74313 2.28906 10.0003C2.28906 14.2575 5.7402 17.7087 9.9974 17.7087C14.2546 17.7087 17.7057 14.2575 17.7057 10.0003C17.7057 5.74313 14.2546 2.29199 9.9974 2.29199ZM1.03906 10.0003C1.03906 5.05277 5.04984 1.04199 9.9974 1.04199C14.9449 1.04199 18.9557 5.05277 18.9557 10.0003C18.9557 14.9479 14.9449 18.9587 9.9974 18.9587C5.04984 18.9587 1.03906 14.9479 1.03906 10.0003ZM9.9974 6.04199C10.3426 6.04199 10.6224 6.32181 10.6224 6.66699V9.74144L12.5227 11.6417C12.7667 11.8858 12.7667 12.2815 12.5227 12.5256C12.2786 12.7697 11.8829 12.7697 11.6388 12.5256L9.55546 10.4423C9.43824 10.3251 9.3724 10.1661 9.3724 10.0003V6.66699C9.3724 6.32181 9.65222 6.04199 9.9974 6.04199Z" fill="white" />
              </svg>
            </div>
            <div className='text-lg font-semibold text-gray-800 items-center flex ms-4'>Learning Times: {report?.activities?.diff || 0}</div>
          </div>

          <div className='flex items-center'>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="12" viewBox="0 0 16 12" fill="none">
              <path d="M6.24822 5.44772C5.45523 4.65361 4.69673 3.89286 3.93749 3.13174C3.2876 2.48185 2.63771 1.83296 1.98782 1.18507C1.77523 0.973977 1.51877 0.908739 1.22969 0.99385C0.940616 1.07896 0.76852 1.28405 0.704781 1.57388C0.643292 1.85583 0.750898 2.08716 0.948115 2.28626C1.84946 3.1871 2.75006 4.0882 3.64991 4.98955C4.31705 5.65644 4.98469 6.32295 5.65282 6.98909C6.01914 7.35278 6.44319 7.35465 6.808 6.99471C7.31492 6.4948 7.81846 5.99113 8.31862 5.48372C8.37524 5.42673 8.41086 5.34912 8.45098 5.28913L12.6638 9.50567C12.6038 9.50942 12.546 9.51579 12.4879 9.51617C12.0005 9.51617 11.5131 9.51129 11.0257 9.51916C10.7036 9.52404 10.461 9.68039 10.3287 9.97321C10.2023 10.2529 10.2443 10.5244 10.4411 10.7628C10.5118 10.8512 10.6017 10.9222 10.7041 10.9703C10.8065 11.0184 10.9186 11.0423 11.0317 11.0403C12.1985 11.0429 13.3683 11.0452 14.5366 11.0392C14.9779 11.0369 15.3044 10.7017 15.3059 10.2612C15.3097 9.09886 15.3097 7.93656 15.3059 6.77425C15.3059 6.33258 14.9599 5.98688 14.5407 5.99063C14.1215 5.99438 13.7983 6.32433 13.7908 6.76713C13.7837 7.2418 13.789 7.71684 13.789 8.19189V8.38873L13.7207 8.43297C13.6783 8.36616 13.6309 8.30262 13.579 8.24288C12.0872 6.74838 10.5944 5.25501 9.10037 3.76276C8.71156 3.3747 8.29125 3.37395 7.90394 3.75938C7.39528 4.2658 6.88749 4.77384 6.38058 5.2835C6.33708 5.32737 6.30221 5.38136 6.24822 5.44772Z" fill="#F80903" />
            </svg>
            <div  className={`ms-1 text-lg font-semibold text-error`} >
              20%
            </div>
          </div>
        </div>
        <div className='flex justify-between'>
        <div className='text-error text-base'>More minutes to outperform last week!</div>
        <div className='text-base text-gray-400'>From last week</div>
        </div>
      </div>
    </div>
  )
}

export default WeeklyReport
