export enum EAttemptStatus {
  UN_SUBMITTED = 'UN_SUBMITTED',
  SUBMITTED = 'SUBMITTED',
  UN_FINISHED = 'UN_FINISHED',
  IN_PROGRESS = 'IN_PROGRESS',
}

// Generate unique ID for sheets
export const generateSheetId = (): string => {
  return `sheet_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
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
