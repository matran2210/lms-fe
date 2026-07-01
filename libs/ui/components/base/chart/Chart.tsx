"use client"
import React, { useRef, useEffect } from 'react'
import type { CSSProperties } from 'react'
import type { EChartsOption, ECharts, SetOptionOpts } from 'echarts'

type EChartEventHandlers = Record<string, (params: unknown) => void>

// echarts ~1MB gzipped — lazy load, chỉ init khi component mount
async function getEcharts() {
  const { init, getInstanceByDom } = await import('echarts')
  return { init, getInstanceByDom }
}

export interface EChartsProps {
  option: EChartsOption
  style?: CSSProperties
  settings?: SetOptionOpts
  loading?: boolean
  theme?: 'light' | 'dark'
  width?: string
  height?: string
  minHeight?: string
  /**
   * Bind sự kiện echarts vào instance (vd: { mouseover, mousemove, mouseout }).
   * Handler luôn gọi phiên bản mới nhất nên không cần memo hóa, nhưng tập key
   * được dùng tại thời điểm chart khởi tạo.
   */
  onEvents?: EChartEventHandlers
  /** Gọi với instance echarts ngay sau khi init — để bind zrender event, đọc coordinateSystem... */
  onChartReady?: (chart: ECharts) => void
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
  onEvents,
  onChartReady,
}: EChartsProps): JSX.Element {
  const chartRef = useRef<HTMLDivElement>(null)
  // Giữ handler mới nhất để không phải rebind mỗi lần render
  const onEventsRef = useRef(onEvents)
  onEventsRef.current = onEvents
  const onChartReadyRef = useRef(onChartReady)
  onChartReadyRef.current = onChartReady

  // ResizeObserver để tự động resize chart khi container thay đổi kích thước
  useEffect(() => {
    let chart: ECharts | undefined
    let resizeObserver: ResizeObserver | undefined

    getEcharts().then(({ init }) => {
      if (chartRef.current) {
        chart = init(chartRef.current, theme)
        resizeObserver = new ResizeObserver(() => {
          chart?.resize()
        })
        resizeObserver.observe(chartRef.current)

        // Bind sự kiện echarts (dispatch tới handler mới nhất qua ref)
        const handlers = onEventsRef.current
        if (handlers) {
          Object.keys(handlers).forEach((evt) => {
            chart?.on(evt, (params: unknown) =>
              onEventsRef.current?.[evt]?.(params),
            )
          })
        }

        // Trao instance cho consumer (bind zrender event, đọc coordinateSystem...)
        onChartReadyRef.current?.(chart)
      }
    })

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
    getEcharts().then(({ getInstanceByDom }) => {
      if (chartRef.current) {
        const chart = getInstanceByDom(chartRef.current)
        chart?.setOption(option, settings)
      }
    })
  }, [option, settings, theme])

  useEffect(() => {
    getEcharts().then(({ getInstanceByDom }) => {
      if (chartRef.current) {
        const chart = getInstanceByDom(chartRef.current)
        loading ? chart?.showLoading() : chart?.hideLoading()
      }
    })
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
