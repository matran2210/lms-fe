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
import { COURSE_TYPE, DATE_FORMAT, LABEL_MAX_LENGTH } from 'src/constants'
import { IconEssentional } from '@assets/icons/Dashboard'
import Link from 'next/link'

const LearningResult = () => {
    const router = useRouter()
    const [option, setOption] = useState<any>()
    const [isLoading, setIsLoading] = useState<boolean>(true)
    const [hasLearning, setHasLearning] = useState<boolean>(false)
    const [mockTestId, setMockTestId] = useState<string>('')
    const courseInfo = JSON.parse(localStorage.getItem('courseInfo') as any)
    const isNormal = courseInfo?.courseType == COURSE_TYPE.NORMAL_COURSE

    const shortName = (name: string) => {
        return name.length < LABEL_MAX_LENGTH
            ? name
            : `${name.slice(0, LABEL_MAX_LENGTH)}...`
    }

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
        <div className="flex h-[55vh] w-full rounded-2xl bg-white shadow-matchingquiz p-8">
            <div className="w-full">
                <div className="mb-5 flex items-center justify-between pb-3">
                    <div className="flex-col">
                        <div className="flex">
                            <div className="min-w-fit text-xl font-semibold">
                                Your Learning Results
                            </div>
                            <div className="ms-2">
                                <IconEssentional />
                            </div>
                        </div>
                        <div className="text-sm text-ink-400">
                            {`Last Update: ${dayjs().format(DATE_FORMAT.DATE_TIME_DASH)}`}
                        </div>
                    </div>
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
                                            className={`inline-block min-w-fit text-base font-medium text-ink-800 ${!mockTestId ? 'pointer-events-none' : 'hover:text-[#6FD195]'}`}
                                            rel="noreferrer"
                                        >
                                            Mock test results
                                        </Link>
                                    </div>
                                )}

                                {isNormal || hasLearning ? (
                                    <div className="flex items-center justify-center gap-2.5">
                                        <span className="min-h-3 min-w-3 rounded-full bg-[#6FD3B0]"></span>
                                        <span className="min-w-fit text-base font-medium text-ink-800">
                                            Learning results
                                        </span>
                                    </div>
                                ) : null}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {!isLoading && !option && (
                <div className="flex grow items-center justify-center">
                    <NoData />
                </div>
            )}
        </div>
    )
}

export default LearningResult
