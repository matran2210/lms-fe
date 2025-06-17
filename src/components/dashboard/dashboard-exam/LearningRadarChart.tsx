import React, { useMemo } from 'react'
import { EChartsOption } from 'echarts'
import { ILearningResult, IMockTestResult } from 'src/type/dashboard'
import EChart from '@components/base/chart/Chart'

interface LearningRadarChartProps {
  results: ILearningResult[] | IMockTestResult[]
  isNormal: boolean
}

const LearningRadarChart: React.FC<LearningRadarChartProps> = ({
  results,
  isNormal,
}) => {
  const option = useMemo(() => {
    if (!results || results.length === 0) return {}

    const maxValues = results.map((result: any) => {
      const learning = result?.score || 0
      const mock = result?.mock_test_score || 0
      return Math.max(learning, mock, 100)
    })
    const indicator = results.map((result: any, idx: number) => ({
      text: result?.short_name || result?.name,
      max: maxValues[idx],
    }))

    return {
      tooltip: {
        trigger: 'item',
        formatter: function (params: any) {
          const values = params.value
          const indicators = results.map((e: any) => e.name)
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
              value: results.map((result: ILearningResult | IMockTestResult) =>
                'score' in result ? result.score : 0,
              ),
              areaStyle: { color: 'rgba(111, 211, 176, 0.45)' },
              lineStyle: { color: '#6FD3B0', width: 1 },
              itemStyle: { color: '#6FD3B0' },
            },
            {
              name: 'Mock test results',
              value: results.map((result: ILearningResult | IMockTestResult) =>
                'mock_test_score' in result ? result.mock_test_score : 0,
              ),
              areaStyle: { color: 'rgba(251, 140, 91, 0.45)' },
              lineStyle: { color: '#FB8C5B', width: 1 },
              itemStyle: { color: '#FB8C5B' },
            },
          ],
        },
      ],
    }
  }, [results, isNormal])

  if (!results || results.length === 0) return null

  return <EChart option={option as EChartsOption} height="400px" />
}

export default LearningRadarChart
