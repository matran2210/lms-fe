import EChart from '@components/base/chart/Chart'
import { DashboardAPI } from '@pages/api/dashboard'
import dayjs from 'dayjs'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { ILearningResult, IMockTestResult } from 'src/type/dashboard'
import { COURSE_TYPE, DATE_FORMAT } from 'src/constants'
import { IconEssentional } from '@assets/icons/Dashboard'
import Tooltip from 'src/common/Tooltip'
import useIsMobile from 'src/hooks/useIsMobile'

const LearningResult = () => {
  const router = useRouter()
  const [option, setOption] = useState<any>()
  const [hasLearning, setHasLearning] = useState<boolean>(false)
  const [mockTestId, setMockTestId] = useState<string>('')
  const courseInfo = JSON.parse(localStorage.getItem('courseInfo') as any)
  const isMobile = useIsMobile()

  const isNormal = courseInfo?.courseType == COURSE_TYPE.NORMAL_COURSE
  const handleLearningResults = (
    data: ILearningResult[] | IMockTestResult | any,
  ) => {
    if (data.mock_tests?.length == 1) setMockTestId(data.mock_tests[0].id)

    if (data.length) {
      let total = 0
      const hasLearning = data.some((e: ILearningResult) => e.score)
      // Tính max cho từng section
      const maxValues = data.map((result: any) => {
        const learning = result?.score || 0
        const mock = result?.mock_test_score || 0
        const fixed = Math.max(learning, mock, 100) // 10 là min để không bị quá nhỏ
        return fixed
      })
      const indicator = data.map((e: ILearningResult, index: number) => {
        total += e.score
        return {
          name: e?.short_name || e?.name,
          max: maxValues[index],
        }
      })

      const option = {
        title: {
          text: '',
        },
        tooltip: {
          trigger: 'item',
          borderWidth: 0,
          formatter: function (params: any) {
            const values = params.value
            const indicators = data?.map((e: ILearningResult) => e.name)
            let tooltipText = `<strong>${params.name}</strong><br/>`
            values.forEach((val: any, i: number) => {
              tooltipText += `<span class='text-[#7086FD]'>●</span> ${indicators[i]}: ${val}%<br/>`
            })
            return tooltipText
          },
        },
        graphic:
          total > 0
            ? {
                type: 'group',
                left: 'center',
                top: 'middle',
                invisible: true,
                children: [
                  {
                    type: 'rect',
                    invisible: false,
                    shape: {
                      width: total ? 60 : 50,
                      height: 30,
                      r: 8,
                    },
                    style: {
                      fill: '#fff',
                      stroke: '#FFFFFF',
                      lineWidth: 2,
                      shadowColor: 'rgba(0, 0, 0, 0.1)',
                      shadowBlur: 10,
                    },
                    x: total ? -30 : -25,
                    y: -15,
                    z: 3,
                  },
                  {
                    type: 'text',
                    invisible: false,
                    style: {
                      text: `${parseFloat((total / data.length).toFixed(2))}%`,
                      fontSize: 20,
                      fontWeight: 600,
                      fill: '#6FD3B0',
                      align: 'center',
                      verticalAlign: 'middle',
                    },
                    x: 0,
                    y: 0,
                    z: 4,
                  },
                ],
              }
            : undefined,

        radar: [
          {
            shape: 'circle', // Hình tròn
            radius: '80%',
            indicator,
            axisLine: {
              lineStyle: {
                color: '#D1D5DB', // đường trục
              },
            },
            splitLine: {
              lineStyle: {
                color: '#D1D5DB', // đường chia tròn
              },
            },
            splitArea: {
              areaStyle: {
                color: 'transparent', // vùng nền giữa các vòng tròn
              },
            },
            name: {
              color: '#374151', // màu chữ (gray-700)
              fontSize: 14,
              fontWeight: '500',
              lineHeight: 22,
              formatter: function (name: string) {
                const maxLength = 16
                return name.length > maxLength
                  ? name.slice(0, maxLength) + '…'
                  : name
              },
            },
          },
        ],
        series: [
          {
            type: 'radar',
            data: [
              {
                name: 'Learning results',
                value: data?.map((result: { score: number }) => result?.score),
                areaStyle: {
                  color: 'rgba(111, 211, 176, 0.45)',
                },
                lineStyle: {
                  color: '#6FD3B0',
                  width: 1,
                },
                itemStyle: {
                  color: '#6FD3B0',
                },
              },
            ],
          },
        ],
      }

      setHasLearning(hasLearning)
      setOption(option)
    } else {
      setOption(null)
    }
  }

  const getLearningResults = async (id: string) => {
    try {
      const res = await DashboardAPI.getLearningResults(id)

      if (res && res.success) handleLearningResults(res.data)
    } catch (error) {
      setOption(null)
    }
  }

  useEffect(() => {
    if (router?.query?.courseId)
      getLearningResults(router.query.courseId as string)
  }, [router?.query?.courseId])

  const resultFormula =
    courseInfo?.category === 'ACCA'
      ? '%Results = Graded activities (70%) + Final test (30%)'
      : '%Results = Module test (40%) + Topic test (60%)'

  return (
    <div className="shadow-matchingquiz flex h-auto w-full rounded-2xl bg-white p-8 xl:h-[55vh]">
      <div className="w-full">
        <div className="mb-6 flex items-center justify-between md:mb-5 md:pb-3">
          <div className="w-full justify-between md:flex">
            <div className="flex">
              <div className="mb-2 min-w-fit text-lg font-semibold md:mb-0 md:text-xl">
                Your Learning Results
              </div>
              <Tooltip
                title={<div className="text-center">{resultFormula}</div>}
                placement="bottom"
              >
                <div className="ms-2">
                  <IconEssentional />
                </div>
              </Tooltip>
            </div>
            <div className="text-xs text-gray-400 md:text-sm">
              {`Last Update: ${dayjs().format(DATE_FORMAT.DATE_TIME_DASH)}`}
            </div>
          </div>
        </div>

        <div className="flex">
          {option && (
            <div className={`flex grow flex-col`}>
              <div className="grow">
                <EChart
                  option={option}
                  height={isMobile ? '350px' : '420px'}
                  minHeight={isMobile ? '350px' : '420px'}
                />
              </div>
              {isNormal && (
                <div className="flex items-center justify-center gap-2.5">
                  <span className="min-h-3 min-w-3 rounded-full bg-dashboard-learing"></span>
                  <span className="min-w-fit text-sm font-medium text-gray-800 xl:text-base">
                    Learning results
                  </span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default LearningResult
