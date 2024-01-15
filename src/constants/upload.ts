export const MAX_UPLOAD_SIZE = 20 * 1024 * 1024
export const MAX_UPLOAD_VIDEO_SIZE = 20 * 1024 * 1024 * 1024

export const VALID_UPLOAD_EDITOR = [
  { type: 'image/*', size: MAX_UPLOAD_SIZE },
  { type: 'video/*', size: MAX_UPLOAD_VIDEO_SIZE },
]
export const VALID_UPLOAD_EDITOR_VIDEO = [
  { type: 'video/*', size: MAX_UPLOAD_VIDEO_SIZE },
]
export const VALID_UPLOAD_EDITOR_IMAGE = [
  { type: 'image/*', size: MAX_UPLOAD_SIZE },
]
export const VALID_UPLOAD_FILES = [
  { type: 'application/pdf', size: MAX_UPLOAD_SIZE },
  {
    type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    size: MAX_UPLOAD_SIZE,
  },
  {
    type: 'application/msword',
    size: MAX_UPLOAD_SIZE,
  },
  {
    type: 'application/vnd.ms-excel',
    size: MAX_UPLOAD_SIZE,
  },
  {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    size: MAX_UPLOAD_SIZE,
  },
  { type: 'text/csv', size: MAX_UPLOAD_SIZE },
  { type: 'text/plain', size: MAX_UPLOAD_SIZE },
  {
    type: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    size: MAX_UPLOAD_SIZE,
  },
  {
    type: 'application/vnd.ms-powerpoint',
    size: MAX_UPLOAD_SIZE,
  },
  {
    type: 'application/zip',
    size: MAX_UPLOAD_SIZE,
  },
]
