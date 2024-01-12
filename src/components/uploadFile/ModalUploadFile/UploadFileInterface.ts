import DocIcon from 'src/_metronic/assets/icons/document-icon.svg'
import ImageIcon from 'src/_metronic/assets/icons/image-icon.svg'
import VideoIcon from 'src/_metronic/assets/icons/video-icon.svg'
import {
  MAX_UPLOAD_SIZE,
  MAX_UPLOAD_VIDEO_SIZE,
  VALID_UPLOAD_FILES,
} from 'src/constants/upload'
export interface IResource {
  id: string
  created_at: string
  updated_at: string
  name: string
  location: string
  resource_type: string
  suffix_type: string
  is_default: boolean
  thumbnail: string
  size: string
  status: boolean
  files?: {
    id: string
    object_id: string
    type: string
    created_at: string
    updated_at: string
  }[]
}

export enum RESOURCE_LOCATION {
  topic = 'topic',
  question = 'question',
  activity = 'activity',
  story = 'story',
  course = 'course',
  resource = 'resource',
  root = '',
  mail = 'mail',
  certificate = 'certificate',
}
export enum SUFFIX_TYPE {
  'FOLDER' = 'FOLDER',
  'GENERAL_FILE' = 'GENERAL_FILE',
  'IMAGE' = 'IMAGE',
  'VIDEO' = 'VIDEO',
  'POWER_POINT' = 'POWER_POINT',
  'PDF' = 'PDF',
  'DOCUMENT_VIEWER' = 'DOCUMENT_VIEWER',
  'WORD_DOCUMENT' = 'WORD_DOCUMENT',
  'SHEET' = 'SHEET',
  'NOT_A_FILE' = 'NOT_A_FILE',
  'TEXT' = 'TEXT',
}

export const UPLOAD_TYPE: {
  [key: string]: {
    type: 'VIDEO' | 'IMAGE' | 'DOCUMENT' | 'ALL' | 'ALL_RESOURCE'
    icon: string | string[]
    accept: string
    extension: string
    acceptFiles: { type: string; size: number }[]
    suffixType: string
    note: string[]
  }
} = {
  VIDEO: {
    type: 'VIDEO',
    icon: VideoIcon,
    accept: '.mp4',
    extension: 'MP4',
    note: ['MP4'],
    acceptFiles: [{ type: 'video/mp4', size: MAX_UPLOAD_VIDEO_SIZE }],
    suffixType: 'VIDEO',
  },
  IMAGE: {
    type: 'IMAGE',
    icon: ImageIcon,
    accept: 'image/*',
    extension: '.jpg, .jpeg, .png, .gif, .webp',
    note: ['.jpg, .jpeg, .png, .gif, .webp'],
    acceptFiles: [{ type: 'image/*', size: MAX_UPLOAD_SIZE }],
    suffixType: 'IMAGE',
  },
  DOCUMENT: {
    type: 'DOCUMENT',
    icon: DocIcon,
    accept: '.pdf,.docx,.doc,.xls,.xlsx,.csv,.txt,.ppt,.pptx',
    extension: '.pdf, .docx, .doc, .xls, .xlsx, .csv, .txt, .ppt, .pptx',
    note: [
      '.pdf, .docx, .doc, .xls, .xlsx, .csv, .txt, .ppt, .pptx',
      'và dung lượng tối đa mỗi file là 20MB.',
    ],
    acceptFiles: VALID_UPLOAD_FILES,
    suffixType: `${SUFFIX_TYPE.PDF},${SUFFIX_TYPE.WORD_DOCUMENT},${SUFFIX_TYPE.DOCUMENT_VIEWER},${SUFFIX_TYPE.SHEET},${SUFFIX_TYPE.POWER_POINT},${SUFFIX_TYPE.TEXT}`,
  },
  ALL: {
    type: 'ALL',
    icon: [DocIcon, VideoIcon, ImageIcon],
    accept: 'image/*,.mp4,.pdf,.docx,.xls,.xlsx,.csv,.txt',
    extension:
      '.jpg, .jpeg, .png, .gif, .webp, .mp4, .pdf, .docx, .doc, .xls, .xlsx, .csv, .txt, .ppt, .pptx',
    note: [
      '.jpg, .jpeg, .png, .gif, .webp, .mp4, .pdf, .docx, .doc, .xls, .xlsx, .csv, .txt, .ppt, .pptx',
    ],
    acceptFiles: [
      ...VALID_UPLOAD_FILES,
      { type: 'video/mp4', size: MAX_UPLOAD_VIDEO_SIZE },
      { type: 'image/*', size: MAX_UPLOAD_SIZE },
    ],
    suffixType: '',
  },
  ALL_RESOURCE: {
    type: 'ALL_RESOURCE',
    icon: [DocIcon, VideoIcon, ImageIcon],
    accept:
      'image/*,.mp4, .pdf, .docx, .doc, .xls, .xlsx, .csv, .txt, .ppt, .pptx',
    extension:
      '.jpg, .jpeg, .png, .gif, .webp, .mp4, .pdf, .docx, .doc, .xls, .xlsx, .csv, .txt, .ppt, .pptx',
    note: [
      '.jpg, .jpeg, .png, .gif, .webp, .mp4, .pdf, .docx, .doc, .xls, .xlsx, .csv, .txt, .ppt, .pptx',
      'Kích thước tối đa của file là 20MB, video là 20GB',
    ],
    acceptFiles: [
      ...VALID_UPLOAD_FILES,
      { type: 'video/mp4', size: MAX_UPLOAD_VIDEO_SIZE },
      { type: 'image/*', size: MAX_UPLOAD_SIZE },
      {
        type: 'application/vnd.ms-powerpoint',
        size: MAX_UPLOAD_SIZE,
      },
      {
        type: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
        size: MAX_UPLOAD_SIZE,
      },
    ],
    suffixType: '',
  },
}
