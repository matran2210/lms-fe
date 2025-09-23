import { Workbook } from '@fortune-sheet/react'
import { isEmpty, isNull, isUndefined } from 'lodash'
import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { generateSheetId } from 'src/constants/attempt'

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
  const [initialData] = useState(() => {
    try {
      return defaultValue && String(defaultValue).trim() !== ''
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
    } catch {
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

  const normalizedData = useMemo(() => {
    try {
      const sheets = Array.isArray(initialData) ? initialData : []
      const result = sheets.map((sheet: any, idx: number) => {
        const rawRows: any[] = Array.isArray(sheet?.data) ? sheet.data : [[]]
        const rowCount = Math.max(rawRows.length, 1)
        const colCount = Math.max(
          1,
          ...rawRows.map((r) => (Array.isArray(r) ? r.length : 0)),
        )
        const padded: any[][] = Array(rowCount)
          .fill(null)
          .map((_, r) => {
            const row = Array.isArray(rawRows[r]) ? rawRows[r] : []
            const arr = Array(colCount).fill(null)
            for (let c = 0; c < Math.min(colCount, row.length); c++) {
              arr[c] = row[c]
            }
            return arr
          })
        const builtCelldata: any[] = []
        for (let r = 0; r < rowCount; r++) {
          for (let c = 0; c < colCount; c++) {
            const cell = padded[r][c]
            if (cell && typeof cell === 'object') {
              builtCelldata.push({ r, c, v: cell })
            }
          }
        }
        return {
          name: sheet?.name || `Sheet${idx + 1}`,
          id: sheet?.id || generateSheetId(),
          status:
            typeof sheet?.status === 'number'
              ? sheet.status
              : idx === 0
                ? 1
                : 0,
          row: sheet?.row || rowCount,
          column: sheet?.column || colCount,
          celldata:
            Array.isArray(sheet?.celldata) && sheet.celldata.length > 0
              ? sheet.celldata
              : builtCelldata,
          data: padded,
        }
      })
      // eslint-disable-next-line no-console
      console.log(
        '[SHEET][HookFormExcel] normalizedData sheets:',
        result.length,
      )
      return result
    } catch {
      return initialData
    }
  }, [initialData])

  const handleWorkbookChange = useCallback(() => {
    if (ignoreStructOpsRef.current) return
    if (!fullData?.is_viewed_answer && !fullData?.confirmed) {
      const currentSheet = refSheet.current?.getSheet()
      // if (!currentSheet?.id) return

      if (value) {
        let old = [...JSON.parse(value)]
        const index = old?.findIndex((e: any) => e?.id === currentSheet?.id)

        if (index >= 0) {
          old.splice(index, 1, currentSheet)
        } else {
          old.push(currentSheet)
        }

        sheetsSnapshotRef.current = old
        onChange(JSON.stringify(old))
      } else {
        const newData = [currentSheet]
        sheetsSnapshotRef.current = newData
        onChange(JSON.stringify(newData))
      }
    }
  }, [onChange, fullData])
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

  return (
    <Workbook
      data={normalizedData}
      ref={refSheet}
      onChange={handleWorkbookChange}
      onOp={onOp}
    />
  )
}

export default memo(HookFormExcel)
