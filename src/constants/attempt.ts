export enum EAttemptStatus {
  UN_SUBMITTED = 'UN_SUBMITTED',
  SUBMITTED = 'SUBMITTED',
  UN_FINISHED = 'UN_FINISHED',
  IN_PROGRESS = 'IN_PROGRESS',
}
export const defaultSheetData = JSON.stringify([
  { name: 'Sheet1', id: '', status: 1, data: [[]], celldata: [] },
])
