import EChart, { EChartsProps } from '@components/base/chart/Chart'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import infoIcon from '@assets/images/info-icon.svg'
import Image from 'next/image'
import { DashboardAPI } from '@pages/api/dashboard'
import { ILearningResult } from 'src/type/dashboard'
import NoData from 'src/common/NoData'
import dayjs from 'dayjs'
import { Tooltip } from 'antd'
import { COURSE_TYPE } from 'src/constants'

const LearningResults = () => {
  const router = useRouter()
  const [option, setOption] = useState<any>()
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const courseInfo = JSON.parse(localStorage.getItem('courseInfo') as any)
  const isNormal = courseInfo?.courseType == COURSE_TYPE.NORMAL_COURSE

  const handleLearningResults = (data: ILearningResult[]) => {
    if (data.length) {
      let total = 0
      const hasLearning = data.some((e: ILearningResult) => e.score)
      const indicator = data.map((e: ILearningResult, index: number) => {
        total += e.score
        const name = `${e.short_name || e.name}\n${hasLearning ? e.score : e.mock_test_score}%`
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
                value: data.map((e: ILearningResult) => e.score),
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
                  : data.map((e: ILearningResult) => e.mock_test_score),
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
                text: `${total / data.length}%`,
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
            arrow
            title={
              <div className="text-support-1">
                {courseInfo?.category == 'ACCA'
                  ? '%Results = Graded activities (70%) + Final test (30%)'
                  : '%Results = Module test (40%) + Topic test (60%)'}
              </div>
            }
            color="white"
            placement="top"
            mouseEnterDelay={0}
            mouseLeaveDelay={0}
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
          className={`flex grow gap-5 ${isNormal ? 'flex-col' : 'flex-row'}`}
        >
          <div className="grow">
            <EChart option={option} />
          </div>
          <div className="flex items-center justify-center gap-2.5">
            <span className="inline-block h-3 w-3 rounded-full bg-blue-5"></span>
            <span className="font-medium">Learning results</span>
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
