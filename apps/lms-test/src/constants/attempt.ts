export enum EAttemptStatus {
  UN_SUBMITTED = 'UN_SUBMITTED',
  SUBMITTED = 'SUBMITTED',
  UN_FINISHED = 'UN_FINISHED',
  IN_PROGRESS = 'IN_PROGRESS',
  NOT_STARTED = 'NOT_STARTED',
  AWAITING_GRADING = 'AWAITING_GRADING',
  REGRADING = 'REGRADING',
  IN_REVIEW = 'IN_REVIEW',
  FINISHED_GRADING = 'FINISHED_GRADING',
  FINISHED = 'FINISHED',
  EXPIRED = 'EXPIRED',
}

export type SheetData = {
  name: string
  id: string
  status: number
  data: (string | number | null)[][]
  celldata: {
    r: number
    c: number
    v: { v: string; ct: { fa: string; t: string }; m: string }
  }[]
  row?: number
  column?: number
}
// Generate unique ID for sheets
export const generateSheetId = (): string => {
  return `sheet_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}
export const setDefaultIdToSheetData = (defaultValue: string): string => {
  const parseDefault: SheetData[] = JSON.parse(defaultValue) || [
    {
      name: 'Sheet1',
      id: generateSheetId(),
      status: 1,
      data: [[]],
      celldata: [],
    },
  ]
  const formattedDefault = parseDefault.map((sheet) => ({
    ...sheet,
    id: sheet.id || generateSheetId(),
  }))
  return JSON.stringify(formattedDefault)
}
export const defaultSheetData = JSON.stringify([
  {
    name: 'Sheet1',
    id: generateSheetId(),
    status: 1,
    data: [[]],
    celldata: [],
  },
])
export const DEFAULT_EDITOR_VALUE = '<p></p>'
