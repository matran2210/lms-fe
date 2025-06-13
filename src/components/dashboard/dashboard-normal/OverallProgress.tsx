import { IconEssentional } from '@assets/icons/Dashboard'
import EChart from '@components/base/chart/Chart'
import { DashboardAPI } from '@pages/api/dashboard'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import { COURSE_TYPE } from 'src/constants'

const OverallProgress = () => {
  const router = useRouter()
  const [option, setOption] = useState<any>()
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const courseInfo = JSON.parse(localStorage.getItem('courseInfo') as any)
  const isNormal = courseInfo?.courseType == COURSE_TYPE.NORMAL_COURSE

  const handlePieChartOption = (data: any) => {
    const values = {
      completed: data.completed_activities,
      uncompleted: data.uncompleted_activities,
    }

    const option = {
      title: {
        text: `${values.completed}/${values.uncompleted + values.completed}`,
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
    <div className="rounded-2xl bg-white p-6 shadow-matchingquiz">
      <div className="flex-col">
        <div className="flex">
          <div className="min-w-fit text-xl font-semibold">
            Overall Progress
          </div>
          <div className="ms-2">
            <IconEssentional />
          </div>
        </div>
      </div>
      {option && (
        <>
          <div className="flex flex-row justify-around gap-2 4xl:gap-8">
            <EChart option={option} width="220px" height="220px" minHeight='270px' />
            <div className="flex min-w-[180px] flex-col justify-center gap-1 text-sm tracking-tight 2xl:tracking-normal 3xl:gap-3">
              <div className="flex flex-row items-center gap-0.5 2xl:gap-[5px]">
                <span className="h-3 w-3 rounded-full bg-primary"></span>
                <span className="text-base font-medium">
                  <span className="text-ink-800">Not completed</span>{' '}
                  <span className="text-ink">(160)</span>
                </span>
              </div>
              <div className="flex flex-row items-center gap-0.5 2xl:gap-[5px]">
                <span className="h-3 w-3 rounded-full bg-primary-100"></span>
                <span className="text-base font-medium">
                  <span className="text-ink-800">Not completed</span>{' '}
                  <span className="text-ink">(160)</span>
                </span>
              </div>

              <div className="mt-10 flex flex-row items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="25"
                  height="25"
                  viewBox="0 0 25 25"
                  fill="none"
                >
                  <path
                    d="M22.0312 9.12718L22.0312 9.19971C22.0312 10.0605 22.0312 10.4908 21.824 10.8429C21.6168 11.1951 21.2406 11.4041 20.4881 11.8221L19.6948 12.2628C20.2415 10.4147 20.4239 8.42899 20.4913 6.73082C20.4942 6.65801 20.4975 6.5843 20.5007 6.50981L20.503 6.45763C21.1543 6.6838 21.52 6.85242 21.7481 7.16892C22.0312 7.56177 22.0312 8.08357 22.0312 9.12718Z"
                    fill="#E68200"
                  />
                  <path
                    d="M2.03125 9.12718L2.03125 9.19971C2.03128 10.0605 2.03129 10.4908 2.23848 10.8429C2.44567 11.1951 2.82188 11.4041 3.5743 11.8221L4.36806 12.2631C3.82132 10.4149 3.63892 8.42906 3.5715 6.73082C3.56861 6.65801 3.56535 6.5843 3.56206 6.50981L3.55975 6.45751C2.90826 6.68374 2.54251 6.85236 2.31435 7.16892C2.03121 7.56177 2.03122 8.08358 2.03125 9.12718Z"
                    fill="#E68200"
                  />
                  <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M12.0314 2.96484C13.8149 2.96484 15.2843 3.12193 16.4084 3.31159C17.5471 3.50372 18.1165 3.59978 18.5922 4.18568C19.0679 4.77157 19.0428 5.40482 18.9925 6.67131C18.8199 11.0193 17.8816 16.4501 12.7812 16.9305V20.4648H14.2114C14.6881 20.4648 15.0985 20.8013 15.192 21.2687L15.3813 22.2148H18.0312C18.4455 22.2148 18.7812 22.5506 18.7812 22.9648C18.7812 23.3791 18.4455 23.7148 18.0312 23.7148H6.03125C5.61704 23.7148 5.28125 23.3791 5.28125 22.9648C5.28125 22.5506 5.61704 22.2148 6.03125 22.2148H8.68125L8.87047 21.2687C8.96396 20.8013 9.37437 20.4648 9.85105 20.4648H11.2812V16.9305C6.18121 16.4499 5.24294 11.0192 5.07032 6.67131C5.02004 5.40482 4.9949 4.77157 5.47062 4.18568C5.94633 3.59978 6.5157 3.50372 7.65443 3.31159C8.77849 3.12193 10.2479 2.96484 12.0314 2.96484ZM12.9836 7.16371L12.8853 6.98736C12.5053 6.30568 12.3153 5.96484 12.0312 5.96484C11.7472 5.96484 11.5572 6.30568 11.1772 6.98736L11.0789 7.16371C10.9709 7.35742 10.9169 7.45428 10.8327 7.51819C10.7486 7.58209 10.6437 7.60581 10.434 7.65326L10.2431 7.69645C9.50521 7.86341 9.13626 7.94689 9.04848 8.22916C8.9607 8.51144 9.21222 8.80557 9.71528 9.39382L9.84543 9.54601C9.98838 9.71317 10.0599 9.79676 10.092 9.90016C10.1242 10.0036 10.1134 10.1151 10.0917 10.3381L10.0721 10.5412C9.99601 11.326 9.95799 11.7185 10.1878 11.8929C10.4176 12.0674 10.7631 11.9083 11.454 11.5902L11.6327 11.5079C11.829 11.4175 11.9272 11.3723 12.0312 11.3723C12.1353 11.3723 12.2335 11.4175 12.4298 11.5079L12.6085 11.5902C13.2994 11.9083 13.6449 12.0674 13.8747 11.8929C14.1045 11.7185 14.0665 11.326 13.9904 10.5412L13.9708 10.3381C13.9491 10.1151 13.9383 10.0036 13.9705 9.90016C14.0026 9.79676 14.0741 9.71317 14.2171 9.54601L14.3472 9.39382C14.8503 8.80556 15.1018 8.51144 15.014 8.22916C14.9262 7.94689 14.5573 7.86341 13.8194 7.69645L13.6285 7.65326C13.4188 7.60581 13.314 7.58209 13.2298 7.51819C13.1456 7.45428 13.0916 7.35742 12.9836 7.16371Z"
                    fill="#E68200"
                  />
                </svg>
                <span className="text-base text-ink-800">
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
