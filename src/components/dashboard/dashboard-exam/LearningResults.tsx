import React, { useEffect, useState, useMemo } from 'react'
import EChart from '@components/base/chart/Chart'
import { DashboardAPI } from '@pages/api/dashboard'
import dayjs from 'dayjs'
import { useRouter } from 'next/router'
import NoData from 'src/common/NoData'
import { ILearningResult, IMockTestResult } from 'src/type/dashboard'
import { COURSE_TYPE, DATE_FORMAT } from 'src/constants'
import {
  IconEssentional,
  MatchFailIcon,
  SuccessMatchIcon,
} from '@assets/icons/Dashboard'
import Link from 'next/link'
import { EChartsOption } from 'echarts'
import Tooltip from 'src/common/Tooltip'

const LearningResults = () => {
  const router = useRouter()
  const [results, setResults] = useState<ILearningResult[] | IMockTestResult[]>(
    [],
  )
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [hasLearning, setHasLearning] = useState<boolean>(false)
  const [mockTestId, setMockTestId] = useState<string>('')
  const courseInfo = useMemo(
    () => JSON.parse(localStorage.getItem('courseInfo') as any),
    [],
  )
  const isNormal = courseInfo?.courseType == COURSE_TYPE.NORMAL_COURSE
  const resultFormula =
    courseInfo?.category === 'ACCA'
      ? '%Results = Graded activities (70%) + Final test (30%)'
      : '%Results = Module test (40%) + Topic test (60%)'

  useEffect(() => {
    const getLearningResults = async (id: string) => {
      try {
        const res = (await DashboardAPI.getMockTestResults(id)) as any
        if (res && res.success) {
          const data = res.data.reports
          setResults(data)
          setHasLearning(data.some((e: ILearningResult) => e.score))
          if (!isNormal && res.data.mock_tests?.length === 1) {
            setMockTestId(res.data.mock_tests[0].id)
          }
        }
      } catch (error) {
        setResults([])
      } finally {
        setIsLoading(false)
      }
    }
    if (router?.query?.courseId)
      getLearningResults(router.query.courseId as string)
  }, [router?.query?.courseId, isNormal])

  const option = useMemo(() => {
    if (!results || results.length === 0) return null
    const maxValues = results.map((result: any) => {
      const learning = result?.score || 0
      const mock = result?.mock_test_score || 0
      return Math.max(learning, mock, 100)
    })
    const indicator = results.map((result: any, idx: any) => ({
      text: result?.short_name || result?.name,
      max: maxValues[idx],
    }))
    return {
      title: { text: '' },
      tooltip: {
        borderWidth: 0,
        trigger: 'item',
        formatter: function (params: any) {
          const values = params.value
          const indicators = results.map(
            (e: ILearningResult | IMockTestResult) =>
              'name' in e ? e.name : e.short_name,
          )
          let tooltipText = `<strong>${params.name}</strong><br/>`
          values.forEach((val: any, i: number) => {
            tooltipText += `<span class='text-[#7086FD]'>●</span> ${indicators[i]}: ${val}%<br/>`
          })
          return tooltipText
        },
      },
      radar: [
        {
          shape: 'circle',
          radius: '75%',
          indicator,
          axisLine: { lineStyle: { color: '#D1D5DB' } },
          splitLine: { lineStyle: { color: '#D1D5DB' } },
          splitArea: { areaStyle: { color: 'transparent' } },
          name: {
            color: '#374151',
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
              value: results?.map((result: any) => result?.score),
              areaStyle: { color: 'rgba(111, 211, 176, 0.45)' },
              lineStyle: { color: '#6FD3B0', width: 1 },
              itemStyle: { color: '#6FD3B0' },
            },
            {
              name: 'Mock test results',
              value: results?.map((result: any) => result?.mock_test_score),
              areaStyle: { color: 'rgba(251, 140, 91, 0.45)' },
              lineStyle: { color: '#FB8C5B', width: 1 },
              itemStyle: { color: '#FB8C5B' },
            },
          ],
        },
      ],
    }
  }, [results])

  return (
    <div className="shadow-matchingquiz w-full rounded-2xl bg-white p-8 xl:flex xl:h-[48vh]">
      <div className="w-full">
        <div className="mb-5 flex items-center justify-between pb-3">
          <div className="flex w-full flex-row justify-between xl:flex-col">
            <div className="flex">
              <div className="min-w-fit text-xl font-semibold">
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
            <div className="text-sm text-gray-400">
              {`Last Update: ${dayjs().format(DATE_FORMAT.DATE_TIME_DASH)}`}
            </div>
          </div>
        </div>
        <div className="flex">
          {option && (
            <div className="flex grow flex-col gap-5 px-5 xl:flex-row 2xl:px-12">
              <div className="grow">
                <EChart option={option as EChartsOption} />
              </div>
              <div className="flex flex-row items-start justify-center gap-10 xl:flex-col xl:gap-4">
                {!isNormal && (
                  <div className="flex items-center justify-center gap-2.5 font-medium">
                    <span className="min-h-3 min-w-3 rounded-full bg-dashboard-mock-test"></span>
                    <Link
                      href={
                        mockTestId
                          ? `${window.location.origin}/courses/test/test-result/${mockTestId}`
                          : ''
                      }
                      target="_blank"
                      className={`inline-block min-w-fit text-base font-bold text-gray-800 ${!mockTestId ? 'pointer-events-none' : 'hover:text-dashboard-learing'}`}
                      rel="noreferrer"
                    >
                      Mock test results
                    </Link>
                  </div>
                )}

                <div className="flex items-center justify-center gap-2.5">
                  <span className="min-h-3 min-w-3 rounded-full bg-dashboard-learing"></span>
                  <span className="min-w-fit text-base font-medium text-gray-800">
                    Learning results
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="w-full xl:w-[515px]">
        <LearningMockTest results={results as ILearningResult[]} />
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
    <div className="w-full flex-col xl:w-[515px]">
      <div className="mb-6 mt-10 flex text-xl font-semibold text-gray-800 xl:mb-10 xl:mt-0">
        <div>Learning & Mock test Comparision</div>
        <div className="ms-2">
          <IconEssentional />
        </div>
      </div>
      <div className="h-96 overflow-y-auto">
        {results?.map((result) => {
          const differenceResult =
            (result?.mock_test_score || 0) - (result?.score || 0)

          const hasBothScores =
            result?.score !== 0 && result?.mock_test_score != 0

          return (
            <div
              key={result?.id}
              className="mb-4 flex flex-col rounded-lg bg-gray-100 px-4 py-2"
            >
              <div className="mb-2 text-lg font-semibold text-gray-800 xl:font-medium">
                {result?.short_name || result?.name}
              </div>

              <div className="items-cente mb-1 flex justify-between">
                <div className="text-sm text-gray-800">
                  Learning result: {result?.score}%
                </div>
                {hasBothScores && (
                  <div className="flex items-center">
                    {differenceResult > 0 ? (
                      <SuccessMatchIcon />
                    ) : (
                      <MatchFailIcon />
                    )}
                    <div
                      className={`ms-1 text-lg font-semibold ${differenceResult > 0 ? 'text-success' : 'text-error'}`}
                    >
                      {differenceResult > 0 ? '+' : ''}
                      {differenceResult}%
                    </div>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-800">
                  Mock test: {result?.mock_test_score}%
                </div>
                {hasBothScores && (
                  <div className="mt-2 text-base text-gray-400">difference</div>
                )}
              </div>
              {hasBothScores && (
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
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default LearningResults
