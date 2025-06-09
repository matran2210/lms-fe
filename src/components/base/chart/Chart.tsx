import React, { useRef, useEffect } from 'react'
import { init, getInstanceByDom } from 'echarts'
import type { CSSProperties } from 'react'
import type { EChartsOption, ECharts, SetOptionOpts } from 'echarts'

export interface EChartsProps {
  option: EChartsOption
  style?: CSSProperties
  settings?: SetOptionOpts
  loading?: boolean
  theme?: 'light' | 'dark'
  width?: string
  height?: string
}

export default function EChart({
  option,
  style,
  settings,
  loading,
  theme,
  height,
  width,
}: EChartsProps): JSX.Element {
  const chartRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let chart: ECharts | undefined
    if (chartRef.current) {
      chart = init(chartRef.current, theme)
    }

    function resizeChart() {
      chart?.resize()
    }
    window.addEventListener('resize', resizeChart)

    return () => {
      chart?.dispose()
      window.removeEventListener('resize', resizeChart)
    }
  }, [theme])

  useEffect(() => {
    if (chartRef.current) {
      const chart = getInstanceByDom(chartRef.current)
      chart?.setOption(option, settings)
    }
  }, [option, settings, theme])

  useEffect(() => {
    if (chartRef.current) {
      const chart = getInstanceByDom(chartRef.current)
      loading ? chart?.showLoading() : chart?.hideLoading()
    }
  }, [loading, theme])

  return (
    <div
      ref={chartRef}
      style={{
        width: width ?? '100%',
        height: height ?? '100%',
        minHeight: '300px',
        position: 'relative',
        ...style,
      }}
    />
  )
}
