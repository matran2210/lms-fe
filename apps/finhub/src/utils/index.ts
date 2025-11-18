import {
  deserializeHighlights,
  doHighlight,
  optionsImpl,
  removeHighlights,
  serializeHighlights,
} from '@/../node_modules/@funktechno/texthighlighter/lib/index'
import dayjs from 'dayjs'
import weekday from 'dayjs/plugin/weekday'
import DOMPurify from 'dompurify'
import { isEmpty, isNull, isUndefined } from 'lodash'
import { useQuery } from 'react-query'
import utc from 'dayjs/plugin/utc'
import { DATE_FORMAT } from '@lms/core'
import { UploadAPI } from '@pages/api/short-course/upload'
import { formatDateFromUTC } from '@lms/utils'

dayjs.extend(utc)

dayjs.extend(weekday)


export const bytesToKilobyte = (bytes: number, suffix = 'Kb') => {
  return `${(bytes / 1024).toFixed(2)}${suffix}` // 1 kilobyte = 1024 bytes
}

export const download = async (name: string, file_key: string) => {
  await UploadAPI.downloadFile({
    files: [
      {
        name: name,
        file_key: file_key,
      },
    ],
  })
}

// Chuyển bytes thành đơn vị phù hợp: < 1MB -> Kb, < 1GB -> Mb, còn lại -> Gb
export const formatBytes = (bytes: number) => {
  const KB = 1024
  const MB = KB * 1024
  const GB = MB * 1024

  if (bytes >= GB) return `${(bytes / GB).toFixed(2)}Gb`
  if (bytes >= MB) return `${(bytes / MB).toFixed(2)}Mb`
  return `${(bytes / KB).toFixed(2)}Kb`
}
