import { SheetData } from '@components/questionType/ConstructedQuestion'
import { Workbook } from '@fortune-sheet/react'
import { isEmpty, isNull, isUndefined } from 'lodash'
import { memo, useCallback, useEffect, useRef, useState } from 'react'
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

  // nếu value thay đổi từ ngoài (ví dụ load form mới) → chỉ setData lúc đầu, không push liên tục
  // useEffect(() => {
  //     if (
  //         refSheet &&
  //         refSheet.current &&
  //         Number(index) <= question_data?.requirements?.length
  //     ) {
  //         if (
  //             defaultValue === undefined ||
  //             defaultValue === null ||
  //             String(defaultValue).trim() === ''
  //         ) {
  //             const emptySheets = refSheet.current
  //                 ?.getAllSheets()
  //                 .map((sheet: SheetData) => ({
  //                     ...sheet,
  //                     celldata: [],
  //                     data: Array(sheet.row || 100)
  //                         .fill(null)
  //                         .map(() => Array(sheet.column || 50).fill(null)),
  //                 }))
  //             emptySheets.forEach((sheet: SheetData) => {
  //                 refSheet.current?.updateSheet(JSON.parse(JSON.stringify([sheet])))
  //             })
  //         } else {
  //             const sheetData =
  //                 defaultValue && String(defaultValue).trim() !== ''
  //                     ? JSON.parse(defaultValue)
  //                     : [
  //                         {
  //                             name: 'Sheet1',
  //                             id: generateSheetId(),
  //                             status: 1,
  //                             data: [[]],
  //                             celldata: [],
  //                         },
  //                     ]

  //             // Convert sheetData to constructor with id of refSheet.current
  //             const currentSheets = refSheet.current.getAllSheets()
  //             const updatedSheetData = sheetData.map(
  //                 (sheet: SheetData, index: number) => ({
  //                     ...sheet,
  //                     id: currentSheets[index]?.id || '',
  //                 }),
  //             )

  //             const emptySheets = currentSheets.map((sheet: SheetData) => ({
  //                 ...sheet,
  //                 celldata: [],
  //                 data: Array(sheet.row || 100)
  //                     .fill(null)
  //                     .map(() => Array(sheet.column || 50).fill(null)),
  //             }))
  //             emptySheets.forEach((sheet: SheetData, index: number) => {
  //                 if (sheet?.name === sheetData[index]?.name) {
  //                     refSheet.current?.updateSheet(
  //                         JSON.parse(JSON.stringify([updatedSheetData[index]])),
  //                     )
  //                 } else {
  //                     refSheet.current?.updateSheet(JSON.parse(JSON.stringify([sheet])))
  //                 }
  //             })
  //         }
  //     }
  // }, [defaultValue, index])

  const handleWorkbookChange = useCallback(() => {
    if (ignoreStructOpsRef.current) return
    if (!fullData?.is_viewed_answer && !fullData?.confirmed) {
      const currentSheet = refSheet.current?.getSheet()
      if (!currentSheet?.id) return

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
      // data={defaultValue && isValid(defaultValue) ? JSON.parse(defaultValue) : [
      //     {
      //         name: 'Sheet1',
      //         // config: {
      //         //   authority: {

      //         //     sheet: true, //If it is 1 or true, the worksheet is protected; if it is 0 or false, the worksheet is not protected.

      //         //   },
      //         // },
      //     },
      // ]}
      data={initialData}
      ref={refSheet}
      onChange={handleWorkbookChange}
      onOp={onOp}
    />
  )
}

export default memo(HookFormExcel)
