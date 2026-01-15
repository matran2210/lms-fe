"use client"
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
  minHeight?: string
}

export default function EChart({
  option,
  style,
  settings,
  loading,
  theme,
  height = '100%',
  width = '100%',
  minHeight = '380px',
}: EChartsProps): JSX.Element {
  const chartRef = useRef<HTMLDivElement>(null)

  // ResizeObserver để tự động resize chart khi container thay đổi kích thước
  useEffect(() => {
    let chart: ECharts | undefined
    let resizeObserver: ResizeObserver | undefined
    if (chartRef.current) {
      chart = init(chartRef.current, theme)
      // Resize khi container thay đổi kích thước
      resizeObserver = new ResizeObserver(() => {
        chart?.resize()
      })
      resizeObserver.observe(chartRef.current)
    }

    function resizeChart() {
      chart?.resize()
    }
    window.addEventListener('resize', resizeChart)

    return () => {
      chart?.dispose()
      window.removeEventListener('resize', resizeChart)
      if (resizeObserver && chartRef.current) {
        resizeObserver.unobserve(chartRef.current)
      }
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
        width: width,
        height: height,
        minHeight: minHeight,
        position: 'relative',
        ...style,
      }}
    />
  )
}
