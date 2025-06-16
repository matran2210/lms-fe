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
import { COURSE_TYPE, DATE_FORMAT } from 'src/constants'
import { IconEssentional } from '@assets/icons/Dashboard'
import Link from 'next/link'

const LearningResults = () => {
  const router = useRouter()
  const [option, setOption] = useState<any>()
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [hasLearning, setHasLearning] = useState<boolean>(false)
  const [mockTestId, setMockTestId] = useState<string>('')
  const courseInfo = JSON.parse(localStorage.getItem('courseInfo') as any)
  const isNormal = courseInfo?.courseType == COURSE_TYPE.NORMAL_COURSE

  // function này xử lí trả ra kết quả dashboard cho chart với type là khóa chính hoặc khóa ôn
  const handleLearningResults = (
    data: ILearningResult[] | IMockTestResult | any,
  ) => {
    const results = isNormal ? data : data.reports
    if (!isNormal && data.mock_tests?.length == 1)
      setMockTestId(data.mock_tests[0].id)

    if (results.length) {
      let total = 0
      const hasLearning = results.some((e: ILearningResult) => e.score)
      // Tính max cho từng section
      const maxValues = results.map((result: any) => {
        const learning = result?.score || 0
        const mock = result?.mock_test_score || 0
        const fixed = Math.max(learning, mock, 100) // 10 là min để không bị quá nhỏ
        return fixed
      })
      const indicator = results.map((result: any, idx: any) => ({
        text: result?.short_name || result?.name,
        max: maxValues[idx],
      }))

      const option = {
        title: {
          text: '',
        },
        tooltip: {
          trigger: 'item',
          formatter: function (params: any) {
            const values = params.value
            const indicators = results.map((e: ILearningResult) => e.name)
            let tooltipText = `<strong>${params.name}</strong><br/>`
            values.forEach((val: any, i: number) => {
              tooltipText += `<span class='text-[#7086FD]'>●</span> ${indicators[i]}: ${val}%<br/>`
            })
            return tooltipText
          },
        },
        radar: [
          {
            shape: 'circle', // Hình tròn
            radius: '75%',
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
                value: results?.map(
                  (result: { score: number }) => result?.score,
                ),
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
              {
                name: 'Mock test results',
                value: results?.map(
                  (result: { mock_test_score: number }) =>
                    result?.mock_test_score,
                ),
                areaStyle: {
                  color: 'rgba(251, 140, 91, 0.45)',
                },
                lineStyle: {
                  color: '#FB8C5B',
                  width: 1,
                },
                itemStyle: {
                  color: '#FB8C5B',
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

  const [results, setResults] = useState([])

  const getLearningResults = async (id: string) => {
    try {
      const res = isNormal
        ? await DashboardAPI.getLearningResults(id)
        : await DashboardAPI.getMockTestResults(id)
      if (res && res.success) {
        handleLearningResults(res.data)
        setResults(isNormal ? res?.data : (res?.data as any)?.reports)
      }
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
      <div className="flex h-[55vh] w-full rounded-2xl bg-white p-8 shadow-matchingquiz">
        <div className="w-full">
          <div className="mb-5 flex items-center justify-between pb-3">
            {isNormal ? (
              <Tooltip
                title={
                  <div className="text-[#33475B]">
                    {courseInfo?.category == 'ACCA'
                      ? '%Results = Graded activities (70%) + Final test (30%)'
                      : '%Results = Module test (40%) + Topic test (60%)'}
                  </div>
                }
                className="dashboard_tooltip"
              >
                <div className="flex min-w-fit items-center gap-1 text-lg font-bold 4xl:text-xl">
                  Your Learning Results
                  <Image src={infoIcon} alt="" width={16} height={16} />
                </div>
              </Tooltip>
            ) : (
              <div className="flex-col">
                <div className="flex">
                  <div className="min-w-fit text-xl font-semibold">
                    Your Learning Results
                  </div>
                  <div className="ms-2">
                    <IconEssentional />
                  </div>
                </div>
                <div className="text-sm text-gray-400">
                  {`Last Update: ${dayjs().format(DATE_FORMAT.DATE_TIME_DASH)}`}
                </div>
              </div>
            )}
          </div>

          <div className="flex">
            {option && (
              <div
                className={`flex grow ${isNormal ? 'flex-col' : 'flex-row gap-5 px-5 2xl:px-12'}`}
              >
                <div className="grow">
                  <EChart option={option} />
                </div>
                <div
                  className={`${isNormal ? '' : 'flex flex-col items-start justify-center gap-4'}`}
                >
                  {!isNormal && (
                    <div className="flex items-center justify-center gap-2.5">
                      <span className="min-h-3 min-w-3 rounded-full bg-[#FB8C5B]"></span>
                      <Link
                        href={
                          mockTestId
                            ? `${window.location.origin}/courses/test/test-result/${mockTestId}`
                            : ''
                        }
                        target="_blank"
                        className={`inline-block min-w-fit text-base font-medium text-gray-800 ${!mockTestId ? 'pointer-events-none' : 'hover:text-[#6FD195]'}`}
                        rel="noreferrer"
                      >
                        Mock test results
                      </Link>
                    </div>
                  )}

                  {isNormal || hasLearning ? (
                    <div className="flex items-center justify-center gap-2.5">
                      <span className="min-h-3 min-w-3 rounded-full bg-[#6FD3B0]"></span>
                      <span className="min-w-fit text-base font-medium text-gray-800">
                        Learning results
                      </span>
                    </div>
                  ) : null}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="w-[515px]">
          <LearningMockTest results={results} />
        </div>

        {!isLoading && !option && (
          <div className="flex grow items-center justify-center">
            <NoData />
          </div>
        )}
      </div>
  )
}

const LearningMockTest = ({ results }: { results: ILearningResult[] }) => {
  return (
    <div className="w-[515px] flex-col">
      <div className="mb-10 flex text-xl font-semibold text-gray-800">
        <div>Learning & Mock test Comparision</div>
        <div className="ms-2">
          <IconEssentional />
        </div>
      </div>
      <div className="h-96 overflow-y-auto">
        {results?.map((result) => {
          const differenceResult =
            (result?.mock_test_score || 0) - (result?.score || 0)

          return (
            <div
              key={result?.id}
              className="mb-4 flex flex-col rounded-lg bg-gray-100 px-4 py-2"
            >
              <div className="mb-2 text-lg font-medium text-gray-800">
                {result?.short_name || result?.name}
              </div>

              <div className="items-cente mb-1 flex justify-between">
                <div className="text-sm text-gray-800">
                  Learning result: {result?.score}%
                </div>
                <div className="flex items-center">
                  {differenceResult > 0 ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="11"
                      viewBox="0 0 16 11"
                      fill="none"
                    >
                      <path
                        d="M6.24822 6.05276C5.45523 6.84688 4.69673 7.60763 3.93749 8.36875C3.2876 9.01864 2.63771 9.66753 1.98782 10.3154C1.77523 10.5265 1.51877 10.5917 1.22969 10.5066C0.940616 10.4215 0.76852 10.2164 0.704781 9.92661C0.643292 9.64466 0.750898 9.41332 0.948115 9.21423C1.84946 8.31338 2.75006 7.41228 3.64991 6.51094C4.31705 5.84405 4.98469 5.17754 5.65282 4.5114C6.01914 4.14771 6.44319 4.14583 6.808 4.50577C7.31492 5.00569 7.81846 5.50936 8.31862 6.01677C8.37524 6.07376 8.41086 6.15137 8.45098 6.21136L12.6638 1.99482C12.6038 1.99107 12.546 1.9847 12.4879 1.98432C12.0005 1.98432 11.5131 1.9892 11.0257 1.98132C10.7036 1.97645 10.461 1.8201 10.3287 1.52727C10.2023 1.24757 10.2443 0.976118 10.4411 0.737658C10.5118 0.649278 10.6017 0.578298 10.7041 0.530193C10.8065 0.482088 10.9186 0.458143 11.0317 0.460204C12.1985 0.45758 13.3683 0.45533 14.5366 0.461329C14.9779 0.463579 15.3044 0.798772 15.3059 1.23932C15.3097 2.40163 15.3097 3.56393 15.3059 4.72624C15.3059 5.16791 14.9599 5.5136 14.5407 5.50985C14.1215 5.50611 13.7983 5.17616 13.7908 4.73336C13.7837 4.25869 13.789 3.78365 13.789 3.3086V3.11176L13.7207 3.06752C13.6783 3.13433 13.6309 3.19787 13.579 3.25761C12.0872 4.75211 10.5944 6.24548 9.10037 7.73773C8.71156 8.12579 8.29125 8.12654 7.90394 7.7411C7.39528 7.23469 6.88749 6.72665 6.38058 6.21699C6.33708 6.17312 6.30221 6.11913 6.24822 6.05276Z"
                        fill="#10B367"
                      />
                    </svg>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="15"
                      height="11"
                      viewBox="0 0 15 11"
                      fill="none"
                    >
                      <path
                        d="M5.74822 4.94724C4.95523 4.15312 4.19673 3.39237 3.43749 2.63125C2.7876 1.98136 2.13771 1.33247 1.48782 0.684578C1.27523 0.473489 1.01877 0.408251 0.729693 0.493361C0.440616 0.578472 0.26852 0.783562 0.204781 1.07339C0.143292 1.35534 0.250898 1.58668 0.448115 1.78577C1.34946 2.68662 2.25006 3.58772 3.14991 4.48906C3.81705 5.15595 4.48469 5.82246 5.15282 6.4886C5.51914 6.85229 5.94319 6.85417 6.308 6.49423C6.81492 5.99431 7.31846 5.49064 7.81862 4.98323C7.87524 4.92624 7.91086 4.84863 7.95098 4.78864L12.1638 9.00518C12.1038 9.00893 12.046 9.0153 11.9879 9.01568C11.5005 9.01568 11.0131 9.0108 10.5257 9.01868C10.2036 9.02355 9.96101 9.1799 9.82866 9.47273C9.70231 9.75243 9.7443 10.0239 9.94114 10.2623C10.0118 10.3507 10.1017 10.4217 10.2041 10.4698C10.3065 10.5179 10.4186 10.5419 10.5317 10.5398C11.6985 10.5424 12.8683 10.5447 14.0366 10.5387C14.4779 10.5364 14.8044 10.2012 14.8059 9.76068C14.8097 8.59837 14.8097 7.43607 14.8059 6.27376C14.8059 5.83209 14.4599 5.4864 14.0407 5.49015C13.6215 5.49389 13.2983 5.82384 13.2908 6.26664C13.2837 6.74131 13.289 7.21635 13.289 7.6914V7.88824L13.2207 7.93248C13.1783 7.86567 13.1309 7.80213 13.079 7.74239C11.5872 6.24789 10.0944 4.75452 8.60037 3.26227C8.21156 2.87421 7.79125 2.87346 7.40394 3.2589C6.89528 3.76531 6.38749 4.27335 5.88058 4.78301C5.83708 4.82688 5.80221 4.88087 5.74822 4.94724Z"
                        fill="#F80903"
                      />
                    </svg>
                  )}
                  <div
                    className={`ms-1 text-lg font-semibold ${differenceResult > 0 ? 'text-success' : 'text-error'}`}
                  >
                    {differenceResult > 0 ? '+' : ''}
                    {differenceResult}%
                  </div>
                </div>
              </div>

              <div className="mb-2 flex items-center justify-between">
                <div className="text-sm text-gray-800">
                  Mock test: {result?.mock_test_score}%
                </div>
                <div className="text-base text-gray-400">difference</div>
              </div>

              <div
                className={
                  differenceResult > 0
                    ? 'text-sm text-success'
                    : 'text-sm text-error'
                }
              >
                {differenceResult > 0
                  ? 'Okay, keep it up!'
                  : 'Review more formulas'}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default LearningResults
