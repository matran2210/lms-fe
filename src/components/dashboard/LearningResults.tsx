import infoIcon from '@assets/images/info-icon.svg'
import EChart, { EChartsProps } from '@components/base/chart/Chart'
import { DashboardAPI } from '@pages/api/dashboard'
import dayjs from 'dayjs'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import NoData from 'src/common/NoData'
import { ILearningResult, IMockTestResult } from 'src/type/dashboard'

import Tooltip from 'src/common/Tooltip'
import { COURSE_TYPE } from 'src/constants'

const LearningResults = () => {
  const router = useRouter()
  const [option, setOption] = useState<any>()
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [hasLearning, setHasLearning] = useState<boolean>(false)
  const [mockTestId, setMockTestId] = useState<string>('')
  const courseInfo = JSON.parse(localStorage.getItem('courseInfo') as any)
  const isNormal = courseInfo?.courseType == COURSE_TYPE.NORMAL_COURSE

  const handleLearningResults = (
    data: ILearningResult[] | IMockTestResult | any,
  ) => {
    const results = isNormal ? data : data.reports

    if (!isNormal && data.mock_tests?.length == 1)
      setMockTestId(data.mock_tests[0].id)

    if (results.length) {
      let total = 0
      const hasLearning = results.some((e: ILearningResult) => e.score)
      const indicator = results.map((e: ILearningResult, index: number) => {
        total += e.score
        const name = `${e.short_name || e.name}\n${hasLearning ? e.score : e.mock_test_score || 0}%`
        if (index) return { name: name, max: 100 }

        return {
          name: name,
          max: 100,
          axisLabel: {
            show: true,
            align: '',
            fontSize: 10,
          },
        }
      })

      const option: EChartsProps['option'] = {
        title: {
          show: false,
        },
        responsive: true,
        maintainAspectRatio: false,
        radar: {
          indicator: indicator,
          radius: '70%',
          axisName: {
            fontSize: 12,
            color: '#374151',
            lineHeight: 16,
            fontFamily: 'Roboto',
          },
          z: 1,
        },
        series: [
          {
            name: 'Learning Results',
            type: 'radar',
            data: [
              {
                value: results.map((e: ILearningResult) => e.score),
                name: 'Learning results',
                lineStyle: {
                  color: '#7086FD',
                },
                areaStyle: {
                  color: 'rgba(112, 134, 253, 0.5)',
                },
                symbol: 'none',
              },
              {
                value: isNormal
                  ? []
                  : results.map((e: ILearningResult) => e.mock_test_score),
                name: 'Learning results',
                lineStyle: {
                  color: '#6FD195',
                },
                areaStyle: {
                  color: 'rgba(111, 209, 149, 0.5)',
                },
                itemStyle: {
                  color: '#6FD195',
                },
              },
            ],
          },
        ],
        graphic: {
          type: 'group',
          left: 'center',
          top: 'middle',
          children: [
            {
              type: 'rect',
              invisible: !isNormal,
              shape: {
                width: 60,
                height: 30,
              },
              style: {
                fill: '#fff',
                stroke: '#FFFFFF',
                lineWidth: 2,
                shadowColor: 'rgba(0, 0, 0, 0.1)',
                shadowBlur: 10,
              },
              x: -30,
              y: -15,
              z: 3,
            },
            {
              type: 'text',
              invisible: !isNormal,
              style: {
                text: `${parseFloat((total / results.length).toFixed(2))}%`,
                fontSize: 16,
                fontWeight: 'bold',
                fill: '#7086FD',
                align: 'center',
                verticalAlign: 'middle',
              },
              x: 0,
              y: 0,
              z: 4,
            },
          ],
        },
      }

      setHasLearning(hasLearning)
      setOption(option)
    } else {
      setOption(null)
    }
  }

  const getLearningResults = async (id: string) => {
    try {
      const res = isNormal
        ? await DashboardAPI.getLearningResults(id)
        : await DashboardAPI.getMockTestResults(id)

      if (res && res.success) handleLearningResults(res.data)
    } catch (error) {
      setOption(null)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (router?.query?.courseId)
      getLearningResults(router.query.courseId as string)
  }, [router?.query?.courseId])

  return (
    <div className="flex h-[55vh] w-full grow flex-col bg-white px-3 pb-7 pt-4 shadow-activity 3.5xl:px-8">
      <div className="mb-5 flex items-center justify-between border-b pb-3">
        {isNormal ? (
          <Tooltip
            title={
              <div className="text-support-1">
                {courseInfo?.category == 'ACCA'
                  ? '%Results = Graded activities (70%) + Final test (30%)'
                  : '%Results = Module test (40%) + Topic test (60%)'}
              </div>
            }
          >
            <div className="flex min-w-fit items-center gap-1 text-lg-xl font-bold 4xl:text-xl">
              Your Learning Results
              <Image src={infoIcon} alt="" width={16} height={16} />
            </div>
          </Tooltip>
        ) : (
          <div className="min-w-fit text-lg-xl font-bold 4xl:text-xl">
            Your Learning Results
          </div>
        )}
        <div className="text-xsm text-gray-11 4xl:text-sm">
          {`Last Update: ${dayjs().format('HH:mm - DD/MM/YY')}`}
        </div>
      </div>
      {option && (
        <div
          className={`flex grow gap-5 ${isNormal ? 'flex-col' : 'flex-row'} px-5 2xl:px-12`}
        >
          <div className="grow">
            <EChart option={option} />
          </div>
          <div
            className={`${isNormal ? '' : 'flex flex-col items-start justify-center gap-4'}`}
          >
            {!isNormal && (
              <div className="flex items-center justify-center gap-2.5">
                <span className="h-3 w-3 rounded-full bg-green-4"></span>
                <a
                  href={
                    mockTestId
                      ? `${window.location.origin}/courses/test/test-result/${mockTestId}`
                      : ''
                  }
                  target="_blank"
                  className={`inline-block min-w-fit font-medium ${!mockTestId ? 'pointer-events-none' : 'hover:text-green-4'}`}
                  rel="noreferrer"
                >
                  Mock test results
                </a>
              </div>
            )}
            {isNormal || hasLearning ? (
              <div className="flex items-center justify-center gap-2.5">
                <span className="h-3 w-3 rounded-full bg-blue-5"></span>
                <span className="min-w-fit font-medium">Learning results</span>
              </div>
            ) : null}
          </div>
        </div>
      )}
      {!isLoading && !option && (
        <div className="flex grow items-center justify-center">
          <NoData />
        </div>
      )}
    </div>
  )
}

export default LearningResults
