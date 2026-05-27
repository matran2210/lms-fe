"use client"
import dynamic from 'next/dynamic'
import { isEmpty, isNull, isUndefined } from 'lodash'
import { memo, useCallback, useEffect, useMemo, useState } from 'react'
import { generateSheetId } from '@lms/core'

// @fortune-sheet/react ~2MB — lazy load, chỉ dùng trong form editor
const Workbook = dynamic(
  () => import('@fortune-sheet/react').then((m) => m.Workbook),
  { ssr: false },
)

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

  return (
    <Workbook
      key={workbookKey}
      data={normalizedData}
      ref={refSheet}
      onChange={handleWorkbookChange}
      onOp={onOp}
    />
  )
}

export default memo(HookFormExcel)
