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

const LearningResults = () => {
  const router = useRouter()
  const [option, setOption] = useState<any>()
  const [isLoading, setIsLoading] = useState<boolean>(true)

  const handleLearningResults = (data: ILearningResult[]) => {
    if (data.length) {
      const indicator = data.map((e: ILearningResult, index: number) => {
        if (index)
          return { name: `${e.short_name || e.name}\n${e.score}%`, max: 100 }

        return {
          name: `${e.short_name || e.name}\n${e.score}%`,
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
        color: ['#7086FD', '#6FD195'],
        responsive: true,
        maintainAspectRatio: false,
        radar: {
          indicator: indicator,
          axisName: {
            fontSize: 12,
            color: '#374151',
            lineHeight: 16,
            fontFamily: 'Roboto',
          },
        },
        series: [
          {
            name: 'Learning Results',
            type: 'radar',
            data: [
              {
                value: data.map((e: ILearningResult) => e.score),
                name: 'Learning results',
                areaStyle: {
                  color: 'rgba(112, 134, 253, 0.5)',
                },
                symbol: 'none',
              },
            ],
          },
        ],
      }
      setOption(option)
    }
  }

  const getLearningResults = async (id: string) => {
    try {
      const res = await DashboardAPI.getLearningResults(id)

      if (res && res.success) handleLearningResults(res.data)
    } catch (error) {
      return
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (router?.query?.courseId)
      getLearningResults(router.query.courseId as string)
  }, [router?.query?.courseId])

  return (
    <div className="flex h-[584px] max-h-[584px] w-full grow flex-col bg-white px-3 pb-7 pt-4 shadow-activity 3.5xl:px-8">
      <div className="flex items-center justify-between">
        <Tooltip
          arrow
          title={
            <div className="text-support-1">{`%Results = Module test (40%) + Topic test (60%)`}</div>
          }
          color="white"
          placement="top"
          mouseEnterDelay={0}
          mouseLeaveDelay={0}
        >
          <div className="flex items-center gap-1 text-lg-xl font-bold 4xl:text-xl">
            {`Your Learning Results`}
            <Image src={infoIcon} alt="" width={16} height={16} />
          </div>
        </Tooltip>
        <div className="text-xsm text-gray-9 4xl:text-sm">
          {`Last Update: ${dayjs().format('HH:mm - DD/MM/YY')}`}
        </div>
      </div>
      <div className="mb-5 mt-3 h-[1px] w-full bg-gray-2"></div>
      {option && (
        <>
          <div className="grow">
            <EChart option={option} />
          </div>
          <div className="mt-5 flex items-center justify-center gap-2.5">
            <span className="inline-block h-3 w-3 rounded-full bg-blue-2"></span>
            <span className="font-medium">Learning results</span>
          </div>
        </>
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
