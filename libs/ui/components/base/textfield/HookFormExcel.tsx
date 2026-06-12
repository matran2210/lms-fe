"use client"
import { Workbook } from '@fortune-sheet/react'
import { isEmpty, isNull, isUndefined } from 'lodash'
import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { generateSheetId } from '@lms/core'

interface WorkbookFieldProps {
  index?: number
  value?: string
  defaultValue?: string
  onChange: (val: string) => void
  onOp?: ((op: any[]) => void) | undefined
  fullData: any
  ignoreStructOpsRef: React.MutableRefObject<boolean>
  refSheet: React.MutableRefObject<any>
  sheetsSnapshotRef: React.MutableRefObject<any[] | null>
  question_data: any
}

const HookFormExcel: React.FC<WorkbookFieldProps> = ({
  index,
  value,
  defaultValue,
  onChange,
  fullData,
  ignoreStructOpsRef,
  refSheet,
  sheetsSnapshotRef,
  onOp,
  question_data,
}) => {
  const workbookWrapperRef = useRef<HTMLDivElement>(null)

  // init data
  const [initialData, setInitialData] = useState(() => {
    try {
      const parsed =
        defaultValue && String(defaultValue).trim() !== ''
          ? JSON.parse(defaultValue)
          : [
              {
                name: 'Sheet1',
                id: generateSheetId(),
                status: 1,
                data: [[]],
                celldata: [],
              },
            ]

      return parsed
    } catch (e) {
      return [
        {
          name: 'Sheet1',
          id: generateSheetId(),
          status: 1,
          data: [[]],
          celldata: [],
        },
      ]
    }
  })

  // Debug: Log khi defaultValue thay đổi
  useEffect(() => {
    if (defaultValue && String(defaultValue).trim() !== '') {
      try {
        const parsed = JSON.parse(defaultValue)

        // Cập nhật initialData nếu có thay đổi
        if (Array.isArray(parsed) && parsed.length !== initialData.length) {
          setInitialData(parsed)
        }
      } catch (e) {
        // Ignored
      }
    }
  }, [defaultValue, initialData.length])

  // normalize + build celldata fallback
  const normalizedData = useMemo(() => {
    if (!initialData || initialData.length === 0) {
      return [
        {
          name: 'Sheet1',
          id: generateSheetId(),
          status: 1,
          data: [[]],
          celldata: [],
        },
      ]
    }

    return initialData.map((sheet: any) => {
      if (!sheet.celldata || sheet.celldata.length === 0) {
        const celldata: any[] = []
        if (sheet.data && Array.isArray(sheet.data)) {
          sheet.data.forEach((row: any, rowIndex: number) => {
            if (Array.isArray(row)) {
              row.forEach((cell: any, colIndex: number) => {
                if (cell && typeof cell === 'object' && cell.v !== undefined) {
                  celldata.push({
                    r: rowIndex,
                    c: colIndex,
                    v: cell,
                  })
                }
              })
            }
          })
        }
        return { ...sheet, celldata }
      }
      return sheet
    })
  }, [initialData])

  // handle change
  const handleWorkbookChange = useCallback(() => {
    if (ignoreStructOpsRef.current) return
    if (!fullData?.is_viewed_answer && !fullData?.confirmed) {
      const currentSheet = refSheet.current?.getSheet()
      if (!currentSheet) return

      // Strategy: Lấy tất cả sheets từ Fortune Sheet để đảm bảo không mất sheet nào
      const allSheets = refSheet.current?.getAllSheets?.() || []

      if (allSheets.length > 0) {
        // Sử dụng tất cả sheets từ Fortune Sheet
        sheetsSnapshotRef.current = allSheets
        onChange(JSON.stringify(allSheets))
      } else if (value) {
        // Fallback: nếu getAllSheets không hoạt động, dùng logic cũ
        const old = [...JSON.parse(value)]
        const index = old?.findIndex((e: any) => e?.id === currentSheet?.id)

        if (index >= 0) {
          old.splice(index, 1, currentSheet)
        } else {
          old.push(currentSheet)
        }

        sheetsSnapshotRef.current = old
        onChange(JSON.stringify(old))
      } else {
        // Tạo mới từ sheet active
        const newData = [currentSheet]
        sheetsSnapshotRef.current = newData
        onChange(JSON.stringify(newData))
      }
    }
  }, [
    onChange,
    fullData,
    value,
    ignoreStructOpsRef,
    refSheet,
    sheetsSnapshotRef,
  ])

  // Force save khi component unmount
  useEffect(() => {
    const currentRefSheet = refSheet.current
    const currentIgnoreStructOps = ignoreStructOpsRef.current

    return () => {
      // Cleanup: force save tất cả sheets khi component unmount
      if (currentRefSheet && !currentIgnoreStructOps) {
        const allSheets = currentRefSheet?.getAllSheets?.()
        if (allSheets && allSheets.length > 0) {
          try {
            onChange(JSON.stringify(allSheets))
          } catch (error) {
            // Silent error - component is unmounting
          }
        }
      }
    }
  }, [onChange, ignoreStructOpsRef, refSheet])

  // validate JSON
  const isValid = (value?: string) => {
    try {
      if (!value || isEmpty(value) || isUndefined(value) || isNull(value))
        return false
      JSON.parse(value)
      return true
    } catch {
      return false
    }
  }

  // Generate key để force re-render khi normalizedData thay đổi
  const workbookKey = useMemo(() => {
    return normalizedData?.length
      ? `workbook-${normalizedData.length}-${normalizedData.map((s: any) => s.id).join('-')}`
      : 'workbook-default'
  }, [normalizedData])

  const getScrollableParent = useCallback(
    (element: HTMLElement | null, deltaY: number) => {
      let parent = element?.parentElement ?? null

      while (parent) {
        const { overflowY } = window.getComputedStyle(parent)
        const canScroll =
          /(auto|scroll|overlay)/.test(overflowY) &&
          parent.scrollHeight > parent.clientHeight
        const canScrollUp = deltaY < 0 && parent.scrollTop > 0
        const canScrollDown =
          deltaY > 0 &&
          parent.scrollTop + parent.clientHeight < parent.scrollHeight

        if (canScroll && (canScrollUp || canScrollDown)) return parent

        parent = parent.parentElement
      }

      const documentElement = document.scrollingElement as HTMLElement | null
      if (!documentElement) return null

      const canScrollDocumentUp = deltaY < 0 && documentElement.scrollTop > 0
      const canScrollDocumentDown =
        deltaY > 0 &&
        documentElement.scrollTop + window.innerHeight <
          documentElement.scrollHeight

      return canScrollDocumentUp || canScrollDocumentDown
        ? documentElement
        : null
    },
    [],
  )

  useEffect(() => {
    const wrapper = workbookWrapperRef.current
    if (!wrapper) return

    const isElementClippedInScrollDirection = (
      element: HTMLElement,
      parent: HTMLElement,
      deltaY: number,
    ) => {
      const elementRect = element.getBoundingClientRect()
      const parentRect =
        parent === document.scrollingElement
          ? { top: 0, bottom: window.innerHeight }
          : parent.getBoundingClientRect()

      if (deltaY < 0) return elementRect.top < parentRect.top - 1
      if (deltaY > 0) return elementRect.bottom > parentRect.bottom + 1

      return false
    }

    const handleNativeWheel = (event: WheelEvent) => {
      const target = event.target
      if (!(target instanceof Node) || !wrapper.contains(target)) {
        return
      }

      if (event.ctrlKey || Math.abs(event.deltaY) <= Math.abs(event.deltaX)) {
        return
      }

      const scrollbarY = wrapper.querySelector<HTMLElement>(
        '.luckysheet-scrollbar-y',
      )
      if (event.deltaY < 0 && scrollbarY && scrollbarY.scrollTop > 0) {
        event.preventDefault()
        event.stopPropagation()
        event.stopImmediatePropagation()

        const nextScrollTop = Math.max(
          0,
          scrollbarY.scrollTop + event.deltaY,
        )

        if (refSheet.current?.scroll) {
          refSheet.current.scroll({ scrollTop: nextScrollTop })
        } else {
          scrollbarY.scrollTop = nextScrollTop
          scrollbarY.dispatchEvent(new Event('scroll', { bubbles: true }))
        }
        return
      }

      const parent = getScrollableParent(wrapper, event.deltaY)
      if (!parent) return

      const maxScrollTop = scrollbarY
        ? scrollbarY.scrollHeight - scrollbarY.clientHeight
        : 0
      const isAtTop = !scrollbarY || scrollbarY.scrollTop <= 1
      const isAtBottom =
        !scrollbarY || scrollbarY.scrollTop >= maxScrollTop - 1
      const shouldBubbleToParent =
        (event.deltaY < 0 && isAtTop) || (event.deltaY > 0 && isAtBottom)
      const shouldPrioritizeParent = isElementClippedInScrollDirection(
        wrapper,
        parent,
        event.deltaY,
      )
      const shouldScrollParentFirst = event.deltaY < 0

      if (
        !shouldBubbleToParent &&
        !shouldPrioritizeParent &&
        !shouldScrollParentFirst
      )
        return

      event.preventDefault()
      event.stopPropagation()
      event.stopImmediatePropagation()

      if (parent === document.scrollingElement) {
        window.scrollBy({ top: event.deltaY, behavior: 'auto' })
        return
      }

      parent.scrollBy({ top: event.deltaY, behavior: 'auto' })
    }

    document.addEventListener('wheel', handleNativeWheel, {
      capture: true,
      passive: false,
    })

    return () => {
      document.removeEventListener('wheel', handleNativeWheel, {
        capture: true,
      })
    }
  }, [getScrollableParent])

  return (
    <div
      ref={workbookWrapperRef}
      className="h-full w-full"
    >
      <Workbook
        key={workbookKey}
        data={normalizedData}
        ref={refSheet}
        onChange={handleWorkbookChange}
        onOp={onOp}
      />
    </div>
  )
}

export default memo(HookFormExcel)
