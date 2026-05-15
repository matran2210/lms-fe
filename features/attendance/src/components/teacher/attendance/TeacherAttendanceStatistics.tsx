import { ChartPieIcon, HugeClockIcon, UserCheckIcon, UserCloseIcon, UsersGroupIcon } from '@lms/assets'
import { useFeature } from '@lms/contexts'
import { Progress } from 'antd'
import { useQuery } from 'react-query'

type TeacherAttendanceStatisticsProps = {
  fromDate?: string
  toDate?: string
}

const TeacherAttendanceStatistics = ({ fromDate, toDate }: TeacherAttendanceStatisticsProps) => {
    const { userApi } = useFeature()
        const fetchAttendanceStatistics = async () => {
        const { data } = await userApi.getTeacherTeachingAttendanceSummary({
          fromDate,
          toDate,
        })
        return data
      }
      const { data: statisticsData } = useQuery({
        queryKey: ['teaching-attendanceStatistics', fromDate, toDate],
        queryFn: () => fetchAttendanceStatistics(),
        refetchOnWindowFocus: true,
        retry: false,
        enabled: !!fromDate && !!toDate
      })
  return (
    <div className="w-full flex flex-col justify-between items-center gap-6">
          <div className="w-full flex justify-between items-center gap-6 flex-wrap">
            <div className="flex-1 self-stretch p-6 bg-white rounded-2xl shadow-small flex flex-col justify-start items-center gap-4">
              <div className="flex justify-start items-center gap-4">
                <div className="p-1.5 bg-dashboard-yellow rounded-md flex justify-start items-center gap-2.5">
                  <div className="w-6 h-6 relative">
                    <UsersGroupIcon />
                  </div>
                </div>
                <div className="w-36 justify-center text-gray-700 text-lg font-semibold">Total Lessons</div>
              </div>
              <div className="text-dashboard-yellow pl-12"><span className="text-3xl font-semibold">{statisticsData?.total_lessons}</span><span className="text-xl font-semibold"> </span><span className="text-orange-400 text-sm font-medium">Class Sessions</span></div>
            </div>
            <div className="flex-1 self-stretch p-6 bg-white rounded-2xl shadow-small flex flex-col justify-start items-center gap-4">
              <div className="flex justify-start items-center gap-4">
                <div className="p-1.5 bg-dashboard-lightGreen rounded-md flex justify-start items-center gap-2.5">
                  <div className="w-6 h-6 relative overflow-hidden">
                    <UserCheckIcon />
                  </div>
                </div>
                <div className="w-48 self-stretch justify-center text-gray-700 text-lg font-semibold">Attended</div>
              </div>
              <div className="text-dashboard-lightGreen self-stretch flex-1 pl-12 flex flex-col justify-between items-start">
                <div className="justify-center"><span className="text-2xl font-semibold leading-9">{statisticsData?.total_attended}/{statisticsData?.total_lessons} </span><span className="text-sm font-medium">Class Sessions</span></div>
                <div className="w-full">
                  <Progress size="small" percent={30} showInfo={false} strokeColor="#6FD195" />
                </div>
              </div>
            </div>
            <div className="flex-1 self-stretch p-6 bg-white rounded-2xl shadow-small flex flex-col justify-start items-center gap-4">
                <div className="flex justify-start items-center gap-4">
                <div className="p-1.5 bg-dashboard-lightRed rounded-md flex justify-start items-center gap-2.5">
                  <div className="w-6 h-6 relative overflow-hidden">
                    <UserCloseIcon />
                  </div>
                </div>
                <div className="w-48 self-stretch justify-center text-gray-700 text-lg font-semibold">Actual Workload</div>
              </div>             
                <div className="text-dashboard-lightRed pl-12 flex flex-col justify-between items-start">
                  <div className="justify-center"><span className="text-2xl font-semibold leading-9">{statisticsData?.total_workload} </span><span className="text-sm font-medium">Class Sessions</span></div>
                </div>
            </div>
          </div>

          <div className="w-full flex justify-between items-center gap-6 flex-wrap">
            <div className="flex-1 p-6 bg-white rounded-2xl shadow-small inline-flex flex-col gap-4">
              <div className="flex justify-start items-center gap-4">
                <div className="p-1.5 bg-dashboard-cyan rounded-md flex justify-start items-center gap-2.5">
                  <div className="w-6 h-6 relative overflow-hidden">
                    <ChartPieIcon />
                  </div>
                </div>
                <div className="justify-center text-gray-700 text-lg font-semibold">Standard Workload</div>
              </div>
              <div className="text-dashboard-cyan self-stretch pl-12 inline-flex justify-start items-center gap-2.5">
                <div className="flex-1 justify-center"><span className="text-3xl font-semibold">{statisticsData?.total_standard_workload}</span><span className="text-xl font-semibold"> </span><span className="text-sm font-medium">Class Sessions</span></div>
              </div>
            </div>
            <div className="flex-1 p-6 bg-white rounded-2xl shadow-small inline-flex flex-col justify-start gap-4">
              <div className="flex justify-start items-center gap-4">
                <div className="w-9 h-9 p-1.5 bg-dashboard-blue rounded-md flex justify-center items-center gap-2.5">
                  <div className="w-6 h-6 relative overflow-hidden">
                    <HugeClockIcon />
                  </div>
                </div>
                <div className="justify-center text-gray-700 text-lg font-semibold">Workload Ratio</div>
              </div>
              <div className="self-stretch pl-12 inline-flex justify-start items-center gap-2.5">
                <div className="flex-1 justify-center text-dashboard-blue text-3xl font-semibold">{statisticsData?.workload_ratio}</div>
              </div>
            </div>
          </div>
      </div>
  )
}

export default TeacherAttendanceStatistics