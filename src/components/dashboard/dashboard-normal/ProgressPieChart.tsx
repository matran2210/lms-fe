import React, { useMemo } from 'react'
import { EChartsOption } from 'echarts'
import EChart from '@components/base/chart/Chart'

interface ProgressPieChartProps {
  completed: number
  uncompleted: number
  total: number
}

const ProgressPieChart: React.FC<ProgressPieChartProps> = ({
  completed,
  uncompleted,
  total,
}) => {
  const option = useMemo(() => ({
    title: {
      text: `${completed}/${total}`,
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
            value: completed,
            name: '',
            itemStyle: { color: '#FFB700', borderRadius: [20, 20, 20, 20] },
          },
          {
            value: uncompleted,
            name: '',
            itemStyle: { color: '#FFF1CC', borderRadius: [-20, -20, -20, -20] },
          },
        ],
      },
    ],
  }), [completed, uncompleted, total])

  return <EChart option={option as EChartsOption} height="260px" />
}

export default ProgressPieChart